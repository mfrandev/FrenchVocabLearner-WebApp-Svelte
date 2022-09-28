import { describe, expect, it } from '@jest/globals';
import { validateUsername, validatePassword } from '../../../src/Features/RegisterUsers/ValidateLoginDetails';

describe('Tests for the username and password validation functions', () => {

    it('Should validate the username upon receiving a string between 5 and 15 characers', async () => {
        expect(validateUsername('helloWorld')).toBeTruthy();
    });

    it('Should fail to validate the username upon receiving a string less than 5 characers', async () => {
        expect(validateUsername('hi')).toBeFalsy();
    });

    it('Should fail to validate the username upon receiving a string longer than 15 characers', async () => {
        expect(validateUsername('hellohellohellohihihi')).toBeFalsy();
    });

    it('Should validate the password upon receiving a string between 8 and 25 characers', async () => {
        expect(validatePassword('helloWorld')).toBeTruthy();
    });

    it('Should fail to validate the username upon receiving a string less than 8 characers', async () => {
        expect(validatePassword('hello')).toBeFalsy();
    });

    it('Should fail to validate the username upon receiving a string longer than 25 characers', async () => {
        expect(validatePassword('hellohellohellohellohelloh')).toBeFalsy();
    });

});