import { DataTypes } from 'sequelize';
import { dbConnection, Status } from '../../../Config/DBConfig';

//=============NOT IN USE YET=============

/**
 * Define the model of the WordInEnglish table across the program
 */ 
export const WordInEnglish = dbConnection.define('WordInEnglish', {

    //WordID is the primary key, an integer, and cannot be null
    WordhID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }, 

    //WordInEnglish is the primary key, a string, and cannot be null
    WordInEnglish: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true
    }
}, 

//The name of the table is WordInEnglish, and do not include timestamps for creation and update
{
    tableName: 'WordInEnglish',
    createdAt: false,
    updatedAt: false,
});


/**
 * Interface that maps to the WordInEnglish table in the database
 */
export interface WordInEnglishModel {
    WordID: number,
    WordInEnglish: string
}

/**
 * Takes an object that maps to the structure of the 'WordInEnglish' table from the database and 
 * adds it to the DB table
 * @param wordInEnglishObj WordInEnglishModel
 * @returns Promise<Status>
 */
export async function addToWordInEnglish(wordInEnglishObj : WordInEnglishModel) : Promise<Status> {

    //Keep track of whether the query was successful 
    let success = true;
    let errorMsg = '';

    //Add the wordInEnglish to the database
    await WordInEnglish.create({
        WordID: wordInEnglishObj.WordID,
        WordInEnglish: wordInEnglishObj.WordInEnglish
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
                message: `Successfully added (${wordInEnglishObj.WordID}, ${wordInEnglishObj.WordInEnglish}) to the database`
            }; 
            resolve(status);
        } 
        
        //If the query failed...
        else {

            //Don't need a line break if there is no existing error message
            if(errorMsg === '') {
                errorMsg = `Error adding (${wordInEnglishObj.WordID}, ${wordInEnglishObj.WordInEnglish}) to the database`;
            }

            //Otherwise append a line break and the remaining statement
            else {
                errorMsg += `\nError adding (${wordInEnglishObj.WordID}, ${wordInEnglishObj.WordInEnglish}) to the database`;
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