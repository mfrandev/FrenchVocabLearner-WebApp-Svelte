import { generateFlashcardsFromRegex } from "../../Database/Queries/FlashcardQueries/GetWordFlashcards";
import { WordFlashcardData } from "../../Database/Queries/FlashcardQueries/GetWordFlashcards";

/**
 * Get all words that start with the parameterized key
 * @param key The string that all words returned should start with
 */
export const getRegexDictionaryMatches = async (key: string) : Promise<WordFlashcardData[]> => {

    //State and status variables
    let dictionaryMatchData : any;
    let errorVal : string = '';
    let failure = false;

    //Get all of the flashcard data for all words matching the regex
    await generateFlashcardsFromRegex(key)

    //Save the match data
    .then(data => dictionaryMatchData = data)

    //Save the error status
    .catch(err => {
        errorVal = err.toString();
        console.log(errorVal);
        failure = true;
    });

    //Return a Promise from this function
    return new Promise<WordFlashcardData[]>((resolve, reject) => {

        //If the query was successful...
        if(!failure) {
            resolve(dictionaryMatchData);
        } 

        //If the query failed...
        else {
            reject({
                code: 500,
                error: errorVal
            });
        }
    });

}

