import { describe, expect, it } from '@jest/globals';
import { AccountModel, getAccountByEmail, getAccountByUsername } from '../../../../src/Database/Model/Users/Account';

// This file corresponds to src/Database/Model/Users/Account.ts and tests all functions used in the application

describe('src/Databse/Model/Users/Account: Functions retrieving account data from the database for login', () => {

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