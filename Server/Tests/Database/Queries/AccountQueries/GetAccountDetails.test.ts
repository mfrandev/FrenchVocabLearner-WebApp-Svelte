import { describe, expect, it } from '@jest/globals';
import { Status } from '../../../../src/Config/DBConfig';
import { getAccountDetailsWithRoles } from '../../../../src/Database/Queries/AccountQueries/GetAccountDetails';
import { AccountWithRolesModel } from './../../../../src/Database/Model/Users/Account';

// This file corresponds to src/Database/Queries/AccountQueries/GetAccountDetails.ts 
// and tests all functions/cases used in the application

describe('src/Databse/Queries/GetAccountDetails.ts: Wrapper function for getAccountBy<Identifier> and \
getAllRolesOfAccount to identify which credentials the user is logging in with. \
Will not test functionality covered in Account.test.ts', () => {

    // Tests getAccountDetailsWithRoles
    it('Should return the user\'s details given a valid username', async () => {

        let details: AccountWithRolesModel;

        await getAccountDetailsWithRoles('numLearned')
        .then(res => details = res).catch(() => details = null);

        expect(details).not.toBeNull();
        expect(details.Account.Username).toBe('numLearned');
        expect(details.Account.Email).toBe('number@learned.com');

        let ids = [];
        details.Roles.forEach(role => ids.push(role.ID));

        expect(ids).toContain(0);
        expect(ids).toContainEqual(1);

    });

    // Tests getAccountDetailsWithRoles
    it('Should return the user\'s details given a valid email', async () => {

        let details: AccountWithRolesModel;

        await getAccountDetailsWithRoles('number@learned.com')
        .then(res => details = res).catch(() => details = null);

        expect(details).not.toBeNull();
        expect(details.Account.Username).toBe('numLearned');
        expect(details.Account.Email).toBe('number@learned.com');

        let ids = [];
        details.Roles.forEach(role => ids.push(role.ID));

        expect(ids).toContain(0);
        expect(ids).toContainEqual(1);

    });

    // Tests getAccountDetailsWithRoles
    it('Should return a failure status upon receiving an email with no associated account', async () => {

        let details: Status;

        await getAccountDetailsWithRoles('invalid@email.com')
        .then(res => details = null).catch(err => details = err);

        expect(details).not.toBeNull();
        expect(details.code).toBe(401);
        expect(details.message).toBe('Oops! There isn\'t a registered account with this email');

    });
    
    // Tests getAccountDetailsWithRoles
    it('Should return a failure status upon receiving a username with no associated account', async () => {

        let details: Status;

        await getAccountDetailsWithRoles('noUserHere')
        .then(res => details = null).catch(err => details = err);

        expect(details).not.toBeNull();
        expect(details.code).toBe(401);
        expect(details.message).toBe('Oops! There isn\'t a registered account with this username');

    });

});