import { describe, expect, it } from '@jest/globals';
import { WordFlashcardData } from './../../../src/Database/Queries/FlashcardQueries/GetWordFlashcards';
import { learnTenRandomWords, getQuizAvailability, 
    getWordIDsForQuiz, generateQuizByListOfWordIDs } from '../../../src/Features/LearnMode/LearnModeFunctions';
import { Status } from '../../../src/Config/DBConfig';

// This file corresponds to src/Features/LearnMode/LearnModeFunctions.ts and tests all functions/cases used in the application

describe('Testing for top level functions used to get data for the user to learn', () => {

    // Tests learnTenRandomWords
    it('Should return 10 unique, random word flashcards for the user to learn', async () => {

        let data: WordFlashcardData[];

        await learnTenRandomWords().then(res => data = res).catch(err => data = null);

        // Check it returned 10 flashcards
        expect(data).not.toBeNull();
        expect(data.length).toBe(10);

        let wordsReturned = [];

        // Check each word returned is unique
        data.forEach(datum => {
            expect(wordsReturned).not.toContain(datum.word.WordID);
            wordsReturned.push(datum.word.WordID);
        });

    });

    // Tests getQuizAvailablity
    it('Should show 2 quizzes available for number@learned.com (levels any and 3)', async () => {

        let quizAvailability: {quizzes: {type: number | string, status: Status}[], numQuizzesAvailable: number};

        // Get quiz availability
        await getQuizAvailability('number@learned.com').then(res => quizAvailability = res);

        // Should be 2 quizzes available: any (index 0) and 3 (index 3)
        expect(quizAvailability.numQuizzesAvailable).toBe(2);
        for(let i = 0; i < quizAvailability.quizzes.length; i++) {
            if(i === 0 || i === 3) {
                expect(quizAvailability.quizzes[i].status.code).toBe(200);
            } else {
                expect(quizAvailability.quizzes[i].status.code).not.toBe(200);
            }
        }
    });

    // Tests getWordIDsForQuiz
    it('Should return a list of 10 word IDs with knowledge levels for level 3 quiz', async () => {

        let data: {wordID: number, knowledgeLevel: string}[];

        // Creates quiz at knowledge level 3 for number@learned.com
        await getWordIDsForQuiz(3, 'number@learned.com')
        .then(res => data = res).catch(err => data = null);

        expect(data).not.toBeNull();
        expect(data.length).toBe(10);

        let wordsReturned = [];

        // Check each word returned is unique
        data.forEach(datum => {
            expect(wordsReturned).not.toContain(datum.wordID);

            // Check knowledge level is always 3
            expect(datum.knowledgeLevel).toBe("3");
            wordsReturned.push(datum.wordID);
        });

    });

    // Tests getWordIDsForQuiz
    it('Should return a list of 10 word IDs with knowledge levels for any level quiz', async () => {

        let data: {wordID: number, knowledgeLevel: string}[];

        // Creates quiz at knowledge level 3 for number@learned.com
        await getWordIDsForQuiz('any', 'number@learned.com')
        .then(res => data = res).catch(err => data = null);

        expect(data).not.toBeNull();
        expect(data.length).toBe(10);

        let wordsReturned = [];

        // Check each word returned is unique
        data.forEach(datum => {
            expect(wordsReturned).not.toContain(datum.wordID);
            wordsReturned.push(datum.wordID);
        });
    });

    // Tests fail case for getWordIDsForQuiz
    it('Should return a 503 error because the user is not qualified to take the requested quiz', async () => {

        let data: Status;

        await getWordIDsForQuiz(4, 'number@learned.com')
        .then(res => data = null).catch(err => data = err);

        expect(data).not.toBeNull();
        expect(data.code).toBe(503);

    });

    // Tests fail case for getWordIDsForQuiz
    it('Should return a 503 error because the user does not exist', async () => {

        let data: Status;

        await getWordIDsForQuiz('any', 'fake@user.com')
        .then(res => data = null).catch(err => data = err);

        expect(data).not.toBeNull();
        expect(data.code).toBe(503);

    });

    // Tests generateQuizByListOfWordIDs
    it('Should return the list of flashcards given the input list of wordIDs with knowledge levels', async () => {

        let data: WordFlashcardData[];
        let input: {wordID: number, knowledgeLevel: string}[];

        await getWordIDsForQuiz('any', 'number@learned.com').then(async wordIDs => {
            input = wordIDs;
            await generateQuizByListOfWordIDs(input).then(res => data = res).catch(err => data = null);
        }).catch();

        // Already tested that each of these IDs will be unique
        let inputIDs = [];
        input.forEach(word => inputIDs.push(word.wordID));

        expect(data).not.toBeNull();
        expect(data.length).toBe(input.length);

        data.forEach(datum => expect(inputIDs).toContain(datum.word.WordID));

    });

    // Tests failure case of receiving bad input in generateQuizByListOfWordIDs
    it('Should return a 500 error because it was not given a list of 10 word IDs and knowledge levels', async () => {

        let data: Status;

        await generateQuizByListOfWordIDs([]).then(res => data = null).catch(err => data = err);
        
        expect(data).not.toBeNull();
        expect(data.code).toBe(500);
        expect(data.message).toBe('Error creating flashcards');

    });

    
});