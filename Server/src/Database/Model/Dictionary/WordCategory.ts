import { DataTypes } from 'sequelize';
import { dbConnection, Status } from '../../../Config/DBConfig';
import { CategoryModel } from './Category';

/**
 * Define the model of the WordCategory table across the program
 */ 
export const WordCategory = dbConnection.define('WordCategory', {

    //WordID is the primary key, an integer, and cannot be null
    WordID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }, 

    //CategoryID is the primary key, an integer, and cannot be null
    CategoryID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }
}, 

//The name of the table is WordCategory, and do not include timestamps for creation and update
{
    tableName: 'WordCategory',
    createdAt: false,
    updatedAt: false,
});


/**
 * Interface that maps to the WordCategory table in the database
 */
export interface WordCategoryModel {
    WordID: number,
    CategoryID: number
}

/**
 * Takes an object that maps to the structure of the 'WordCategory' table from the database and 
 * adds it to the DB table
 * @param wordCategoryObj WordCategoryModel
 * @returns Promise<Status>
 */
export async function addToWordCategory(wordCategoryObj : WordCategoryModel) : Promise<Status> {

    //Keep track of whether the query was successful 
    let success = true;
    let errorMsg = '';

    //Add the WordCategory to the database
    await WordCategory.create({
        WordID: wordCategoryObj.WordID,
        CategoryID: wordCategoryObj.CategoryID
    })
    
    //If unsuccessful, account for the error
    .catch(error => {

        //Include the error message if the error object has the toString method
        if('toString' in error) {
            errorMsg = error.toString();
        }
        success = false;
    }); 



    //Return a Promise from this function
    return new Promise<Status>((resolve, reject) => {

        //Declare return object
        let status : Status;

        //If the query was successful...
        if(success) {
            status = {
                code: 200,
                message: `Successfully added (${wordCategoryObj.WordID}, ${wordCategoryObj.CategoryID}) to the database`
            }; 
            resolve(status);
        } 
        
        //If the query failed...
        else {

            //Don't need a line break if there is no existing error message
            if(errorMsg === '') {
                errorMsg = `Error adding (${wordCategoryObj.WordID}, ${wordCategoryObj.CategoryID}) to the database`;
            }

            //Otherwise append a line break and the remaining statement
            else {
                errorMsg += `\nError adding (${wordCategoryObj.WordID}, ${wordCategoryObj.CategoryID}) to the database`;
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

// SELECT * FROM Category WHERE CategoryID = (SELECT CategoryID FROM WordCategory WHERE WordID = 12);
/**
 * Select a word from the database give its ID
 * @param wordID Corresponds to the WordID column from the database
 * @returns A promise: WordModel on success, error object on failure
 */
 export async function getWordCategoryByID(wordID: number) : Promise<CategoryModel> {

    //Saves the result of a successful query
    let result: CategoryModel;

    //Saves the status of the query, used in the Promise return object
    let success = false;

    //Stores an error message, if applicable
    let errorMsg = '';

    //Query the DB with a custom query
    await dbConnection.query('SELECT * FROM Category WHERE CategoryID = (SELECT CategoryID FROM WordCategory WHERE WordID = ?)',
    {
        replacements: [wordID]
    })

        //On success, return a WordModel object
        .then(([results, metadata]) => {

            //Extract the desired data
            const [answer] = results;

            //Place the data in an object for easy use
            result = {
                CategoryID: answer[0],
                CategoryName: answer[1]
            };
            
            success = true;
        })

        //Save the error in the errorMsg string
        .catch(err => {
            errorMsg = err.toString();
        });

    //Return a Promise from this function
    return new Promise<CategoryModel>((resolve, reject) => {

        //THIS IS THE FIX FOR EU, FAUT, ETC. NOT WORKING (not Predises, etc.)
        success = true;

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