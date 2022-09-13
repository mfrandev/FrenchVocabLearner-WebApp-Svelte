import express from 'express';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import { registerUser } from '../../Features/RegisterUsers/RegisterFunctions';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedUserData } from '../../State/AuthenticatedUserState';
import { getAllRolesOfAccount } from '../../Database/Model/Users/AccountRole';

export const routerCreateAndModifyAccount = express.Router();

const csrfProtection = csurf({ cookie: true });
//For CSRF
routerCreateAndModifyAccount.use(cookieParser());

/**
 * This endpoint saves the details for a new account in the database
 */
routerCreateAndModifyAccount.post('/register', csrfProtection, async (req: any, res) => {

    //Randomly create the salt value for each registration
    const saltRounds = Math.abs(Math.random());

    //Save the encrypted password hash here
    let password : string;

    //Asynchronously create the hash
    await hash(req.body.password, saltRounds)
    .then(async myHash => {

        //Save the hash
        password = myHash;

        //Generate a UUID
        let userID = uuidv4();
        
        //Register the user in the database using the information provided
        await registerUser({
            Email: req.body.email,
            Username: req.body.username,
            Password: password,
            UserID: userID
        })

        //If successful, create a session cookie to log in the user
        .then(async () => {

            //Get all of the roles associated with the new user's account
            await getAllRolesOfAccount(req.body.email)
            .then(roles => {

                //Create the cookie for the user session
                req.session.regenerate(function (err: any) {

                    //Encountered an error
                    if (err) res.status(500).send({code: 500, message: 'Registration successful, but we encountered an error taking you home. Please try logging in using your signup details.'});

                    //Package the user's data to send to the client
                    const accountDetails: AuthenticatedUserData = {
                        email: req.body.email,
                        username: req.body.username,
                        roles: roles
                    }

                    //Add the data to the cookie
                    req.session.UserState = accountDetails;

                    //Set the cookie age to one day
                    req.session.cookie.maxAge = 1000 * 60 * 60 * 24;

                    //Save the cookie
                    req.session.save(function (err: any) {
                        if (err) res.status(500).send({code: 500, message: 'Registration successful, but we encountered an error taking you home. Please try logging in using your signup details.'});
                        else res.status(200).send({code: 200, message: 'Successfully created your account!'});
                    });

                });
            })

            // If there was an error, save the details and note that the operation was unsuccessful
            .catch((err) => res.status(500).send(err));
        })

        //If unsuccessful, alert the user the account could not be created
        .catch(err => res.status(500).send(err));
    })

    //If the hash could not be generated, return an internal server error
    .catch(err => res.status(500).send(err));

});