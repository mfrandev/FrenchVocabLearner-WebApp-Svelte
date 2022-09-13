import { DataTypes } from 'sequelize';
import { dbConnection, Status } from '../../../Config/DBConfig';

//Object containing all of the existing roles
export enum Roles {
    User = 'USER',
    Dummy = 'DUMMY'
};

//Create the role in the database
export const Role = dbConnection.define('Role', {

    //ID is the primary key, a string, and cannot be null
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
    Name: {
        type: DataTypes.STRING
    }
},

//The name of the table is Role, and do not include timestamps for creation and update
{
    tableName: 'Role',
    createdAt: false,
    updatedAt: false
});

//Interface mapping to the role table of the DB
export interface RoleModel {
    ID: number,
    Name: string
};

/**
 * Given the role ID number, get all of the role data
 * @param id Role ID (number)
 * @returns 
 */
export const getRoleByID = async (id: number) : Promise<RoleModel> => {

    //State and success management variables
    let status : Status;
    let success = true;
    let role : RoleModel;

    //Get the role by its ID
    await dbConnection.query('SELECT * FROM `Role` WHERE ID = ?', {
        replacements: [id]
    })
    .then(([wrappedRole, metadata]) => {

        //Extract the desired data from the response
        let [target] = wrappedRole;

        //Save the role model object
        role = {
            ID: target[0],
            Name: target[1]
        };
    })

    //On failure, note there was an internal server error
    .catch(err => {
        success = false;
        status = {
            code: 500,
            message: 'Could not retrieve account roles from the database'
        }
    });

    //Return the new promise containing the role
    return new Promise<RoleModel>((resolve, reject) => {

        //On success, return the role
        if(success) {
            resolve(role);
        } 
        
        //On failure, return details on what went wrong
        else {
            reject(status);
        }

    });

}