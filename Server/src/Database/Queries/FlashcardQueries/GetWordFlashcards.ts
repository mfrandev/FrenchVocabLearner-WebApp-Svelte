import { getWordByID, getWordsByRegex, WordModel, getWordByString } from '../../Model/Dictionary/Word';
import { getDefinitionsFromWordID } from '../../Model/Dictionary/WordDefinition';
import { getWordCategoryByID } from '../../Model/Dictionary/WordCategory';
import { CategoryModel } from '../../Model/Dictionary/Category';
import { getRelationsFromWordID } from '../../Model/Dictionary/WordRelation';
import { getAllWordIDsLearnedByAccount } from '../../Model/Dictionary/WordsLearnedByAccount';

//Data structure to contain all of the data for a single flashcard
export interface WordFlashcardData {
    word: WordModel,
    definitions: string[],
    category: CategoryModel,
    relatedWords: WordModel[],
    knowledgeLevel?: string
}

//Data structure for condensed viewing of all words the account has learned
export interface WordAndKnowledgeLevel {
    word: string,
    wordID: number,
    knowledgeLevel: number
}

/**
 * Sort function used to sort word definitions based on the number that may be present at its start 
 * @param a 
 * @param b 
 * @returns 
 */
const sortFunc = (a: any, b: any): number => {

    //Regex used to extract the order from the defintiion
    let regex = /(([0-9]+)+?)/;

    //Extract value from each definition
    let aMatch = a.match(regex);
    let bMatch = b.match(regex);

    //If neither definition has no numbering, change nothing
    if(aMatch === null || bMatch === null) return 0;

    //Change "string" number to "number" number
    aMatch = parseInt(aMatch[0]);
    bMatch = parseInt(bMatch[0]);

    //If definition a has a larger number, it should go to the end of the list
    if(aMatch > bMatch) return 1;

    //If definition b has a larger number, it should go to the end of the list
    else if(aMatch < bMatch) return -1;

    //Nothing should be changed
    return 0;

}

/**
 * Takes a WordModel (WordID && WordName) and returns a WordFlashcardData object
 */
export const generateFlashcardFromWordModel = async (wordData: WordModel) : Promise<WordFlashcardData> => {

    //State and status variables
    let data : WordFlashcardData = {
        word: undefined,
        definitions: [],
        category: undefined,
        relatedWords: []
    };
    let errorVal : string = '';
    let failure = false;
    data.word = wordData;

    //Use the parameter WordID to get the list definitions for the word
    await getDefinitionsFromWordID(data.word.WordID)

    //Save the definitions
    .then(async result => {
        data.definitions = result;

        //For learning random words
        data.definitions.sort(sortFunc);
        
        //Use the WordID to get its category
        await getWordCategoryByID(data.word.WordID)

        //Save the category
        .then(async resultGetCategory => {
            data.category = resultGetCategory;
            console.log(`Category for ${wordData.WordName}: ${resultGetCategory}`);

            //Use the WordID to get the related words
            await getRelationsFromWordID(data.word.WordID)
            
            //Save the related words
            .then(resultGetRelations => data.relatedWords = resultGetRelations)

            //Could not get the related words and save the error
            .catch(err => {
                console.log(`rejecting ${wordData.WordName} 1`);
                errorVal = err;
                failure = true;
            });
        })

        //Could not get the word category
        .catch(err => {
                console.log(`rejecting ${wordData.WordName} 2`);
                errorVal = err;
                failure = true;
            });
    })

    //Could not get the definitions
    .catch(err => {
        console.log(`rejecting ${wordData.WordName} 3`);
        errorVal = err;
        failure = true;
    });

    //Return a Promise from this function
    return new Promise<WordFlashcardData>((resolve, reject) => {

        //If the query was successful...
        if(!failure) {
            console.log(`Resolving ${wordData.WordName} in generateFlashcardFromWordModel`);
            resolve(data);
        } 

        //If the query failed...
        else {
            console.log(`Rejecting ${wordData.WordName} in generateFlashcardFromWordModel`);
            reject({
                code: 500,
                error: errorVal
            });
        }
    });

}

