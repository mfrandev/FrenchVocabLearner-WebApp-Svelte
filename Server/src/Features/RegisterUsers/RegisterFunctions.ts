import { addAccountToDatabase } from "../../Database/Queries/AccountQueries/CreateAccount";
import { AccountModel, Account } from "../../Database/Model/Users/Account";
import { Status } from "../../Config/DBConfig";
import { Roles } from "../../Database/Model/Users/Role";

/**
 * Call this to add an account to the database once all of the checks are complete
 * @param accountObj 
 */
export const registerUser = async (accountObj: AccountModel) : Promise<Status> => {

    //Status variable
    let status: Status;
    
    //Add the acount data to the database
    await addAccountToDatabase(accountObj)

    //Obtain the success status
    .then(res => status = res)

    //Obtain the error status
    .catch(err => status = err);

    //Return a promise
    return new Promise<Status>((resolve, reject) => {

        //On success, resolve success status
        if(status.code === 200) {
            resolve(status);
        } 
        
        //On failure, reject the failure status
        else {
            reject(status);
        }

    });

}