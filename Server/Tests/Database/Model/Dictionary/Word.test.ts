import { describe, expect, it } from '@jest/globals';
import { getWordByID, getWordByString, getWordsByRegex, getRandomWord, WordModel } from '../../../../src/Database/Model/Dictionary/Word';

// This file corresponds to src/Database/Model/Dictionary/Word.ts and tests all functions used in the application

describe('src/Databse/Model/Dictionary/Word: Functions retrieving word data from the database', () => {

    // Tests getWordByID
    it('Should return word data given a word ID', async () => {
        let wordModel: WordModel;
        await getWordByID(228).then(result => wordModel = result).catch(() => wordModel = null);
        expect(wordModel).not.toBeNull();
        expect(wordModel.WordID === 228 && wordModel.WordName === 'abattoir');
    });

    // Tests getWordByString
    it('Should return the data for a word given its string representation', async () => {
        let wordModel: WordModel;
        await getWordByString('abattoir').then(result => wordModel = result).catch(() => wordModel = null);
        expect(wordModel).not.toBeNull();
        expect(wordModel.WordID === 228 && wordModel.WordName === 'abattoir');
    });

    // Tests getWordsByRegex and that queries with non-english letters (like é) work
    it('Should return a list of the first 8 words that begin with the given string', async () => {
        let words: WordModel[];

        // String that every returned word should start with
        let delim = 'éb';
        
        await getWordsByRegex(delim).then(results => words = results).catch(() => words = null);
        expect(words).not.toBeNull();
        expect(words.length).toBe(8);
        expect(typeof words === 'object');
        
        // Check that each word starts with the delimeter
        words.forEach(word => {
            expect(word.WordName.substring(0, delim.length)).toBe(delim);
        });
    });

    // Tests getWordsByRegex
    it('Should only return a list of 3 words sinces thats how many start with sortie', async () => {
        let words: WordModel[];

        // String that every returned word should start with
        let delim = 'sortie';

        await getWordsByRegex(delim).then(results => words = results).catch(() => words = null);
        expect(words).not.toBeNull();
        expect(words.length).toBe(3);
        expect(typeof words === 'object');
        
        // Check that each word starts with the delimeter
        words.forEach(word => {
            expect(word.WordName.substring(0, delim.length)).toBe(delim);
        });
    });

    // Tests getRandomWord
    it('Should return one random record from the Word table', async () => {
        let wordModel: WordModel;
        await getRandomWord().then(result => wordModel = result).catch(() => wordModel = null);
        expect(wordModel).not.toBeNull();
        expect((wordModel.WordID > 0 && typeof wordModel.WordID === 'number') 
        && 
        (wordModel.WordName !== '' && typeof wordModel.WordName === 'string'));
    });

});