/**
 * Takes a WordID and returns a WordFlashcardData object
 */
 export const generateFlashcardFromWordID = async (wordID: number, knowledgeLevel?: string) : Promise<WordFlashcardData> => {

    //State and status variables
    let data : WordFlashcardData = {
        word: undefined,
        definitions: [],
        category: undefined,
        relatedWords: [],
        knowledgeLevel: knowledgeLevel
    };
    let errorVal : string = '';
    let failure = false;

    //Use the parameterized WordID to get the word model
    await getWordByID(wordID)

    //Save the word model
    .then(async res => {
        data.word = res;

        //Get the definitions using the WordID
        await getDefinitionsFromWordID(data.word.WordID)
        .then(async result => {
            data.definitions = result;

            data.definitions.sort(sortFunc);

            //Get the word categories using the WordID
            await getWordCategoryByID(data.word.WordID)

            //Save the word category
            .then(async resultGetCategory => {
                data.category = resultGetCategory;

                //Get the related words using the WordID
                await getRelationsFromWordID(data.word.WordID)

                //Save the related words
                .then(resultGetRelations => data.relatedWords = resultGetRelations)

                //Error retrieving the related words
                .catch(err => {
                    errorVal = err;

                    failure = true;
                });
            })

            //Error retrieving the word category
            .catch(err => {
                    errorVal = err;

                    failure = true;
                });
        })

        //Error retrieving the word definitions
        .catch(err => {
            errorVal = err
            failure = true;
        })
    })

    //Error retrieving the word model from the word ID
    .catch(err => {
        errorVal = err;
        failure = true;
    });


    //Return a Promise from this function
    return new Promise<WordFlashcardData>((resolve, reject) => {

        //If the query was successful...
        if(!failure) {
            resolve(data);
        } 

        //If the query failed...
        else {
            reject({
                code: 500,
                error: errorVal
            });
        }
    });

}

/**
 * Takes a regex expression and returns the flashcards for all words that match the regex expression
 */
export const generateFlashcardsFromRegex = async (regex: string) : Promise<WordFlashcardData[]> => {

    //Save the state and status variables
    let data : WordFlashcardData[] = [];
    let errorVal : string = '';
    let failure = false;

    //Take a regexed string and retrieve all WordModels whose words match the regex
    await getWordsByRegex(regex)
    .then(async res => {

        //Save the promises here to be resolved
        const promises = [];

        //For each word model matching the regex...
        res.forEach(async elem => {

            //Get the flashcard using the generated word model
            promises.push(generateFlashcardFromWordModel(elem)
                .then(card => {

                    //Save the flashcard
                    data.push(card);
                    //console.log(data);
                })

                //Error retrieving the flashcard
                .catch(err => {
                    errorVal = err;
                    failure = true;
                })
            );
        });


        //Wait to ensure that all of the data has added to the array 
        await Promise.all(promises)

        //Sort the flashcards by the WordID
        .then(() => {
            data.sort((a, b) : number => {

                //Standard sorting procedure to ensure consistent results
                if(a.word.WordName < b.word.WordName) {
                    return -1;
                } else if(a.word.WordName > b.word.WordName) {
                    return 1;
                } else {
                    return 0;
                }
            });
        });
        
    })

    //Error sorting the results
    .catch(err => {
        errorVal = JSON.stringify(err);
        failure = true;
    });

    //Return a Promise from this function
    return new Promise<WordFlashcardData[]>((resolve, reject) => {

        //If the query was successful...
        if(!failure) {
            resolve(data);
        } 

        //If the query failed...
        else {
            reject({
                code: 500,
                error: errorVal
            });
        }
    });

}

