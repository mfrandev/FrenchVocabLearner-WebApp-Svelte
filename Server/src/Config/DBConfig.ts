import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

//For getting .env 
dotenv.config();

/**
 * This object contains the details used to connect to the database.
 * Changing these fields here changes them for the rest of the system.
 */
export const DBConnectionDetails = {
    username: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_USERNAME : process.env.DB_USERNAME,
    password: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_PASSWORD : process.env.DB_PASSWORD,
    database: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_NAME : process.env.DB_NAME
}

/**
 * This interface contains the data of whether a database operation was successful or not
 */
export interface Status {
    code: number,
    message: string
}

/**
 * This object exports the database connection
 */
export const dbConnection = new Sequelize(DBConnectionDetails.database, DBConnectionDetails.username, DBConnectionDetails.password, {
    dialect: 'mariadb',
    dialectOptions: {
        rowsAsArray: true
    },
    pool: {
        max: 100,
        min: 0,
        acquire: 12000000,
        idle: 10000000,
    },
    logging: false
});


