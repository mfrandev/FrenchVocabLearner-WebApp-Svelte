import { describe, expect, it, test } from '@jest/globals';
import { and } from 'sequelize/types';
import { Status } from '../../../../src/Config/DBConfig';
import { learnWord, getRandomQuizAvailability, updateKnowledgeLevelForWordLearned, 
    getRandomWordIDLearnedByAccount, getAllKnowledgeLevelByAccount,
    getAllWordIDsLearnedByAccount } from '../../../../src/Database/Model/Dictionary/WordsLearnedByAccount';


// This file corresponds to src/Database/Model/Dictionary/WordsLearnedByAccount.ts and tests all functions used in the application

describe('src/Databse/Model/Dictionary/WordsLearnedByAccount: Functions associated with words a user has learned', () => {

    // Tests learnWord success case
    it('Should teach a word to the test user created in the setup', async () => {

        let status: Status;

        await learnWord({WordLearnedID: 228}, 'temp@email.com').then(res => status = res).catch(err => status = err);
        expect(status).not.toBeNull();
        expect(status.code).toBe(200);
    });

    // Tests learnWord failure case
    it('Should fail to teach this word to the test user because it\'s already been learned', async () => {

        let status: Status;

        await learnWord({WordLearnedID: 228}, 'temp@email.com').then(res => status = res).catch(err => status = err);
        expect(status).not.toBeNull();
        expect(status.code).toBe(500);
    });

    // Tests getRandomQuizAvailability for level any and 3 available
    it('Should add 9 more words to the dictionary to test checking for quiz viability', async () => {

        // ========== Add 9 more words to dictionary at level 3 ==========
        const wordIDs = [1630, 3198, 5374, 9046, 12548, 17395, 20877, 24205, 25519];
        let promises = [];
        wordIDs.forEach(id => {
            promises.push(learnWord({WordLearnedID: id, KnowledgeLevel: '3'}, 'temp@email.com'));
        });
        await Promise.all(promises);
        // ========== END add more words to dictionary for test ==========

        let quizAvailability: {quizzes: {type: number | string, status: Status}[], numQuizzesAvailable: number};

        // Get quiz availability
        await getRandomQuizAvailability('temp@email.com').then(res => quizAvailability = res);

        // Should be 2 quizzes available: any (index 0) and level 3 (index 3)
        expect(quizAvailability.numQuizzesAvailable).toBe(2);
        for(let i = 0; i < quizAvailability.quizzes.length; i++) {
            if(i === 0 || i === 3) {
                expect(quizAvailability.quizzes[i].status.code).toBe(200);
            } else {
                expect(quizAvailability.quizzes[i].status.code).not.toBe(200);
            }
        }

    }); 

    // Tests increment and decrement for updateKnowledgeLevelForWordLearned
    it('Should increment the knowledge level of word 228 and decrement for word 1630 for the test account in the datbase', async () => {

        let status: Status;

        // Increment 228
        await updateKnowledgeLevelForWordLearned(true, '3', 'temp@email.com', 228)
        .then(res => status = res).catch(err => status = err);

        // Expect success code upon completion
        expect(status.code).toBe(200);

        // Decrement 1630
        await updateKnowledgeLevelForWordLearned(false, '3', 'temp@email.com', 1630)
        .then(res => status = res).catch(err => status = err);

        // Expect success code upon completion
        expect(status.code).toBe(200);

    });

    // Tests that getRandomQuizAvailability reads persisted state 
    it('Should show that the level 3 quiz is no longer available after modifying knowledge levels for 228 and 1630', async () => {

        let quizAvailability: {quizzes: {type: number | string, status: Status}[], numQuizzesAvailable: number};

        // Get quiz availability
        await getRandomQuizAvailability('temp@email.com').then(res => quizAvailability = res);

        // Should be 1 quiz available: any (index 0)
        expect(quizAvailability.numQuizzesAvailable).toBe(1);
        for(let i = 0; i < quizAvailability.quizzes.length; i++) {
            if(i === 0) {
                expect(quizAvailability.quizzes[i].status.code).toBe(200);
            } else {
                expect(quizAvailability.quizzes[i].status.code).not.toBe(200);
            }
        }
    });

    // Tests getRandomWordIDLearnedByAccount
    it('Should show that the program only retrieves word IDs learned by the user by retrieving a random word N times, \
    where N is the number of words learned', async () => {

        const wordIDs = [228, 1630, 3198, 5374, 9046, 12548, 17395, 20877, 24205, 25519];

        //To hold all promises to resolve
        let promises = [];

        for(let i = 0; i < wordIDs.length; i++) {
            promises.push(getRandomWordIDLearnedByAccount('any', 'temp@email.com')

            //Check that the wordID from the DB is in the list above
            .then(wordIDandKnowledgeLevel => expect(wordIDs).toContain(wordIDandKnowledgeLevel.wordID))

            //If function fails, fail test
            .catch(() => expect(0).toBe(1)));
        }

        await Promise.all(promises);

    });

    // Tests getAllKnowledgeLevelByAccount
    test('That the database contains all and only the knowledge levels of words the user has learned', async () => {

        // All levels of words in the DB
        const levels = ['any', 2, 3, 4];
        let levelsDB: any[];

        // Get the knowledge levels from the DB
        await getAllKnowledgeLevelByAccount('temp@email.com').then(res => levelsDB = res).catch(() => levelsDB = null);

        // Check that the levels are not null
        expect(levelsDB).not.toBeNull();

        // Sort function to assure strict equality applies no matter the order or each list
        const sort = (a, b) => {
            let typeAIsNumber = typeof a === 'number';
            let typeBIsNumber = typeof b === 'number';
    
            //If 'any' is either of the types
            if(typeAIsNumber && typeBIsNumber) {
                if(a > b) return 1;
                else if(a < b) return -1;
                return 0;
            }
    
            //Otherwise sort normally
            else if(!typeAIsNumber && typeBIsNumber) {
                return -1;
            }
    
            //Sort normally
            else if(typeAIsNumber && !typeBIsNumber) {
                return 1;
            }
        }

        // Sort each list based on the functions
        levelsDB.sort(sort);
        levels.sort(sort);

        // Check strict equality for both lists
        expect(levels).toStrictEqual(levelsDB);
    });

    // Test getAllWordIDsLearnedByAccount
    test('That the database retrieves the list of all words that the test user has learned', async () => {

        const wordIDs = [228, 1630, 3198, 5374, 9046, 12548, 17395, 20877, 24205, 25519];

        // Structure: [[wordID, knowledge level], [wordID, knowledge level]...]
        let words: any;

        await getAllWordIDsLearnedByAccount('temp@email.com').then(res => words = res).catch(() => words = null);

        //Check that the database knows every word the user has learned
        for(let i = 0; i < words.length; i++) {
            expect(wordIDs).toContain(words[i][0]);
        }

    });

});