import { describe, expect, it } from '@jest/globals';
import { getDefinitionsFromWordID } from '../../../../src/Database/Model/Dictionary/WordDefinition';

// This file corresponds to src/Database/Model/Dictionary/WordDefinition.ts and tests all functions used in the application

describe('src/Databse/Model/Dictionary/WordDefinition: Functions retrieving word definition data from the database', () => {

    it('Should return all of the definitions for a given word', async () => {
        let definitions: string[];

        // Same word as in Word.test.ts: abattoir
        await getDefinitionsFromWordID(228).then(results => definitions = results).catch(definitions = null);
        expect(definitions).not.toBe(null);
        expect(definitions.length).toBe(2);
    });

});