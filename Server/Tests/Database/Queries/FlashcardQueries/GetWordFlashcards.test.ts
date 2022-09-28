import { describe, expect, it } from '@jest/globals';
import { Status } from '../../../../src/Config/DBConfig';
import { WordFlashcardData, generateFlashcardFromWordModel, 
    generateFlashcardFromWordID, generateFlashcardFromWord,
    getAllWordsLearnedByAccount, WordAndKnowledgeLevel,
    generateFlashcardsFromRegex } from '../../../../src/Database/Queries/FlashcardQueries/GetWordFlashcards';

// This file corresponds to src/Database/Queries/FlashcardQueries/GetWordFlashcards.ts and tests all functions/cases used in the application

describe('This set of tests verifies all of the ways that the application can retrieve the details for a given word', () => {

    // Tests generateFlashcardFromWordModel
    it('Should retrieve the details for a word given its WordModel (ID and username)', async () => {

        let data: WordFlashcardData;

        await generateFlashcardFromWordModel({WordID: 228, WordName: 'abattoir'})
        .then(res => data = res).catch(err => data = null);

        // Verify that the details for this word has all of the expected properties
        expect(data).not.toBeNull();
        expect(data.word.WordName).toBe('abattoir');
        expect(data.word.WordID).toBe(228);
        expect(data.category.CategoryID).toBe(8);
        expect(data.definitions.length).toBe(2);

    });

    // Tests generateFlashcardFromWordModel fails with bad input
    it('Should fail to retrieve the details for a word model with invalid data', async () => {

        let data: Status;

        await generateFlashcardFromWordModel({WordID: 2, WordName: 'n\'existe pas'})
        .then(res => data = null).catch(err => data = err);

        // Verify that the details for this word has all of the expected properties
        expect(data).not.toBeNull();
        expect(data.code).toBe(500);

    });

    // Tests generateFlashcardFromWordID
    it('Should retrieve the details for a word given its WordID (ID and username)', async () => {

        let data: WordFlashcardData;

        await generateFlashcardFromWordID(228)
        .then(res => data = res).catch(err => data = null);

        // Verify that the details for this word has all of the expected properties
        expect(data).not.toBeNull();
        expect(data.word.WordName).toBe('abattoir');
        expect(data.word.WordID).toBe(228);
        expect(data.category.CategoryID).toBe(8);
        expect(data.definitions.length).toBe(2);

    });

    // Tests generateFlashcardFromWordID fails with bad input
    it('Should fail to retrieve the details for a word model with invalid data', async () => {

        let data: Status;

        await generateFlashcardFromWordID(2)
        .then(res => data = null).catch(err => data = err);

        // Verify that the details for this word has all of the expected properties
        expect(data).not.toBeNull();
        expect(data.code).toBe(500);

    });

    // Tests genereateFlashcardsFromRegex
    it('Should return the first 8 alphabetically sorted matches that start with the specified regex', async () => {

        let delim = 'sor';

        let data: WordFlashcardData[];
        await generateFlashcardsFromRegex(delim).then(res => data = res).catch(err => data = null);
        
        expect(data).not.toBeNull();
        expect(data.length).toBe(8);
        data.forEach(word => {
            expect(word.definitions.length > 0).toBeTruthy();
        });

    });

    // Tests genereateFlashcardsFromRegex
    it('Should return an empty list because there are no words that start with the provided characters', async () => {

        let delim = 'fdsafasfdsgag';

        let data: WordFlashcardData[];
        await generateFlashcardsFromRegex(delim).then(res => data = res).catch(err => data = null);
        
        expect(data).not.toBeNull();
        expect(data.length).toBe(0);

    });

    // Tests generateFlashcardFromWord
    it('Should retrieve the details for a word given its WordID (ID and username)', async () => {

        let data: WordFlashcardData;

        await generateFlashcardFromWord('abattoir')
        .then(res => data = res).catch(err => data = null);

        // Verify that the details for this word has all of the expected properties
        expect(data).not.toBeNull();
        expect(data.word.WordName).toBe('abattoir');
        expect(data.word.WordID).toBe(228);
        expect(data.category.CategoryID).toBe(8);
        expect(data.definitions.length).toBe(2);

    });

    // Tests generateFlashcardFromWord fails with bad input
    it('Should fail to retrieve the details for a word model with invalid data', async () => {

        let data: Status;

        await generateFlashcardFromWord('abattor')
        .then(res => data = null).catch(err => data = err);

        // Verify that the details for this word has all of the expected properties
        expect(data).not.toBeNull();
        expect(data.code).toBe(500);

    });

    // Tests getAllWordsLearnedByAccount returns empty array for unreigstered email
    it('Should return a list of 10 words as instantiated in testSetup.ts', async () => {

        let words: WordAndKnowledgeLevel[];
        await getAllWordsLearnedByAccount('number@learned.com')
        .then(res => words = res).catch(err => words = null);

        expect(words).not.toBeNull();
        expect(words.length).toBe(10);
    });
    

    // Tests getAllWordsLearnedByAccount returns empty array for unreigstered email
    it('Should return empty array if unregistered email is parameterized', async () => {

        let words: WordAndKnowledgeLevel[];
        await getAllWordsLearnedByAccount('fake@email.com')
        .then(res => words = res).catch(err => words = err);

        expect(words).not.toBeNull();
        expect(words.length).toBe(0);
    });

});