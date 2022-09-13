import express from 'express';
import { routerCreateAndModifyAccount } from './CreateAndModifyAccount';
import { routerAuthenticateAccount } from './AuthenticateAccount';
import { logoutRouter } from './Logout';
import { userStateRouter } from './ManageUserState';

//Create a router for Authentication
export const routerAuth = express.Router();

//Mounts endpoints that create and modify user accounts
routerAuth.use('/auth', routerCreateAndModifyAccount);

//Mounts endpoints that authenticate an account
routerAuth.use('/auth', routerAuthenticateAccount);

//Mounts the logout endpoint
routerAuth.use('/auth', logoutRouter);

//Used to get the data about a user session
routerAuth.use('/auth', userStateRouter)

