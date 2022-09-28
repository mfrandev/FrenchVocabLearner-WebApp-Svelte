import { describe, expect, it } from '@jest/globals';
import { RoleModel, getRoleByID } from '../../../../src/Database/Model/Users/Role';


// This file corresponds to src/Database/Model/Users/Role.ts and tests all functions used in the application

describe('src/Databse/Model/Users/Role: Function for retrieving role data give a role ID', () => {

    // Tests getRoleByID
    it('Should return the data for the dummy role given its ID, 0', async () => {

        let model: RoleModel;

        await getRoleByID(0).then(res => model = res).catch(err => model = null);

        expect(model).not.toBeNull();
        expect(model.ID).toBe(0);
        expect(model.Name).toBe('DUMMY');

    });

});