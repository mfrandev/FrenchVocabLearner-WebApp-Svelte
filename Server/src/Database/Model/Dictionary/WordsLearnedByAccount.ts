import { DataTypes } from 'sequelize';
import { dbConnection, Status } from '../../../Config/DBConfig';

/**
 * Define the model of the WordsLearnedByAccount table across the program
 */ 
 export const WordsLearnedByAccount = dbConnection.define('WordsLearnedByAccount', {

    //Email is part of the primary key, a string, and cannot be null
    AccountEmail: {
        type: DataTypes.STRING(320),
        allowNull: false,
        primaryKey: true
    },

    //WordLearnedID is part of the primary key, an integer, and cannot be null
    WordLearnedID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    KnowledgeLevel: {
        type: DataTypes.ENUM('1', '2', '3', '4', '5'),
        defaultValue: '3'
    }

},

    //The name of the table is WordsLearnedByAccount, and include timestamps for creation and update
    {
        tableName: 'WordsLearnedByAccount',
        createdAt: true,
        updatedAt: true,
});

/**
 * Interface for a single word learned by an account (account email is associated at a higher level)
 */
export interface WordLearnedByAccountModel {
    WordLearnedID: number,
    KnowledgeLevel?: string,
    createdAt?: string,
    updatedAt?: string
}

/**
 * Interface that maps to the WordsLearnedByAccount table in the database
 */
 export interface WordsLearnedByAccountModel {
    AccountEmail: string,
    WordsLearned: WordLearnedByAccountModel[]
}

/**
 * Registers a word that the user learned in the database
 * @param wordLearned Model containing the data representing the word the user learned
 * @param userEmail User details
 * @returns A promise containing the status of the database transaction
 */
export const learnWord = async (wordLearned: WordLearnedByAccountModel, userEmail: string) : Promise<Status> => {

     //Keep track of whether the query was successful 
     let success = true;
     let errorMsg = '';

     //Associate the word's ID with the account in the database
     await WordsLearnedByAccount.create({
        AccountEmail: userEmail,
        WordLearnedID: wordLearned.WordLearnedID
     })

     //On error...
     .catch(err => {

        //Error from the database
        let problemField = err.fields;

        //If a primary key violation...
        if('PRIMARY' in problemField) {
            errorMsg = 'You\'ve already learned this word!';
        } 
        
        //Otherwise...
        else {
            errorMsg = 'Could not save your progress at this time. Please try again.'
        }

        //Encountered error
        success = false;
     });

         //Return a Promise from this function
    return new Promise<Status>((resolve, reject) => {

        //Declare return object
        let status: Status;

        //If the query was successful...
        if (success) {
            status = {
                code: 200,
                message: `Successfully learned word ${wordLearned.WordLearnedID}!`
            };
            resolve(status);
        }

        //If the query failed...
        else {

            //Create the status object to return
            status = {
                code: 500,
                message: errorMsg
            };

            // console.log(status.message);

            //Return the status object
            reject(status);
        }
    });

}

/**
 * Determines which quizzes should be available for the user, called during SSR for quizHub
 * @param email Use email to make sure you get your own data
 * @returns 
 */