/**
 * Takes a Word (string) and returns a WordFlashcardData object
 */
 export const generateFlashcardFromWord = async (word: string) : Promise<WordFlashcardData> => {

    //State and status variables
    let data : WordFlashcardData = {
        word: undefined,
        definitions: [],
        category: undefined,
        relatedWords: []
    };
    
    let errorVal : string = '';
    let failure = false;

    //Use the parameterized WordID to get the word model
    await getWordByString(word)

    //Save the word model
    .then(async res => {
        data.word = res;

        //Get the definitions using the WordID
        await getDefinitionsFromWordID(data.word.WordID)
        .then(async result => {
            data.definitions = result;
            // Sort the definitions by this regex: (([0-9]+)+?)
            //This gets the number before the first period in the definition

            //For gettng from search bar
            data.definitions.sort(sortFunc);
            
            //Get the word categories using the WordID
            await getWordCategoryByID(data.word.WordID)

            //Save the word category
            .then(async resultGetCategory => {
                data.category = resultGetCategory;

                //Get the related words using the WordID
                await getRelationsFromWordID(data.word.WordID)

                //Save the related words
                .then(resultGetRelations => data.relatedWords = resultGetRelations)

                //Error retrieving the related words
                .catch(err => {
                    console.log(`rejecting ${word} 1`);
                    errorVal = err;
                    failure = true;
                });
            })

            //Error retrieving the word category
            .catch(err => {
                    console.log(`rejecting ${word} 2`);
                    errorVal = err;
                    failure = true;
                });
        })

        //Error retrieving the word definitions
        .catch(err => {
            console.log(`rejecting ${word} 3`);
            errorVal = err
            failure = true;
        })
    })

    //Error retrieving the word model from the word ID
    .catch(err => {
        console.log(`rejecting ${word} 4`);
        errorVal = err;
        failure = true;
    });


    //Return a Promise from this function
    return new Promise<WordFlashcardData>((resolve, reject) => {

        //If the query was successful...
        if(!failure) {
            console.log(`Resolving ${word} in generateFlashcardFromWord`);
            resolve(data);
        } 

        //If the query failed...
        else {
            console.log(`Rejecting ${word} in generateFlashcardFromWord`);
            reject({
                code: 500,
                error: errorVal
            });
        }
    });
}

/**
 * Take an account email and get the list of all words learned by that account. This seems like a duplicate function,
 * but it eliminates the other information included in a flashcard which is unnecessary for the user summary
 * @param email 
 * @returns 
 */
export const getAllWordsLearnedByAccount = async (email: string) : Promise<WordAndKnowledgeLevel[]> => {

    //True if an error ocurred
    let errorOcurred = false;

    //Should contain all words the user has learned
    let submission: WordAndKnowledgeLevel[] = [];

    //List that will contain all unresolved promises
    let promises = [];

    //Get all wordIDs learned by the account
    await getAllWordIDsLearnedByAccount(email)
    .then(async results => {

        //For every wordID the account has learned...
        for(let i = 0; i < results.length; i++) {

            //Add the promise retuned by getting word by ID to the list of unresolved promises
            promises.push(getWordByID(results[i][0])

            //After getting the word
            .then(word => {

                //Push the model containing the word, its knowledge level, and wordID to the submission list
                submission.push({
                    word: word.WordName,
                    wordID: results[i][0],
                    knowledgeLevel: results[i][1]
                });
            })

            //On error, log it and note it ocurred
            .catch(err => {
                console.log(err);
                errorOcurred = true;
            }));

            //If there was an error, end the word retrieval process
            if(errorOcurred) break;
        }
    })

    //On error, log it and note it ocurred
    .catch(err => {
        console.log(err);
        errorOcurred = true;
    });

    //If there was no error...
    if(!errorOcurred) {

        //Wait for the promises to resolved
        await Promise.all(promises);

        //Sort all of the words in alphabetical order
        submission.sort((a: WordAndKnowledgeLevel, b: WordAndKnowledgeLevel) => {
            if(a.word > b.word) return 1;
            if(b.word > a.word) return -1;
            return 0;
        })  
    }

    //Return the promise of words or an error based on if there were no errors in retreiving the words
    return new Promise<WordAndKnowledgeLevel[]>((resolve, reject) => {
        if(!errorOcurred) resolve(submission);
        else reject({ code: 500, message: 'something went wrong trying to get the words from their id\'s'});
    });

}