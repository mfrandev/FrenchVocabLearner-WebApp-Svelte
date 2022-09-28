import { describe, expect, it } from '@jest/globals';
import { validateLoginDetails } from './../../../src/Features/AuthUsers/AuthFunctions';
import { getAccountDetailsWithRoles } from './../../../src/Database/Queries/AccountQueries/GetAccountDetails';
import { Status } from '../../../src/Config/DBConfig';

// This file corresponds to src/Features/AuthUsers/AuthFunctions.ts and tests all functions/cases used in the application

// All tests on validateLoginDetails
describe('This set of tests verifies that the server can properly identify a valid login from an invalid one', () => {

    it('Should return a success code upon processing a successful login to an existing account via email and password', async () => {

        let body = {authenticator: 'temp@email.com', password: 'temporaryPassword'};
        let status: Status;

        await getAccountDetailsWithRoles(body.authenticator).then(async details => {
            await validateLoginDetails(body, details).then(res => status = res).catch(err => status = null);
        })
        .catch(err => status = null);

        expect(status).not.toBeNull();
        expect(status.code).toBe(200);
        expect(status.message).toBe('Login Successful!');

    });

    it('Should return a success code upon processing a successful login to an existing account via username and password', async () => {

        let body = {authenticator: 'temporaryUser', password: 'temporaryPassword'};
        let status: Status;

        await getAccountDetailsWithRoles(body.authenticator).then(async details => {
            await validateLoginDetails(body, details).then(res => status = res).catch(err => status = null);
        })
        .catch(err => status = null);

        expect(status).not.toBeNull();
        expect(status.code).toBe(200);
        expect(status.message).toBe('Login Successful!');

    });

    // Flow of control in the server would not let a username or email that doesn't exist be passed to this function, so no need to test that case

    it('Should return a failure code upon processing an email based login with an incorrect password', async () => {

        let body = {authenticator: 'temp@email.com', password: 'wrong password'};
        let status: Status;

        await validateLoginDetails(body, {Account: {Email: 'temp@email.com', Password: 'temporaryPassword', Username: 'temporaryUser'}, Roles: []})
        .then(res => status = res).catch(err => status = err);
        
        expect(status).not.toBeNull();
        expect(status.code).toBe(401);
        expect(status.message).toBe('Invalid Password!');

    });

    it('Should return a failure code upon processing an username based login with an incorrect password', async () => {

        let body = {authenticator: 'temporaryUser', password: 'wrong password'};
        let status: Status;

        await validateLoginDetails(body, {Account: {Email: 'temp@email.com', Password: 'temporaryPassword', Username: 'temporaryUser'}, Roles: []})
        .then(res => status = res).catch(err => status = err);

        expect(status).not.toBeNull();
        expect(status.code).toBe(401);
        expect(status.message).toBe('Invalid Password!');

    });

});