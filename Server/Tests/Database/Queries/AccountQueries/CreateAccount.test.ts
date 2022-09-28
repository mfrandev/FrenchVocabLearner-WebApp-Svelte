import { describe, expect, it } from '@jest/globals';
import { Status } from '../../../../src/Config/DBConfig';
import { addAccountToDatabase } from '../../../../src/Database/Queries/AccountQueries/CreateAccount';

// This file corresponds to src/Database/Queries/AccountQueries/CreateAccount.ts and tests all functions used in the application

describe('src/Databse/Queries/AccountQueries.ts: Wrapper function for createAccount and \
addAccountRole with more restrictions. Will not test functionality covered in Account.test.ts', () => {

    // Tests that invalid emails cause failure
    it('Should return status code 500 with an invalid email', async () => {

        let status: Status;

        await addAccountToDatabase({
            Email: 'erroremail@',
            Username: 'justwhy',
            Password: 'helloWorld123'
        }).then(res => status = null).catch(err => status = err);

        expect(status).not.toBeNull();
        expect(status.code).toBe(500);

    });

    // Tests that usernames less than 5 characters cause failure
    it('Should return status code 500 with an username less than 5 characters', async () => {

        let status: Status;

        await addAccountToDatabase({
            Email: 'valid@email.com',
            Username: 'name',
            Password: 'helloWorld123'
        }).then(res => status = null).catch(err => status = err);

        expect(status).not.toBeNull();
        expect(status.code).toBe(500);

    });

    // Tests that usernames with more than 15 characters cause failure
    it('Should return status code 500 with a username greater than 15 characters', async () => {

        let status: Status;

        await addAccountToDatabase({
            Email: 'valid@email.com',
            Username: 'namenamenamename',
            Password: 'helloWorld123'
        }).then(res => status = null).catch(err => status = err);

        expect(status).not.toBeNull();
        expect(status.code).toBe(500);

    });

        // Tests that usernames between 5 and 15 characers with valid emails trigger success
        it('Should return status code 200 with a valid username and email', async () => {

        let status: Status;

        await addAccountToDatabase({
            Email: 'success@email.com',
            Username: 'RealLogin',
            Password: 'helloWorld123'
        }).then(res => status = res).catch(err => status = null);

        expect(status).not.toBeNull();
        expect(status.code).toBe(200);

    });

});