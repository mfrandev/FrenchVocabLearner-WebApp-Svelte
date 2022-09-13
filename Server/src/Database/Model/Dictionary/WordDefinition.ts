import { DataTypes } from 'sequelize';
import { dbConnection, Status } from '../../../Config/DBConfig';

/**
 * Define the model of the WordDefinition table across the program
 */ 
export const WordDefinition = dbConnection.define('WordDefinition', {

    //WordID is the primary key, an integer, and cannot be null
    WordID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }, 

    //WordDefinitionName is a string
    Definition: {
        type: DataTypes.STRING(767),
        allowNull: false,
        primaryKey: true
    }
}, 

//The name of the table is WordDefinition, and do not include timestamps for creation and update
{
    tableName: 'WordDefinition',
    createdAt: false,
    updatedAt: false,
});


/**
 * Interface that maps to the WordDefinition table in the database
 */
export interface WordDefinitionModel {
    WordID: number,
    Definition: string
}

/**
 * Takes an object that maps to the structure of the 'WordDefinition' table from the database and 
 * adds it to the DB table
 * @param wordDefinitionObj WordDefinitionModel
 * @returns Promise<Status>
 */
export async function addToWordDefinition(wordDefinitionObj : WordDefinitionModel) : Promise<Status> {
    
    //Keep track of whether the query was successful 
    let success = true;
    let errorMsg = '';

    //Add the WordDefinition to the database
    await WordDefinition.create({
        WordID: wordDefinitionObj.WordID,
        Definition: wordDefinitionObj.Definition
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
                message: `Successfully added (${wordDefinitionObj.WordID}, ${wordDefinitionObj.Definition}) to the database`
            }; 
            resolve(status);
        } 
        
        //If the query failed...
        else {

            //Don't need a line break if there is no existing error message
            if(errorMsg === '') {
                errorMsg = `Error adding (${wordDefinitionObj.WordID}, ${wordDefinitionObj.Definition}) to the database`;
            }

            //Otherwise append a line break and the remaining statement
            else {
                errorMsg += `\nError adding (${wordDefinitionObj.WordID}, ${wordDefinitionObj.Definition}) to the database`;
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
 * Get all the definitions associated with a given wordID
 * @param wordID 
 * @returns 
 */
export async function getDefinitionsFromWordID(wordID: number) : Promise<string[]> {

    //Saves the result of a successful query
    let result: string[] = [];

    //Saves the status of the query, used in the Promise return object
    let success = false;

    //Stores an error message, if applicable
    let errorMsg = '';

    await dbConnection.query(`SELECT * FROM WordDefinition WHERE WordID = ?`, {
        replacements: [wordID]
    })
    .then(([results, metadata]) => {

        //Place each definition in the result array for easy use
        for(let i = 0; i < results.length; i++) {
            result.push(results[i][1]);
        }
        //console.log(result);
        success = true;
    })
    .catch(err => {
        errorMsg = err.toString();
    });

    //Return a Promise from this function
    return new Promise<string[]>((resolve, reject) => {

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