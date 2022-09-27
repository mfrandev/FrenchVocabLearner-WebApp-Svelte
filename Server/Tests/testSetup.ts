import { DBConnectionDetails, dbConnection } from './../src/Config/DBConfig'; 
import { registerUser } from '../src/Features/RegisterUsers/RegisterFunctions';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcryptjs';

// Clean the data before or after testing, depending on parameter provided
export const scrubDatabase = async (context?: string): Promise<String> => {

    let counter = 0;

    switch(context) {
        case 'setup':
            console.log(`\n\n========== Setting up ${DBConnectionDetails.database} for testing ==========`);
            break;
        case 'teardown':
            console.log(`\n========== Tearing down ${DBConnectionDetails.database} after testing ==========`);
            break;
        default:
            console.log(`\n========== Clearing ${DBConnectionDetails.database} ==========`);
            break; 
    }

    // Database table clearing order
    // 1. WordsLearnedByAccount
    // 2. AccountRole
    // 3. Account

    let promise = [];

    // ========== Clear any possible leftover data from another run ==========

    // Make sure there are no words registered to accounts in the DB
    promise.push(dbConnection.query('DELETE FROM WordsLearnedByAccount', {
        logging: false
    })
    .then(() => console.log(`${++counter}/3: Successfully cleared WordsLearnedByAccount`))
    .catch(err => console.log(err)));

    // Ensure the cleaning happens in order
    await Promise.all(promise);

    // Make sure no accounts are given roles
    promise.push(dbConnection.query('DELETE FROM AccountRole', {
        logging: false
    })
    .then(() => console.log(`${++counter}/3: Successfully cleared AccountRole`))
    .catch(err => console.log(err)));

    // Ensure cleaning in order
    await Promise.all(promise);

    // Get rid of all registered accounts
    promise.push(dbConnection.query('DELETE FROM Account', {
        logging: false
    })
    .then(() => console.log(`${++counter}/3: Successfully cleared Account`))
    .catch(err => console.log(err)));

    // Wait for operation to finish
    await Promise.all(promise);

    //If setup, create a dummy account so test suite is not sensitive to order
    if(context && context === 'setup') {
        promise.push(hash('temporaryPassword', 10)
        .then(async password => {
            promise.push(registerUser({
                Email: 'temp@email.com',
                Username: 'temporaryUser',
                Password: password,
                UserID: uuidv4()
            }).then(() => console.log('Successfully registered temp user')));
        }));
    }

    if(promise.length > 0) await Promise.all(promise);

    return new Promise(async (resolve) => {
        switch(context) {
            case 'setup':
                resolve('========== Ready for testing ==========');
                break;
            case 'teardown':
                // Close the connecton to the database so suite exits
                await dbConnection.close().then(() => console.log(`Successfully closed connection to ${DBConnectionDetails.database}`));
                resolve('========== Teardown complete ==========');
                break;
            default:
                resolve('========== Database cleared ==========');
        }
    });
}

// Call the above function to setup the tests
async function testSetup() {
    
    await scrubDatabase('setup');

}

export default testSetup;