import { DataTypes, QueryTypes } from 'sequelize';
import { dbConnection, Status } from '../../../Config/DBConfig';

/**
 * Define the model of the Word table across the program
 */
export const Word = dbConnection.define('Word', {

    //WordID is the primary key, an integer, and cannot be null
    WordID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    //WordName is a string
    WordName: {
        type: DataTypes.STRING(69)
    }
},

    //The name of the table is Word, and do not include timestamps for creation and update
    {
        tableName: 'Word',
        createdAt: false,
        updatedAt: false,
    });


/**
 * Interface that maps to the Word table in the database
 */
export interface WordModel {
    WordID: number,
    WordName: string
}

/**
 * Takes an object that maps to the structure of the 'Word' table from the database and 
 * adds it to the DB table
 * @param wordObj WordModel
 * @returns Promise<Status>
 */
export async function addToWord(wordObj: WordModel): Promise<Status> {

    //Keep track of whether the query was successful 
    let success = true;
    let errorMsg = '';

    //Add the word to the database
    await Word.create({
        WordID: wordObj.WordID,
        WordName: wordObj.WordName
    })

        //If unsuccessful, account for the error
        .catch(error => {

            //Include the error message if the error object has the toString method
            if ('toString' in error) {
                errorMsg = error.toString();
            }
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
                message: `Successfully added (${wordObj.WordID}, ${wordObj.WordName}) to the database`
            };
            resolve(status);
        }

        //If the query failed...
        else {

            //Don't need a line break if there is no existing error message
            if (errorMsg === '') {
                errorMsg = `Error adding (${wordObj.WordID}, ${wordObj.WordName}) to the database`;
            }

            //Otherwise append a line break and the remaining statement
            else {
                errorMsg += `\nError adding (${wordObj.WordID}, ${wordObj.WordName}) to the database`;
            }

            //Create the status object to return
            status = {
                code: 500,
                message: errorMsg
            };

            //Return the status object
            reject(status);
        }
    });

}

/**
 * Select a word from the database give its ID
 * @param wordID Corresponds to the WordID column from the database
 * @returns A promise: WordModel on success, error object on failure
 */
export async function getWordByID(wordID: number) : Promise<WordModel> {

    //Saves the result of a successful query
    let result: WordModel;

    //Saves the status of the query, used in the Promise return object
    let success = false;

    //Stores an error message, if applicable
    let errorMsg = '';

    //Query the DB with a custom query
    await dbConnection.query('SELECT * FROM Word WHERE WordID = ?', 
    {
        replacements: [wordID]
    })

        //On success, return a WordModel object
        .then(([results, metadata]) => {

            //Extract the desired data
            const [answer] = results;

            //Place the data in an object for easy use
            result = {
                WordID: answer[0],
                WordName: answer[1]
            };
            success = true;
        })

        //Save the error in the errorMsg string
        .catch(err => {
            errorMsg = err.toString();
        });

    //Return a Promise from this function
    return new Promise<WordModel>((resolve, reject) => {

        //If the query was successful...
        if(success) {
            resolve(result);
        } 

        //If the query failed...
        else {
            reject({
                code: 500,
                error: errorMsg
            });
        }
    });

}

/**
 * Select a word from the database give its string
 * @param word Corresponds to the WordName column from the database
 * @returns A promise: WordModel on success, error object on failure
 */
 export async function getWordByString(word: string) : Promise<WordModel> {

    //Saves the result of a successful query
    let result: WordModel;

    //Saves the status of the query, used in the Promise return object
    let success = false;

    //Stores an error message, if applicable
    let errorMsg = '';

    //Query the DB with a custom query
    await dbConnection.query('SELECT * FROM Word WHERE WordName = ?', 
    {
        replacements: [word]
    })

        //On success, return a WordModel object
        .then(([results, metadata]) => {

            //Extract the desired data
            const [answer] = results;

            //Place the data in an object for easy use
            result = {
                WordID: answer[0],
                WordName: answer[1]
            };
            success = true;
        })

        //Save the error in the errorMsg string
        .catch(err => {
            errorMsg = err;
        });

    //Return a Promise from this function
    return new Promise<WordModel>((resolve, reject) => {

        //If the query was successful...
        if(success) {
            resolve(result);
        } 

        //If the query failed...
        else {
            reject({
                code: 500,
                error: errorMsg
            });
        }
    });

}

/**
 * Select a random word with its ID from the database
 * @returns A promise: WordModel on success, error object on failure
 */
export async function getRandomWord() : Promise<WordModel> {

    //Saves the result of a successful query
    let result: WordModel;

    //Saves the status of the query, used in the Promise return object
    let success = false;

    //Stores an error message, if applicable
    let errorMsg = '';


    //Custom query found at https://stackoverflow.com/questions/4329396/mysql-select-10-random-rows-from-600k-rows-fast
    await dbConnection.query(`
    SELECT *
    FROM Word r1 JOIN
         (SELECT CEIL(RAND() *
                       (SELECT MAX(WordID)
                          FROM Word)) AS id)
          AS r2
    WHERE r1.WordID >= r2.id
    ORDER BY r1.WordID ASC
    LIMIT 1;
    `)
         //On success, return a WordModel object
         .then(([results, metadata]) => {

            //Extract the desired data
            const [answer] = results;

            //Place the data in an object for easy use
            result = {
                WordID: answer[0],
                WordName: answer[1]
            };
            success = true;
        })

        //Save the error in the errorMsg string
        .catch(err => {
            errorMsg = err.toString();
        });

    //Return a Promise from this function
    return new Promise<WordModel>((resolve, reject) => {

        //If the query was successful...
        if(success) {
            resolve(result);
        } 

        //If the query failed...
        else {
            reject({
                code: 500,
                error: errorMsg
            });
        }
    });

}

export async function getWordsByRegex(regex: string) : Promise<WordModel[]> {

    //Saves the result of a successful query
    let result: WordModel[] = [];

    //Saves the status of the query, used in the Promise return object
    let success = false;

    //Stores an error message, if applicable
    let errorMsg = '';

    regex = '^(' + regex + ')';

    //Query the DB with a custom query
    console.log('searching by: ' + regex);
    await dbConnection.query(`SELECT * FROM Word WHERE WordName REGEXP ? ORDER BY WordName LIMIT 8`,
    {
        replacements: [regex]
    })

        //On success, return a WordModel object
        .then(([results, metadata]) => {

            results.forEach(elem => {
                result.push({
                    WordID: elem[0],
                    WordName: elem[1]
                });
            });

            success = true;
        
        })

        //Save the error in the errorMsg string
        .catch(err => {
            console.log("Word.ts: " + err);
            errorMsg = err.toString();
        });

    //Return a Promise from this function
    return new Promise<WordModel[]>((resolve, reject) => {

        //If the query was successful...
        if(success) {
            console.log('Word.ts success getWordsByRegex');
            resolve(result);
        } 

        //If the query failed...
        else {
            console.log('Word.ts reject getWordsByRegex');
            reject({
                code: 500,
                error: errorMsg
            });
        }
    });

}