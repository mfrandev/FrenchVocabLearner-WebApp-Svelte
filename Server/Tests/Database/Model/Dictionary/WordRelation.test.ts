import { describe, expect, it } from '@jest/globals';
import { getRelationsFromWordID } from '../../../../src/Database/Model/Dictionary/WordRelation';
import { WordModel } from '../../../../src/Database/Model/Dictionary/Word';

// This file corresponds to src/Database/Model/Dictionary/WordRelation.ts and tests all functions used in the application

describe('src/Databse/Model/Dictionary/WordDefinition: Functions retrieving word relation data from the database', () => {

    it('Should return a list of word models related to the word ID entered', async () => {

        let relations: WordModel[];

        await getRelationsFromWordID(144).then(relatedWords => relations = relatedWords).catch(() => relations = null);
        expect(relations).not.toBeNull();
        expect(relations.length).toBe(1);
    });

    it('Should return an empty list since there are no words related to the word ID entered', async () => {

        let relations: WordModel[];

        await getRelationsFromWordID(228).then(relatedWords => relations = relatedWords).catch(() => relations = null);
        expect(relations).not.toBeNull();
        expect(relations.length).toBe(0);
    });

});

