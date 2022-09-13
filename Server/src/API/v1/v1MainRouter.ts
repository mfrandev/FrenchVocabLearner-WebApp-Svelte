import express from 'express';
import { routerLearnMore } from './LearnMode';

//Create a router for v1
export const routerV1 = express.Router();

//Create a type map used to enter data into the database
export type map = {
  map: boolean[]
};

//This is only used to enter items into the database
export const dbEntry : map = {
  map: []
};

//Mount the main app functionality
//Can add more middlewares here
routerV1.use('/v1/learnMore', routerLearnMore);

//routerV1.use('/v1/loadData', routerLoadData);