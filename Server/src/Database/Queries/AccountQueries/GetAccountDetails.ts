import { validate } from "email-validator"
import { Status } from "../../../Config/DBConfig";
import { AccountModel, AccountWithRolesModel, getAccountByEmail, getAccountByUserID, getAccountByUsername } from "../../Model/Users/Account";
import { getAllRolesOfAccount } from "../../Model/Users/AccountRole";

//Take a username or an email and retrieve all of the authentication and authorization details for that user
export const getAccountDetailsWithRoles = async (searchKey: string) : Promise<AccountWithRolesModel> => {

    //Initialize the state and status variables
    let accountWithRoles : AccountWithRolesModel = {
        Account: {
            Email: '',
            Username: '',
            Password: '', 
            UserID: ''
        },
        Roles: []
    };
    let account : AccountModel;
    let error : Status;
    let success = true;
    
    //Evaluates to true if user entered an email
    if(validate(searchKey)) {

        //Get the account details using the email
        await getAccountByEmail(searchKey)

        //Save the account object 
        .then(accountDeets => {
            account = accountDeets;
            accountWithRoles.Account = account;
        })

        //Otherwise, produce an error nothing that there isn't a registered account with this email
        .catch(err => {
            success = false;
            error = {
                code: 401,
                message: 'Oops! There isn\'t a registered account with this email'
            };
        });

    } 

    //This block executes if searching by UserID
    else if(searchKey.length === 36) {

        //Get the account details using the username
        await getAccountByUserID(searchKey)
        .then(accountDeets => {
            account = accountDeets;
            accountWithRoles.Account = account;
        })

        //Note that there isn't an account with the entered email
        .catch(err => {
            success = false;
            error = {
                code: 401,
                message: 'Oops! There isn\'t a registered account with this UserID'
            };
        });

    }
    
    //This block executes if user entered a username
    else {

        //Get the account details using the username
        await getAccountByUsername(searchKey)
        .then(accountDeets => {
            account = accountDeets;
            accountWithRoles.Account = account;
        })

        //Note that there isn't an account with the entered email
        .catch(err => {
            success = false;
            error = {
                code: 401,
                message: 'Oops! There isn\'t a registered account with this username'
            };
        });

    }

    //If there was no errors, retrieve the roles beloning to this account
    if(!error) {
        await getAllRolesOfAccount(account.Email)
        .then(roles => accountWithRoles.Roles = roles)

        //If there was an error, save the details and note that the operation was unsuccessful
        .catch((err: Status) => {error = err; success = false});
    }

    //Return a new promise object, containing the account with its roles
    return new Promise<AccountWithRolesModel>((resolve, reject) => {
        
        //Resolve the account
        if(success) {
            resolve(accountWithRoles);
        } 
        
        //Resolve the error
        else {
            reject(error);
        }

    });

}
