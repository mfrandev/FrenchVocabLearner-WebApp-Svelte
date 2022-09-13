import { DataTypes } from 'sequelize';
import { dbConnection, Status } from '../../../Config/DBConfig';
import { RoleModel } from './Role';
import { v4 as uuidv4 } from 'uuid';

/**
 * Define the model of the Account table across the program
 */
export const Account = dbConnection.define('Account', {

    //Email is the primary key, a string, and cannot be null
    Email: {
        type: DataTypes.STRING(320),
        allowNull: false,
        primaryKey: true
    },

    //Username is a string
    Username: {
        type: DataTypes.STRING(15),
        unique: true
    },

    //Password is also a string
    Password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    UserID: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        unique: true
    }

},

    //The name of the table is Word, and include timestamps for creation and update
    {
        tableName: 'Account',
        createdAt: true,
        updatedAt: true,
    });


/**
 * Interface that maps to the Account table in the database
 */
export interface AccountModel {
    Email: string,
    Username: string,
    Password: string,
    UserID: string
}

/**
 * Interface that maps to the Account table and AccountRole table in the database
 */
 export interface AccountWithRolesModel {
    Account: AccountModel,
    Roles: RoleModel[]
}

/**
 * Add an account to the database
 * The validity check is completed before this function gets executed
 * @param accountObj Contains all of the fields needed for the database
 */
export const createAccount = async (accountObj: AccountModel) : Promise<Status> => {

    //Keep track of whether the query was successful 
    let success = true;
    let errorMsg = '';

    let uuid: string = uuidv4();

    //Add the Account to the database
    await Account.create({
        Email: accountObj.Email,
        Username: accountObj.Username,
        Password: accountObj.Password,
        UserID: uuid
    })

    //If unsuccessful, account for the error
    .catch(error => {

        let problemField = error.fields;

        if('PRIMARY' in problemField) {
            errorMsg = 'There is already an account registered with this email. \
            If you forgot your password, you can recover it here.';
        } else if('Username' in problemField) {
            errorMsg = 'There is already an account with this username. Try another one!';
        } else {
            errorMsg = 'Could not register your account. Please try again.'
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
                message: `Successfully registered ${accountObj.Email}!`
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
 * Return the authentication details of a user from the database given their username
 * @param username 
 * @returns 
 */
export const getAccountByUsername = async (username: string) : Promise<AccountModel> => {

    //State and status management variables
    let status : Status;
    let success = true;
    const accModel : AccountModel = {
        Email: '',
        Username: '',
        Password: '', 
        UserID: ''
    };

    //Get the user details from the database
    await dbConnection.query('SELECT * FROM Account WHERE Username = ?', {
        replacements: [username]
    })
    .then(([result, metadata]) => {

        //Save the details in the account model object
        let [ answer ] = result;
        accModel.Email = answer[0];
        accModel.Username = answer[1];
        accModel.Password = answer[2];
        accModel.UserID = answer[5];
    })

    //Query error
    .catch(err => {
        status = err; 
        success = false;
    });

    //Return the promise object
    return new Promise<AccountModel>((resolve, reject) => {

        //On successful query, return the user data
        if(success) {
            resolve(accModel);
        }

        //Otherwise, return the failure details
        else {
            reject(status);
        }
    });
}

/**
 * Return the authentication details of a user from the database given their email
 * @param email
 * @returns 
 */
export const getAccountByEmail = async (email: string) : Promise<AccountModel> => {

    //State and status management variables
    let status : Status;
    let success = true;
    const accModel : AccountModel = {
        Email: '',
        Username: '',
        Password: '',
        UserID: ''
    };

    //Get the user details from the database
    await dbConnection.query('SELECT * FROM Account WHERE Email = ?', {
        replacements: [email]
    })
    .then(([result, metadata]) => {

        //Save the details in the account model object
        let [ answer ] = result;
        accModel.Email = answer[0];
        accModel.Username = answer[1];
        accModel.Password = answer[2];
        accModel.UserID = answer[5];
    })

    //Query error
    .catch(err => {status = err; success = false;});

    //Return the promise object
    return new Promise<AccountModel>((resolve, reject) => {

        //On successful query, return the user data
        if(success) {
            resolve(accModel);
        }

        //Otherwise, return the failure details
        else {
            reject(status);
        }
    });
}

/**
 * Return the authentication details of a user from the database given their username
 * @param username 
 * @returns 
 */
 export const getAccountByUserID = async (userID: string) : Promise<AccountModel> => {

    //State and status management variables
    let status : Status;
    let success = true;
    const accModel : AccountModel = {
        Email: '',
        Username: '',
        Password: '', 
        UserID: ''
    };

    //Get the user details from the database
    await dbConnection.query('SELECT * FROM Account WHERE UserID = ?', {
        replacements: [userID]
    })
    .then(([result, metadata]) => {

        //Save the details in the account model object
        let [ answer ] = result;
        accModel.Email = answer[0];
        accModel.Username = answer[1];
        accModel.Password = answer[2];
        accModel.UserID = answer[5];
    })

    //Query error
    .catch(err => {
        status = err; 
        success = false;
    });

    //Return the promise object
    return new Promise<AccountModel>((resolve, reject) => {

        //On successful query, return the user data
        if(success) {
            resolve(accModel);
        }

        //Otherwise, return the failure details
        else {
            reject(status);
        }
    });
}
