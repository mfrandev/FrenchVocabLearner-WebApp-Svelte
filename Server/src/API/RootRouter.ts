import express from 'express';
import cors from 'cors';
import session from 'express-session';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import csurf from 'csurf';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4} from 'uuid';
import { routerV1 } from './v1/v1MainRouter';
import { routerAuth } from './Auth/AuthMainRouter';
import { blockTraceRequests } from '../Features/SecurityMiddleware/BlockXST';
import { isLoggedIn } from '../Features/SecurityMiddleware/IsLoggedIn';
import { onlyAllowApplicationJSON } from '../Features/SecurityMiddleware/JSONReqOnly';

export let MyRedisStore = require('connect-redis')(session);
export let redisClient = new Redis();

dotenv.config();

//Use this to allow relative endpoints
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};

//Create the express server
export const app = express();

//Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//Mount the cors middleware to be used for every incoming request
app.use(cors(corsOptions));

//Use this custom middleware to block trace requests and prevent XST attacks
app.use(blockTraceRequests);

//For CSRF
app.use(cookieParser());

//Mount the express json middleware to parse incoming requests of type application/json
app.use(express.json());

//Header of http request must be application/json
app.use(onlyAllowApplicationJSON);

const csrfProtection = csurf({ cookie: true });

//
app.use(
  session({

  genid: (req) => {
      return uuidv4(); // use UUIDs for session IDs
    },

  //Specify the redis store  
  store: new MyRedisStore({ 
      client: redisClient
   }),

  // name: 'session-cookie-temp',

  secret: process.env.SESSION_SECRET,
  
  //Consult my store to check whether it implements touch. If yes, this can be false, otherwise true
  resave: false,

  //Check if this needs to be changed after implementation
  saveUninitialized: true,

  // Will want to add this once HTTPS is acquired: 
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60,
    path: '/'
  }
}));

// Redis session check
app.use(function (req, res, next) {
    if (!req.session) {
      return next(new Error("oh no")) // handle error
    }
    console.log(req.session);
    if('UserState' in req.session) {
      // console.log(req.session);
    }
    next() // otherwise continue
  })

//Mount all the routes from v1 to the API
app.use('/api', routerV1);

//Mount all the authentication endpoints
app.use('/api', routerAuth);

app.get('/home', isLoggedIn, (req: any, res) => {
  res.status(200).send({message: `Hello, ${req.session.UserState.username}!`});
});

//This endpoint issues the CSRF token to the client to submit with all requests which modify backend state
app.get('/wow', csrfProtection, async (req, res) => {
  res.status(200).send({csrfToken: req.csrfToken()});
})

//Register the root API endpoint
app.get('/api', async (req, res) => {
    res.status(200).send({message: 'test successful'});
});

//Print on the server console that the app is ready for requests
app.listen(process.env.PORT, () => {

    // //Uncomment to begin loading data into the database
    // console.log('Preparing to load data:\nPlease wait...');
  
    // //If the map field exists in dbEntry...
    // if('map' in dbEntry) {
  
    //   //Using 553641 because I know that's how many total word entries there are in the database
    //   for(let i = 0; i < 553641; i++) {
  
    //     //Initialize the whole array as false
    //     dbEntry.map[i] = false;
    //   }
    // }

    console.log(process.env.NODE_ENV);
  
    //Display that the server is ready for requests, i.e., environment is prepared for adding data to the DB
    console.log(`Express is listening at http://localhost:${process.env.PORT}`);
  });