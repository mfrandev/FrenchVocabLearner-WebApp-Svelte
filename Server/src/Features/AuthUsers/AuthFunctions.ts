import { validate } from 'email-validator';
import { compare } from 'bcryptjs';
import { Status } from '../../Config/DBConfig';
import { AccountWithRolesModel } from '../../Database/Model/Users/Account';
import { getAccountByEmail, getAccountByUsername } from '../../Database/Model/Users/Account';

/**
 * Takes the authenticator (email or password) and checks that the password for that account is correct (and exists)
 * @param body request body
 * @returns 
 */
export const validateLoginDetails = async (body: any, accountDetails: AccountWithRolesModel) : Promise<Status> => {

    //Login detail state variables
    let passwordMatches = false;
    let passwordCheckComplete = false;
    let status: Status = {
        code: 0,
        message: ''
    };
    let userID: string;

    //If true, this means user logged in with email
    if(validate(body.authenticator)) {

        // //Get user account by email
        // DEPRICATED DUE TO AUTHORIZATION IMPLEMENTATION
        // await getAccountByEmail(body.authenticator).then(async result => {

            //Check that the password entered matches the one from the database
            await compare(body.password, accountDetails.Account.Password.toString())

            //Take the result of the password check...
            .then(async result => {

                //Note the check occurred
                passwordCheckComplete = true;

                //Save the result of the check
                passwordMatches = result;

                if(passwordMatches) {
                    await getAccountByEmail(body.authenticator)
                    .then(account => {
                        userID = account.UserID;
                        status = {
                            code: 200,
                            message: 'Login Successful!'
                        };
                    })
                    .catch(() => {
                        status = {
                            code: 500,
                            message: 'Could not retrieve account with this email'
                        };
                    })
                } else {
                    //Create the request status based on failed password comparison
                    status = {
                        code: 401,
                        message: 'Invalid Password!'
                    };
                }
            })

            //If there was an error during password validation, return server error with message
            .catch(() => {
                status = {
                    code: 500,
                    message: 'Error while validating password. Does not indicate correctness of the login info'
                }
            });
        // })

        // DEPRICATED DUE TO AUTHORIZATION IMPLEMENTATION
        // //If there is no existing account with the entered email, return 401 with appropriate message
        // .catch(() => {
        //     status = {
        //         code: 401,
        //         message: 'Could not find an account with this email'
        //     };
        // });

    }

    //This means user logged in with username
    else {

        // //Get user account by username
        // DEPRICATED DUE TO AUTHORIZATION IMPLEMENTATION
        // await getAccountByUsername(body.authenticator).then(async result => {

            //Check that the password entered matches the one from the database
            await compare(body.password, accountDetails.Account.Password.toString())

            //Take the result of the password check...
            .then(async result => {

                //Note the check occurred
                passwordCheckComplete = true;

                //Save the result of the check
                passwordMatches = result;

                if(passwordMatches) {
                    await getAccountByUsername(body.authenticator)
                    .then(account => {
                        userID = account.UserID;
                        status = {
                            code: 200,
                            message: 'Login Successful!'
                        };
                    })
                    .catch(() => {
                        status = {
                            code: 500,
                            message: 'Could not retrieve account with this username'
                        };
                    })
                } else {
                    //Create the request status based on failed password comparison
                    status = {
                        code: 401,
                        message: 'Invalid Password!'
                    };
                }
            })

            //If there was an error during password validation, return server error with message
            .catch(() => {
                status = {
                    code: 500,
                    message: 'Error while validating password. Does not indicate correctness of the login info'
                }
            });
        // })

        // DEPRICATED DUE TO AUTHORIZATION IMPLEMENTATION
        //If there is no existing account with the entered username, return 401 with appropriate message
        // .catch(() => {
        //     status = {
        //         code: 401,
        //         message: 'Could not find an account with this username'
        //     };
        // });

    }   

    //For debugging
    // console.log('passwordMatches: ' + passwordMatches);
    // console.log('passwordCheckComplete: ' + passwordCheckComplete);
    // console.log('status code: ' + status.code);
    // console.log('status message: ' + status.message);


    //Return the status of the login attempt
    return new Promise<Status>((resolve, reject) => {
        if(passwordCheckComplete) {
            resolve(status);
        }
        else {
            reject(status);
        }
    });

}