export const getRandomQuizAvailability = async (email: string) : Promise<{quizzes: {type: number | string, status: Status}[], numQuizzesAvailable: number}> => {

    //Contains which quizzes are available to the user
    let validatedRandomQuizzes: {type: number | string, status: Status}[] = [];

    //Number of quizzes available to the user
    let numberOfQuizzesAvailable: number = 0;

    //List of unresolved promises
    let promises = [];

    //Determine how many words total the user has learned
    promises.push(dbConnection.query(`SELECT COUNT(*) FROM WordsLearnedByAccount WHERE AccountEmail = ?`, {
        replacements: [email]
    }).then(([results, metadata]) => {

        //Format results
        const [answer] = results;
        
        //How many words the user learned
        let numberOfWordsLearned: number = -1;

        //Status variables
        let message: string = '';
        let code: number;

        //Holds whether the quiz of all words should be available
        let verdict: {type: number | string, status: Status};

        //How many words user knows
        numberOfWordsLearned = answer[0];

        //If user knows at least ten words...
        if(numberOfWordsLearned >= 10) {

            //Save a positive quiz status
            message = 'Successfully made a random quiz for words with knowledge level any';
            code = 200;

            //Increment the number of quizzes the user can take by one
            numberOfQuizzesAvailable++;
        } 
        
        //Otherwise save a negative quiz status
        else {
            message = 'Could not make a random quiz for words with knowledge level any: Not enough words learned';
            code = 503;
        }

        //Save the verdict for availability 
        verdict = {
            type: "any",
            status: {
                code: code,
                message: message
            }
        }

        //Save availabilty verdict in a list
        validatedRandomQuizzes.push(verdict);
    })

    //On error...
    .catch(err => {
        //Create an error status and push it to the availabilty list
        const message = `Could not make a random quiz for words with knowledge level any: Server Error`;
        const code = 500;
        const verdict = {
            type: 'any',
            status: {
                code: code,
                message: message
            }
        }
        validatedRandomQuizzes.push(verdict);
    }));

    //For knowledge levels 1 through 5...
    for(let i = 1; i < 6; i++) {

        //Push the promise to the database returned by the query execution
        promises.push(dbConnection.query(`SELECT COUNT(*) FROM WordsLearnedByAccount WHERE AccountEmail = ? AND KnowledgeLevel = ?`, {
            replacements: [email, i]
        }).then(([results, metadata]) => {
            const [answer] = results;

            //==================Exactly the same procedure as above==================
            let numberOfWordsLearned: number = -1;
            let message: string = '';
            let code: number;
            let verdict: {type: number | string, status: Status};
            numberOfWordsLearned = answer[0];
            if(numberOfWordsLearned >= 10) {
                //Do quiz stuff
                message = `Successfully made a random quiz for words with knowledge level ${i}`;
                code = 200;
                numberOfQuizzesAvailable++;
            } else {
                message = `Could not make a random quiz for words with knowledge level ${i}: Not enough words learned`;
                code = 503;
            }
            verdict = {
                type: i,
                status: {
                    code: code,
                    message: message
                }
            }
            validatedRandomQuizzes.push(verdict);
        })
        .catch(err => {
            // console.log(err);
            const message = `Could not make a random quiz for words with knowledge level ${i}: Server Error`;
            const code = 500;
            const verdict = {
                type: i,
                status: {
                    code: code,
                    message: message
                }
            }
            validatedRandomQuizzes.push(verdict);
        }));
    }
    
    //Wait for all the promises to resolve
    await Promise.all(promises);

    //Sort the quizzes by level ('any', 1... 5)
    validatedRandomQuizzes.sort((a, b) => {
        let typeAIsNumber = typeof a.type === 'number';
        let typeBIsNumber = typeof b.type === 'number';

        //If 'any' is either of the types
        if(typeAIsNumber && typeBIsNumber) {
            if(a.type > b.type) return 1;
            else if(a.type < b.type) return -1;
            return 0;
        }

        //Otherwise sort normally
        else if(!typeAIsNumber && typeBIsNumber) {
            return -1;
        }

        //Sort normally
        else if(typeAIsNumber && !typeBIsNumber) {
            return 1;
        }

    });
    
    //Resolve the quiz availability statuses... Will always resolve regardless of success since errors are OK here
    return new Promise<{quizzes: {type: number | string, status: Status}[], numQuizzesAvailable: number}>((resolve) => {
        resolve({quizzes: validatedRandomQuizzes, numQuizzesAvailable: numberOfQuizzesAvailable});
    });

}

/**
 * Get the ID for a single word that the given account has already learned
 * @param knowledgeLevel This is a string or a number, if string, is 'any', otherwise a value 1 - 5
 * @param email Authenticated user's email for finding their own words
 * @returns 
 */
export const getRandomWordIDLearnedByAccount = async (knowledgeLevel: string | number, email: string) : Promise<{wordID: number, knowledgeLevel: string}> => {

    //Will store a random wordID which has been learned by the logged in account
    let wordID: number;
    let success: boolean = true;
    let wordData: {wordID: number, knowledgeLevel: string};

    //If the user specified a knowledge level 1 through 5, get a random word of that knowledge level
    if(typeof knowledgeLevel === 'number') {
        await dbConnection.query(`
        SELECT *
        FROM WordsLearnedByAccount wlba JOIN
            (SELECT CEIL(RAND() *
                        (SELECT MAX(WordLearnedID)
                            FROM WordsLearnedByAccount)) AS id)
            AS wlba2
        WHERE wlba.WordLearnedID >= wlba2.id AND wlba.AccountEmail = ? AND KnowledgeLevel = ?
        ORDER BY wlba.WordLearnedID ASC
        LIMIT 1;
        `, {
            replacements: [email, knowledgeLevel]
        })
        .then(([results, metadata]) => {

            //Format the result
            const [answer] = results;

            //Save the wordID
            wordID = answer[1];

            //Note that the procedure was successful
            success = true;

            //Format the information in the correct way
            wordData = {
                wordID: wordID,
                knowledgeLevel: knowledgeLevel.toString()
            };
        })

        //Log the error and note the routine failed
        .catch(err => {
            console.log(err);
            success = false;
        });
    } 
    
    //Exactly the same as the block above, but with no regard for knowledge level
    else {
        await dbConnection.query(`
        SELECT *
        FROM WordsLearnedByAccount wlba JOIN
            (SELECT CEIL(RAND() *
                        (SELECT MAX(WordLearnedID)
                            FROM WordsLearnedByAccount)) AS id)
            AS wlba2
        WHERE wlba.WordLearnedID >= wlba2.id AND wlba.AccountEmail = ?
        ORDER BY wlba.WordLearnedID ASC
        LIMIT 1;
        `, {
            replacements: [email]
        })
        .then(([results, metadata]) => {
            const [answer] = results;
            wordID = answer[1];
            let knowledgeLevelAsString = answer[2];
            wordData = {
                wordID: wordID,
                knowledgeLevel: knowledgeLevelAsString
            };
            success = true;
        })
        .catch(err => {
            console.log(err);
            success = false;
        });
    }

    //Return the wordID with its knowledge level
    return new Promise<{wordID: number, knowledgeLevel: string}>((resolve, reject) => {

        if(success) resolve(wordData);
        else reject({code: 500, message: 'error retrieving learned word record from database'});

    });
}

