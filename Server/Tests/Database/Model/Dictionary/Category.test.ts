import { describe, test, expect } from '@jest/globals';
import { Category } from '../../../../src/Database/Model/Dictionary/Category';

describe('Make sure that the Sequelize client is properly interfacing with the Categories MariaDB table', () => {
    test('Check that the sequelize object is not null', () => {
        expect(Category).not.toBe(null);
    });
});