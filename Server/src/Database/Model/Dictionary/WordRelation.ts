import { DataTypes } from 'sequelize';
import { dbConnection, Status } from '../../../Config/DBConfig';
import { WordModel } from './Word';

/**
 * Define the model of the WordRelation table across the program
 */ 
export const WordRelation = dbConnection.define('WordRelation', {

    //WordID is the primary key, an integer, and cannot be null
    WordID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }, 

    //RelationID is the primary key, an integer, and cannot be null
    RelationID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }
}, 

//The name of the table is WordRelation, and do not include timestamps for creation and update
{
    tableName: 'WordRelation',
    createdAt: false,
    updatedAt: false,
});


/**
 * Interface that maps to the WordRelation table in the database
 */
export interface WordRelationModel {
    WordID: number,
    RelationID: number
}

/**
 * Takes an object that maps to the structure of the 'WordRelation' table from the database and 
 * adds it to the DB table
 * @param wordRelationObj WordRelationModel
 * @returns Promise<Status>
 */
export async function addToWordRelation(wordRelationObj : WordRelationModel) : Promise<Status> {

    //Keep track of whether the query was successful 
    let success = true;
    let errorMsg = '';

    //Add the WordRelation to the database
    await WordRelation.create({
        WordID: wordRelationObj.WordID,
        RelationID: wordRelationObj.RelationID
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
                message: `Successfully added (${wordRelationObj.WordID}, ${wordRelationObj.RelationID}) to the database`
            }; 
            resolve(status);
        } 
        
        //If the query failed...
        else {

            //Don't need a line break if there is no existing error message
            if(errorMsg === '') {
                errorMsg = `Error adding (${wordRelationObj.WordID}, ${wordRelationObj.RelationID}) to the database`;
            }

            //Otherwise append a line break and the remaining statement
            else {
                errorMsg += `\nError adding (${wordRelationObj.WordID}, ${wordRelationObj.RelationID}) to the database`;
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
 * Use the wordID to get all words it's related to (in the DB)
 * @param wordID 
 * @returns 
 */
export async function getRelationsFromWordID(wordID: number) : Promise<WordModel[]> {

    //Saves the result of a successful query
    let result: WordModel[] = [];

    //Saves the status of the query, used in the Promise return object
    let success = false;

    //Stores an error message, if applicable
    let errorMsg = '';

    await dbConnection.query(`SELECT * FROM WordRelation wr INNER JOIN Word w ON w.WordID = wr.RelationID WHERE wr.WordID = ?`,
    {
        replacements: [wordID]
    })
    .then(([results, metadata]) => {

        //Place each definition in the result array for easy use
        for(let i = 0; i < results.length; i++) {
            result.push({
                WordID: results[i][2],
                WordName: results[i][3]
            });
        }
        
        success = true;
    })
    .catch(err => {
        errorMsg = err.toString();
    });

    //Return a Promise from this function
    return new Promise<WordModel[]>((resolve, reject) => {

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