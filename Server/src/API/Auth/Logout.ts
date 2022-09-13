import express from 'express';
import { isLoggedIn } from '../../Features/SecurityMiddleware/IsLoggedIn';

//Create a router to use for logout
export const logoutRouter = express.Router();

/**
 * Logout the user
 */
logoutRouter.get('/logout', isLoggedIn, (req: any, res: any, next: any) => {

    // clear the user from the session object and save.
    // this will ensure that re-using the old session id
    // does not have a logged in user
    req.session.UserState = null
    req.session.cookie.maxAge = 1000 * 60 * 60;
    req.session.regenerate(function (err) {
    if (err) next(err)

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.save(function (err) {
        if (err) next(err)
        else res.status(200).send({message: "logout successful"})
        })
    })

});