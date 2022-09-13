
import { session, getCredentials } from '../../stores/sessionStore';
import { getCSRF } from '../../csrf';
import { redirect } from '@sveltejs/kit';

// @ts-ignore
export async function load({ fetch, url }) {
    
    const csrfToken = await getCSRF(fetch);
    const userDetails = await getCredentials(fetch, csrfToken);
    let userExists = userDetails.status === 200;

    //Store the words which the user will learn
    let dataOld = undefined; 

    //Determine whether user wants all new words, or is ok with repeated words
    const ref = url.searchParams.get('allNew');

    //Save state for which words the user has learned and the IDs for those words
    let learnedWords = [];
    let learnedWordsID = [];

    //If the user is logged in, set the store value
    if(userExists) {
        session.set(userDetails.json);

        //Get the 10 words for the user to learn
        const response = await fetch(`http://localhost:3001/api/v1/learnMore/learnRandomWords?allNew=${ref}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken
            },
            credentials: 'include'
        });

        //Extract the response body
        dataOld = await response.json();

        //Initialize the page state as user has not learned anything
        for(let i = 0; i < dataOld.length; i++) {
            learnedWords[i] = false;
            learnedWordsID[i] = -1;
        }
    } 
    
    //If no user, redirect to the index page because user does not have access
    else {
        session.set(null);
        throw redirect(303, '/');
    }
    
    //Return the props
    return {
    csrfToken,
    dataOld,
    learnedWords,
    learnedWordsID
};
}
