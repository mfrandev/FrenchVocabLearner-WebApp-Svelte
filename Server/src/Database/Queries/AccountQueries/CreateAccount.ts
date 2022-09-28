import { createAccount, AccountModel } from "../../Model/Users/Account"; 
import { validate } from 'email-validator';
import { Status } from "../../../Config/DBConfig";
import { addAccountRole } from "../../Model/Users/AccountRole";
import { validateUsername } from "../../../Features/RegisterUsers/ValidateLoginDetails";

/**
 * Takes all the fields necessary in the account table and tries to add them
 * @param accountObj Contains all of the fields for adding an account to the database
 * @returns A promise containing the success status
 */
export const addAccountToDatabase = async (accountObj: AccountModel) : Promise<Status> => {

    //Keep track of whether the query was successful 
    let success = true;

    //Save the status of adding the user to the database
    let status: Status;

    //If the email entered is valid and the username is 5 or more characters
    if(validate(accountObj.Email) && validateUsername(accountObj.Username)) {

        //Try adding the account to the database and save the status
        await createAccount(accountObj)
        .then(async (res) => {
            status = res;

            //Roles that the user automatically has...
            const roles = [1];
            const promises = [];

            //Try adding the account roles to the database and save the status
            roles.forEach(role => {

                //Promises list is to ensure that they all resolve before finishing the data processing
                promises.push(

                    //Creat the account role
                    addAccountRole({
                        AccountEmail: accountObj.Email,
                        RoleID: role
                    })

                    //Save the details on what happened on success or failure
                    .then(res => status = res)
                    .catch(err => {status = err; success = false;}));
            });

            //Wait for all async operations to resolve
            await Promise.all(promises);
        })
        .catch(err => {
            status = {
                        code: 500, 
                        message: 'Please try registering again with the correct username and email formatting'
                    }; 
            success = false;
        });

    } 
    
    //If failed, note that the addition did not succeed
    else {
        status = {
            code: 500, 
            message: 'Please try registering again with the correct username and email formatting'
        }; 
        success = false;
    }

    //Return a promise
    return new Promise<Status>((resolve, reject) => {

        //If the account was added, return the success status
        if(success) {
            resolve(status);
        } 
        
        //Otherwise, return the failure status
        else {
            reject(status);
        }

    });

}