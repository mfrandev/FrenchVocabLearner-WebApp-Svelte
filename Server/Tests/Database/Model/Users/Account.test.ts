import { describe, expect, it } from '@jest/globals';
import { Status } from '../../../../src/Config/DBConfig';
import { AccountModel, createAccount, getAccountByEmail, getAccountByUsername } from '../../../../src/Database/Model/Users/Account';

// This file corresponds to src/Database/Model/Users/Account.ts and tests all functions used in the application

describe('src/Databse/Model/Users/Account: Functions retrieving account data from the database for login', () => {

    // Tests createAccount
    it('Should create an account with the given details', async () => {

        let status: Status;

        await createAccount({
            Username: 'test',
            Password: 'testPassword',
            Email: 'test@email.com'
        }).then(res => status = res).catch(err => status = null);

        expect(status).not.toBeNull();
        expect(status.code).toBe(200);

    }); 

    // Tests createAccount enforces unique emails in the DB
    it('Should not permit account creation if a duplicate email is presented', async () => {
        let status: Status;

        await createAccount({
            Username: 'newUsername',
            Password: 'passwordDoesn\'tMatter',
            Email: 'temp@email.com'
        }).then(res => status = null).catch(err => status = err);

        expect(status).not.toBeNull();
        expect(status.code).toBe(500);
        expect(status.message).toBe('There is already an account registered with this email. If you forgot your password, you can recover it here.');
    });

    // Tests createAccount enforces unique usernames in the DB
    it('Should not permit account creation if a duplicate username is presented', async () => {
        let status: Status;

        await createAccount({
            Username: 'temporaryUser',
            Password: 'passwordDoesn\'tMatter',
            Email: 'new@email.com'
        }).then(res => status = null).catch(err => status = err);

        expect(status).not.toBeNull();
        expect(status.code).toBe(500);
        expect(status.message).toBe('There is already an account with this username. Try another one!');
    });

    // Tests getAccountByUsername
    it('Should return the details of the temp user given its username', async () => {
        let model: AccountModel;

        await getAccountByUsername('temporaryUser').then(res => model = res).catch(() => model = null);

        // Verify user data
        expect(model).not.toBeNull();
        expect(model.Email).toBe('temp@email.com');
        expect(model.Username).toBe('temporaryUser');

    });

    // Tests getAccountByEmail
    it('Should return the details of the temp user given its email', async () => {
        let model: AccountModel;

        await getAccountByEmail('temp@email.com').then(res => model = res).catch(() => model = null);

        // Verify user data
        expect(model).not.toBeNull();
        expect(model.Email).toBe('temp@email.com');
        expect(model.Username).toBe('temporaryUser');

    });

    // ========== getAccountByUserID is never used but I kept it for possible future use ==========

});