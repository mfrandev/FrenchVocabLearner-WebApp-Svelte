import { describe, expect, it } from '@jest/globals';
import { getRegexDictionaryMatches } from './../../../src/Features/DictionaryLookup/DictionaryFunctions';
import { WordFlashcardData } from './../../../src/Database/Queries/FlashcardQueries/GetWordFlashcards';

// This file corresponds to src/Features/DictionaryLookup/DictionaryFunctions.ts and tests all functions/cases used in the application

describe('These are an adaption of the tests for generateFlashcardsFromRegex in GetWordFlashcards.test.ts \
since getRegexDictionaryMatches is just a wrapper for this function', () => {

       // Tests getRegexDictionaryMatches
       it('Should return the first 8 alphabetically sorted matches that start with the specified regex', async () => {

        let delim = 'sor';

        let data: WordFlashcardData[];
        await getRegexDictionaryMatches(delim).then(res => data = res).catch(err => data = null);
        
        expect(data).not.toBeNull();
        expect(data.length).toBe(8);
        data.forEach(word => {
            expect(word.definitions.length > 0).toBeTruthy();
        });

    });

    // Tests getRegexDictionaryMatches
    it('Should return an empty list because there are no words that start with the provided characters', async () => {

        let delim = 'fdsafasfdsgag';

        let data: WordFlashcardData[];
        await getRegexDictionaryMatches(delim).then(res => data = res).catch(err => data = null);
        
        expect(data).not.toBeNull();
        expect(data.length).toBe(0);

    });

});