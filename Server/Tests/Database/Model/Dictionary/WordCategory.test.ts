import { describe, expect, it} from '@jest/globals';
import { getWordCategoryByID } from './../../../../src/Database/Model/Dictionary/WordCategory';
import { CategoryModel } from './../../../../src/Database/Model/Dictionary/Category';
import { Status } from '../../../../src/Config/DBConfig';

// This file corresponds to src/Database/Model/Dictionary/WordCategory.ts and tests all functions used in the application

describe('src/Databse/Model/Dictionary/WordCategory: Functions retrieving word category data from the database', () => {

    // Tests getWordCategoryByID
    it('Should return the category (part of speech) given a word ID', async () => {
        let model: CategoryModel;

        // Same word as in Word.test.ts: abattoir
        await getWordCategoryByID(228).then(result => model = result).catch(() => model = null);
        expect(model).not.toBe(null);
        expect(model.CategoryID).toBe(8);
    });

    // Tests getWordCategoryByID appropriately fails
    it('Should return failure upon receiving an invalid wordID', async () => {

        let result: any;

        await getWordCategoryByID(2)
        .then(res => result = res).catch(err => result = err);

        // WordIDs without a word category should resolve as undefined
        expect(result).toBeUndefined();

    });
    
});