import { generateFlashcardFromWordID, generateFlashcardsFromRegex, generateFlashcardFromWord, getAllWordsLearnedByAccount } from '../../Database/Queries/FlashcardQueries/GetWordFlashcards';
import { learnTenRandomWords } from '../../Features/LearnMode/LearnModeFunctions';
import { isLoggedIn } from '../../Features/SecurityMiddleware/IsLoggedIn';
import { getAllKnowledgeLevelByAccount, learnWord} from '../../Database/Model/Dictionary/WordsLearnedByAccount';
import { getQuizAvailability } from '../../Features/LearnMode/LearnModeFunctions';
import { getWordIDsForQuiz } from '../../Features/LearnMode/LearnModeFunctions';
import { generateQuizByListOfWordIDs } from '../../Features/LearnMode/LearnModeFunctions';
import { updateKnowledgeLevelForWordLearned } from '../../Database/Model/Dictionary/WordsLearnedByAccount';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import express from 'express';

//Create the router for the majority of app functionality
export const routerLearnMore = express.Router();

const csrfProtection = csurf({ cookie: true });
//For CSRF
routerLearnMore.use(cookieParser());

  // ====TEST==== Only the first entry of the dictionary returns
  // routerLearnMore.get('/go', async (req, res) => {
  //       await generateFlashcardFromWordID(1).then(result => res.status(200).send(result));
  // });

  /**
   * Given a regular expression, get first 8 words from the dictionary that begin with that expression
   */
  routerLearnMore.get('/getWordsFromRegex', csrfProtection, isLoggedIn, async (req, res) => {

    //Extract the regex
    let regex: string = <string>req.query.regex;

    //Generate the flashcards from the regex
    await generateFlashcardsFromRegex(regex).then(data => {

        //Send all of the flashcards to the client
        res.status(200).send(data);
      })
      .catch(err => {

          //Print the error and send it to the server
          console.log('ERROR: ' + JSON.stringify(err.error));
          res.status(200).send({message: err.toString()});
        });
  });

/**
 * Generate a word flashcard given the word's string representation or its wordID
 */
routerLearnMore.get('/getWord', csrfProtection, isLoggedIn, async (req, res) => {

  //Make sure that the query contains just a single query variable
  if(Object.keys(req.query).length !== 1) {
    return res.status(500).send({code: 500, message: 'only 1 param'});
  }

  //If the string representation of a word exists in the query string
  if(req.query.word) {
    
    //Extract the word to find from the query string
    let word = <string>req.query.word;

    //Generate the flashcard from the specified word
    await generateFlashcardFromWord(word).then(data => {
      
      //Print the flashcard to the console 
      // console.log(`sending: ${JSON.stringify(data)}`);

      //Send the flashcard to the client
      res.status(200).send(data);
    })

    //Send an error to the client
    .catch(err => res.status(500).end({code: 500, message: err.toString()}));
  }

  //If the wordID exists in the query string...
  else if(req.query.wordID) {

    //Extract the wordID from the query string
    let wordID: number = parseInt(<string>req.query.wordID);

    //Generate the flashcard from the wordID and send it to the client
    await generateFlashcardFromWordID(wordID).then(data => res.status(200).send(data))

    //Send an error to the client on failure
    .catch(err => res.status(500).send({code: 500, message: err.toString()}));
  } 

  //Send an error if neither wordID or word exists in the query string
  else {
    res.status(500).send('Bad Params');
  }
});

/**
 * Return 10 unique, random words for the user to learn
 */
routerLearnMore.get('/learnRandomWords', isLoggedIn, async (req, res) => {

  //Setup for future feature...
  if(req.query.allNew && <string>req.query.allNew === 'true') {
    let message = 'TODO: Implement all new words';
    res.status(200).send({message: message});
  } 
  
  //Send ten random words to the client for the user to learn
  else {

    //Get the ten random words from the database
    await learnTenRandomWords().then(data => {

        //Send the data to the client
        res.status(200).send(data)
      })

      //Send an error to the client
      .catch(err => res.status(200).send(err));
  }
});

/**
 * Register that the user has successfully learned a word in the database
 */
routerLearnMore.post('/learnWord', csrfProtection, isLoggedIn, async (req: any, res) => {

  //Add the wordID of the word, the initial knowledge level of 3, and the user's email to a learned words table
  await learnWord({WordLearnedID: req.body.wordLearnedID, KnowledgeLevel: '3'}, req.session.UserState.email)

  //Send a success message to the client
  .then(() => res.status(200).send({code: 200, message: `Successfully learned ${req.body.wordName}`}))

  //Send an error to the client
  .catch(err => {console.log(err);res.status(500).send(err);});
});

