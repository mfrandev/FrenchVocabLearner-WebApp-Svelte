import express from 'express';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { getAccountDetailsWithRoles } from '../../Database/Queries/AccountQueries/GetAccountDetails';
import { validateLoginDetails } from '../../Features/AuthUsers/AuthFunctions';
import { AuthenticatedUserData } from '../../State/AuthenticatedUserState';

//Create the router 
export const routerAuthenticateAccount = express.Router();

routerAuthenticateAccount.use(bodyParser.urlencoded({ extended: false }));
routerAuthenticateAccount.use(bodyParser.json());

//Initialize CSRF
const csrfProtection = csurf({ cookie: true });

//For CSRF
routerAuthenticateAccount.use(cookieParser());

/**
 * This endpoint authenticats a user given a user email/username and password
 */
routerAuthenticateAccount.post('/authenticateLogin', csrfProtection, async (req: any, res: any, next: any) => {

    //If the request body is incorrectly formatted, return a bad request status
    if(!('authenticator' in req.body)) {
        return res.status(400).send({
            "message": "Bad request payload"
        });
    }

    //Format the request body object
    const body = {
        authenticator: req.body.authenticator,
        password: req.body.password
    };

    //Get the Account belonging to the authenticator (username/password)
    await getAccountDetailsWithRoles(body.authenticator)
    .then(async accountDetails => {

        //Check that the user's provided login details are valid
        await validateLoginDetails(body, accountDetails)
        .then(isValid => {

            //If they are valid...
            if(isValid.code === 200) {

                //Send a success status
                // res.status(200).send(isValid);

                    // regenerate the session, which is good practice to help
                    // guard against forms of session fixation
                    req.session.regenerate(function (err: any) {
                        if (err) {
                            console.log(err);
                            return res.status(500).send({code: 500, message: 'fail1!'})
                        };

                        // Store user information in session
                        const userState: AuthenticatedUserData =  {
                            email: accountDetails.Account.Email,
                            username: accountDetails.Account.Username,
                            userID: accountDetails.Account.UserID,
                            roles: accountDetails.Roles
                        };
                        
                        req.session.UserState = userState;
                        req.session.cookie.maxAge = 1000 * 60 * 60 * 24;

                        // res.status(200).send({code: 200, message: 'success!'});

                        // save the session before redirection to ensure page
                        // load does not happen before session is saved
                        req.session.save(function (err: any) {
                        if (err){
                            console.log(err);
                            return res.status(500).send({code: 500, message: 'fail2!'});
                        }
                        else return res.status(200).send({
                            code: isValid.code, 
                            message: isValid.message + " Redirecting Home...",
                            userState: userState
                        });
                    })
                })

            } else {
                //Return an unauthorized status on failure to authenticate
                console.log(isValid);
                return res.status(401).send(isValid);
            }
        })

        //Return error if authentication could not successfully terminate
        .catch(err => {
            console.log(err);
            return res.status(500).send(err);
        });
    })

    //Return error if account could not be found with the given authenticator
    .catch(err => {
        console.log(err);
        return res.status(500).send(err);
    });
    
});
