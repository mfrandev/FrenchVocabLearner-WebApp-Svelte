import { describe, expect, it } from '@jest/globals';
import { Status } from '../../../../src/Config/DBConfig';
import { addAccountRole, getAllRolesOfAccount } from '../../../../src/Database/Model/Users/AccountRole';
import { RoleModel } from '../../../../src/Database/Model/Users/Role';

// This file corresponds to src/Database/Model/Users/AccountRole.ts and tests all functions used in the application

describe('src/Databse/Model/Users/AccountRole: Functions for associating roles and retrieving account \
role data from the database', () => {

    // Test addAccountRole
    it('Should add the dummy role to the temp account', async () => {

        let status: Status;

        // Add the role
        await addAccountRole({AccountEmail: 'temp@email.com', RoleID: 0}).then(res => status = res).catch(err => status = err);
        expect(status.code).toBe(200);

        // Try to add the role again but should fail
        await addAccountRole({AccountEmail: 'temp@email.com', RoleID: 0}).then(res => status = res).catch(err => status = err);
        expect(status.code).not.toBe(200);
    });

    // Test getAllRolesOfAccount
    it('Should return both account roles with ID 0 and 1 (i.e., length 2)', async () => {
        
        let roles: RoleModel[];
        await getAllRolesOfAccount('temp@email.com').then(res => roles = res).catch(err => roles = null);

        expect(roles).not.toBeNull();
        expect(roles.length).toBe(2);

    })

});