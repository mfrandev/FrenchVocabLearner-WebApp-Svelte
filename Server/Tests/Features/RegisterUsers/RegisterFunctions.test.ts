import { describe, expect, it } from '@jest/globals';
import { Status } from '../../../src/Config/DBConfig';
import { registerUser } from '../../../src/Features/RegisterUsers/RegisterFunctions';
import { hash } from 'bcryptjs';

// This file corresponds to src/Features/RegisterUsers/RegisterFunctions.ts and tests all functions/cases used in the application

describe('Testing the wrapper function for creating an account', () => {

    // Tests registerUser
    it('Should successfully create an account using the registerUser function', async () => {

        let status: Status;

        await hash('temporaryPassword', 10)
        .then(async password => {
            await registerUser({
                Email: 'newUser@gmail.comc',
                Username: 'brandNew',
                Password: password
            }).then(res => status = res).catch(err => status = null);
        });

        expect(status).not.toBeNull();
        expect(status.code).toBe(200);

    });

    // Tests registerUser fail case with repeat username
    it('Should fail to create an account using the registerUser function with a non-unique username', async () => {

        let status: Status;

        await hash('temporaryPassword', 10)
        .then(async password => {
            await registerUser({
                Email: 'newUser@gmail.com',
                Username: 'numLearned',
                Password: password
            }).then(res => status = null).catch(err => status = err);
        })
        .catch(() => status = null);

        expect(status).not.toBeNull();
        expect(status.code).toBe(500);

    });
        
    // Tests registerUser fail case with repeat email
    it('Should fail to create an account using the registerUser function with a non-unique email', async () => {

        let status: Status;

        await hash('temporaryPassword', 10)
        .then(async password => {
            await registerUser({
                Email: 'number@learned.com',
                Username: 'uniqueUser',
                Password: password
            }).then(res => status = null).catch(err => status = err);
        })
        .catch(() => status = null);

        expect(status).not.toBeNull();
        expect(status.code).toBe(500);

    });
            
    
});