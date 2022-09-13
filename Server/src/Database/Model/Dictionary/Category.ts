import { DataTypes } from 'sequelize';
import { dbConnection, Status } from '../../../Config/DBConfig';

/**
 * Define the model of the Category table across the program
 */ 
export const Category = dbConnection.define('Category', {

    //CategoryID is the primary key, an integer, and cannot be null
    CategoryID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }, 

    //CategoryName is a string
    CategoryName: {
        type: DataTypes.STRING(69)
    }
}, 

//The name of the table is Category, and do not include timestamps for creation and update
{
    tableName: 'Category',
    createdAt: false,
    updatedAt: false,
});


/**
 * Interface that maps to the Category table in the database
 */
export interface CategoryModel {
    CategoryID: number,
    CategoryName: string
}

/**
 * Takes an object that maps to the structure of the 'Category' table from the database and 
 * adds it to the DB table
 * @param categoryObj CategoryModel
 * @returns Promise<Status>
 */
export async function addToCategory(categoryObj : CategoryModel) : Promise<Status> {

    //Keep track of whether the query was successful 
    let success = true;
    let errorMsg = '';

    //Add the Category to the database
    await Category.create({
        CategoryID: categoryObj.CategoryID,
        CategoryName: categoryObj.CategoryName
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
                message: `Successfully added (${categoryObj.CategoryID}, ${categoryObj.CategoryName}) to the database`
            }; 
            resolve(status);
        } 
        
        //If the query failed...
        else {

            //Don't need a line break if there is no existing error message
            if(errorMsg === '') {
                errorMsg = `Error adding (${categoryObj.CategoryID}, ${categoryObj.CategoryName}) to the database`;
            }

            //Otherwise append a line break and the remaining statement
            else {
                errorMsg += `\nError adding (${categoryObj.CategoryID}, ${categoryObj.CategoryName}) to the database`;
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