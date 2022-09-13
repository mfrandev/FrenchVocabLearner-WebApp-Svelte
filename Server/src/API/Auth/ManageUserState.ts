import express from 'express';
import { isLoggedIn } from '../../Features/SecurityMiddleware/IsLoggedIn';

//Router for retreiving user session data
export const userStateRouter = express.Router();

/**
 * This endpoint retreives the user's session data
 */
userStateRouter.get('/getUserState', isLoggedIn, (req: any, res) => {

    //Return the user state details
    if(req.session.UserState) {
        res.status(200).send(req.session.UserState);
    } 
    
    //Return an error
    else {
        res.status(500).send({message: 'Something went wrong!'});
    }
});