/**
 * Update the knowledge level for a word given the word's ID, whether the knowledge level should go up or down,
 * the email of the account to search by, and the initial knowledge level
 * @param toIncrement 
 * @param knowledgeLevel 
 * @param email 
 * @param wordID 
 * @returns 
 */
export const updateKnowledgeLevelForWordLearned = async (toIncrement: boolean, knowledgeLevel: string, email: string, wordID: number) : Promise<Status> => {

    //Get the knowledge level as a number
    let knowledgeLevelInt: number = parseInt(knowledgeLevel);
    let status: Status;
    let success: boolean = false;
    
    //Nested ternary to make sure that the initial knowledge level domain is respected in the incrementation process
    knowledgeLevelInt = toIncrement ? 
    (knowledgeLevelInt < 5 ? knowledgeLevelInt + 1 : knowledgeLevelInt)
     : 
    (knowledgeLevelInt > 1 ? knowledgeLevelInt - 1 : knowledgeLevelInt);
    
    //Format the incremented knowledge level as a string
    knowledgeLevel = knowledgeLevelInt.toString();

    //Update the knowledge level in the database given the correct email and wordID
    await WordsLearnedByAccount.upsert({
        AccountEmail: email,
        WordLearnedID: wordID,
        KnowledgeLevel: knowledgeLevel
    })

    //On success, create a success status
    .then(() => {
        status = {
            code: 200,
            message: `Successfully updated knowledge level for wordID ${wordID} to ${knowledgeLevel}`
        }
        success = true;
    })

    //On error, create an error status
    .catch(err=> {
        console.log(err);
        status = {
            code: 500,
            message: `Failed updating knowledge level for wordID ${wordID}`
        }
    });

    //Resolve/Reject the created status based on success
    return new Promise<Status>((resolve, reject) => {
        if(success) resolve(status);
        else reject(status);
    });

}

/**
 * Get the unique knowledge levels for words that a given account has learned.
 * If the account has at least one word learned, the level "any" will be included in this list
 * @param email 
 * @returns 
 */
export const getAllKnowledgeLevelByAccount = async (email: string) : Promise<any[]> => {

    //Save success status
    let success = false;

    //Contains int representations of all unique knowledge levels for words associated with this account
    let levels: any[] = [];

    //Perform the query
    await dbConnection.query('SELECT UNIQUE KnowledgeLevel FROM WordsLearnedByAccount WHERE AccountEmail = ?', {
        replacements: [email]
    })

    //On success...
    .then(results => {
        
        //Format the results
        const [answer] = results;

        //If there is at least one word learned...
        if(answer.length > 0) {

            //Push 'any' into the list of knowledge levels
            levels.push('any');

            //Push all present numerical knowledge levels
            answer.forEach(level => {
                levels.push(parseInt(level[0]));
            });
        } 
        
        //Acknowledge the routine succeeded
        success = true;
    })

    //Log the error
    .catch(err => {
        console.log(err);
    });

    //Resolve the knowledge levels or reject an error status message depending on the success variable
    return new Promise<any[]>((resolve, reject) => {
        if(success) resolve(levels);
        else reject({code: 500, message: 'Something went wrong when looking for unique knowledge levels'})
    });
}

/**
 * Get the word IDs for all words the logged in user has learned
 * @param email 
 * @returns 
 */
export const getAllWordIDsLearnedByAccount = async (email: string) => {

    //Status
    let success = false;

    //Store all of the words 
    let words: any[];

    //Perform the query...
    await dbConnection.query('SELECT WordLearnedID, KnowledgeLevel FROM WordsLearnedByAccount WHERE AccountEmail = ?', {
        replacements: [email]
    })

    //On success...
    .then(result => {

        //Format the results 
        const [answer] = result;

        //Save the IDs and Knowledge Levels of all words learned by a given account
        words = answer;
        // console.log(words);
        // console.log("There are " + words.length + " words learned");
        success = true;
    })

    //Log the error if it ocurred
    .catch(err => {
        console.log(err);
    });

    //On success, resolve the word/knowledge_level object and reject an error status on failure
    return new Promise<any>((resolve, reject) => {
        if(success) resolve(words);
        else reject({code: 500, message: 'error retreiving words learned by account'});
    });

}

