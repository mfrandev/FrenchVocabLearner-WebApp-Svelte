import { getRandomWord } from "../../Database/Model/Dictionary/Word";
import { WordModel } from "../../Database/Model/Dictionary/Word";
import { generateFlashcardFromWordModel, generateFlashcardFromWordID } from "../../Database/Queries/FlashcardQueries/GetWordFlashcards";
import { WordFlashcardData } from "../../Database/Queries/FlashcardQueries/GetWordFlashcards";
import { getRandomQuizAvailability } from "../../Database/Model/Dictionary/WordsLearnedByAccount";
import { getRandomWordIDLearnedByAccount } from "../../Database/Model/Dictionary/WordsLearnedByAccount";
import { Status } from "../../Config/DBConfig";

/**
 * Fetch 10 random, unique words from the database for the user to learn 
 * @returns 
 */
export const learnTenRandomWords = async (): Promise<WordFlashcardData[]> => {

    //Save the word models for each word, since getRandomWord() returns a word model
    const words: WordModel[] = [];

    //This is set to true once there are 10 items in the words array 
    let learningReady = false;

    //While there are less than 10 items in the words array...
    while(!learningReady) {

        //Get a random word using this async function
        await getRandomWord()
        .then(result => {

            //After getting the random word, check that it hasn't been placed in the array already
            if(words.filter(word => word.WordID === result.WordID).length === 0) {

                //If it hasn't add it
                words.push(result);
            }
        })

        //Print errors
        .catch(err => console.log(err));
        
        //If there are finally 10 words, set learningReady to true so that it stops fetching new words
        if(words.length >= 10) {
            learningReady = true;
        }
    }

    //Create a list of promises so the program knows to wait until every item in this is resolved
    const promises = [];

    //Create a list where the flashcards for each WordModel will be stored
    const flashcards = [];

    //For each word model...
    words.forEach(elem => {

        //Push the promise returned by creating the flashcard to the list of promises
        promises.push(generateFlashcardFromWordModel(elem)

        //This function adds the flashcard to the list of flashcards
        .then(card => flashcards.push(card))
        .catch(err => console.log(err)));
    });

    //Wait for all promises to resolve, i.e., wait for all flashcards to be ready 
    await Promise.all(promises);

    //Return a Promise from this function
    return new Promise<WordFlashcardData[]>((resolve, reject) => {

        //If the query was successful...
        if(learningReady) {

            //Return the flashcards list
            resolve(flashcards);
        } 

        //If the query failed...
        else {
            reject({
                code: 500,
                error: 'Error creating the quiz. Please try again'
            });
        }
    });

}

/**
 * Recieve a breakdown of what quizzes are available for the given account to take
 * @param email 
 */
export const getQuizAvailability = async (email: string) : Promise<any> => {

    //Store the availability of every quiz type (knowledge level 'any' and 1 through 5)
    let randomQuizAvailability: {quizzes: {type: number | string, status: Status}[], numQuizzesAvailable: number};

    //Get the quiz availabilty for each level and save it
    await getRandomQuizAvailability(email)
    .then(result => randomQuizAvailability = result);

    //Leaving room for potential future functionality

    //Resolve the results (cannot really fail)
    return new Promise<any>((resolve) => {
        resolve(randomQuizAvailability);
    });

}

/**
 * Produces the wordIDs for the words the user is going to be quizzed on
 * @param knowledgeLevel 
 * @param email 
 */
export const getWordIDsForQuiz = async (knowledgeLevel: string | number, email: string) : Promise<{wordID: number, knowledgeLevel: string}[]> => {

    //Avoid endless loops by checking the user can actually take this quiz
    let doubleCheckUserCanTakeQuiz: boolean = false;

    //Perform verification that user is elligible for quiz
    await getQuizAvailability(email)
    .then(availability => {

        //Availability contains the list of all quizzes and their viabilities for this user
        availability.quizzes.filter(quiz => {

            //Select the chosen quiz
            if(quiz.type === knowledgeLevel) {

                //If authorized, permit the quiz generation
                if(quiz.status.code === 200) {
                    doubleCheckUserCanTakeQuiz = true;
                }
            }
        })
    })

    //If user cannot take quiz, return undefined
    if(!doubleCheckUserCanTakeQuiz) return new Promise<{wordID: number, knowledgeLevel: string}[]>((resolve, reject) => {
        reject({code: 503, message: 'User has not learned enough of the right words for this quiz'});
    });

    //Save the wordIDs the user will be quizzed on in this array
    let wordIDs: {wordID: number, knowledgeLevel: string}[] = [];

    //Capture wordIDs until there are 10 
    while(wordIDs.length < 10) {

        //Get a random wordID the acconut has learned and is associated with the proper knowledge level
        await getRandomWordIDLearnedByAccount(knowledgeLevel, email)

        //On success...
        .then(wordIDAndKnowledgeLevel => {

            //Go through the saved wordIDs and make sure the current one has not already been saved
            if(wordIDs.filter(chosenIDAndKnowledgeLevel => wordIDAndKnowledgeLevel.wordID === chosenIDAndKnowledgeLevel.wordID).length === 0) {

                //Save the current wordID with knowledge level
                wordIDs.push(wordIDAndKnowledgeLevel);
            }
        })

        //Log any errors
        .catch(err => {
            console.log(err);
        });
    }

    //Resolve the list of wordIDs and knowledge levels for making the quiz
    return new Promise<{wordID: number, knowledgeLevel: string}[]>((resolve, reject) => {
        resolve(wordIDs);
    })

}

/**
 * Given a list of wordIDs and knowledge levels, create a quiz
 * @param wordIDsWithKnowledgeLevels 
 * @returns 
 */
export const generateQuizByListOfWordIDs = async (wordIDsWithKnowledgeLevels: {wordID: number, knowledgeLevel: string}[]) : Promise<WordFlashcardData[]> => {

    //Store the flashcards
    let flashcards: WordFlashcardData[] = [];

    //Store unresolved promises here
    let promises = [];

    //For every wordID to be included in the quiz
    for(let i = 0; i < wordIDsWithKnowledgeLevels.length; i++) {

        //Push the promise returned by the method for generating a flashcard by the wordID
        promises.push(generateFlashcardFromWordID(wordIDsWithKnowledgeLevels[i].wordID, wordIDsWithKnowledgeLevels[i].knowledgeLevel)
            
            //Push it on success
            .then(flashcard => {
                // console.log(flashcard);
                flashcards.push(flashcard);
            })
            
            //Log error on failure
            .catch(err => {
                console.log(err);
        }));

    }

    //Wait for all the promises to finish resolving
    await Promise.all(promises);

    //Debugging
    // console.log(flashcards);

    //On success, resolve the quiz and reject an error message on failure
    return new Promise<WordFlashcardData[]>((resolve, reject) => {

        if(flashcards.length === 10) resolve(flashcards);
        else reject({code: 500, message: 'Error creating flashcards'});

    });

}