/**
 * Register multiple words that the user has learned to the database
 */
routerLearnMore.post('/learnMultipleWords', csrfProtection, isLoggedIn, async (req: any, res) => {

  //An array used to store unresolved promises
  let promises = [];

  //For every word the user had the option to learn...
  for(let i = 0; i < req.body.WordsLearned.length; i++) {

    //If the user learned a given word
    if(req.body.WordsLearned[i] !== -1) {

      //Add the promise returned by the routine of adding the word to the database to the list of unresolved promises
      promises.push(learnWord({WordLearnedID: req.body.WordsLearned[i], KnowledgeLevel: '3'}, req.session.UserState.email));
    }
  }

  //Wait for all unresolved promises to finish executing
  await Promise.all(promises)

  //Then send a success status to the client
  .then(result => {console.log(result); res.status(200).send({message: "yes"});})

  //On failure, print an error
  .catch(err => console.log(err));
});

/**
 * Determine which quizzes the user is eligible to take.
 * Criteria: 
 * 1. must currently have at least 10 words at a given knowledge for a level specific quiz
 * 2. must currently have at least 10 words in total for a quiz of all levels
 */
routerLearnMore.get('/areQuizzesAvailable', csrfProtection, isLoggedIn, async (req: any, res) => {

  //Determine the which quizzes are available given the user's email, and send the result to the client
  await getQuizAvailability(req.session.UserState.email).then(result => res.status(200).send(result));
  
});

/**
 * Generate a random quiz for the user given the words they've already learned.
 * Quizzes can be level-specific or all-encompassing
 */
routerLearnMore.get('/generateRandomQuizOnLearnedWords', csrfProtection, isLoggedIn,  async (req: any, res) => {

  //Default quiz to generate
  let level: string | number = 'any';

  //If user specified a level specific quiz...
  if(req.query.level) {
    //Extract the level and use it to generate the quiz
    level = <string>req.query.level;
    level = level === 'any' ? level : parseInt(level);
  }

  //Generate the wordIDs for each word in the quiz given the user's email and which level to generate
  await getWordIDsForQuiz(level, req.session.UserState.email).then(async idsWithKnowledgeLevels => {

    //Generate the quiz given the wordIDs of each quiz word
    await generateQuizByListOfWordIDs(idsWithKnowledgeLevels)

    //On success, send the quiz to the client
    .then(quiz => {
      res.status(200).send(quiz);
    })

    //On failure, send the appropriate error to the client
    .catch(err => {
      res.status(500).send({code: 500, message: err.toString()});
    });
  }).catch(err => res.status(500).send({code: 500, message: err.toString()}));
  
});

/**
 * Given the wordID of a word the user has learned, update the word's knowledge level for that user
 */
routerLearnMore.post('/updateKnowledgeLevelWithWordID', csrfProtection, isLoggedIn, async(req: any, res) => {

  //Must have whether the user got the word correct, the previous knowledge level, the user's email, and the wordID of the word to change
  await updateKnowledgeLevelForWordLearned(req.body.correctlyAnswered, req.body.previousKnowledgeLevel,
  req.session.UserState.email, req.body.wordIDToAlter)

  //Send the result to the client
  .then(result => res.status(200).send(result))

  //Send the error to the client
  .catch(err => res.status(500).send(err));
});

/**
 * Get all unique knowledge levels for any word learned by the user
 */
routerLearnMore.get('/getAllKnowledgeLevelsLearnedByAccount', csrfProtection, isLoggedIn, async(req: any, res) => {

  //Get all unique knowledge levels for the user
  await getAllKnowledgeLevelByAccount(req.session.UserState.email)

  //Sort the knowledge levels so the information is sent to the client in the right order
  .then(result => {
    result.sort((a: any, b: any) => {
      if(typeof a === 'string') return 1;
      if(a > b) return 1;
      if(b > a) return -1;
      return 0;
    });

    //Send the knowledge levels to the client
    res.status(200).send(result);
  })

  //Send an error to the client
  .catch(err => res.status(500).send(err));
}); 

/**
 * Get every single word the account has learned
 */
routerLearnMore.get('/getAllWordsAccountHasLearned', csrfProtection, isLoggedIn, async (req: any, res) => {

  //Send every word the account has learned to the client
  await getAllWordsLearnedByAccount(req.session.UserState.email)

  //Send the words to the client
  .then(result => res.status(200).send(result))

  //Send an error to the client
  .catch(err => res.status(500).send({code: 500, err: err}));
});