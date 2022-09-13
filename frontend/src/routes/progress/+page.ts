
import { session, getCredentials } from '../../stores/sessionStore';
import { getCSRF } from '../../csrf';
import { redirect } from '@sveltejs/kit';

// @ts-ignore
export async function load({ fetch }) {
    
    const csrfToken = await getCSRF(fetch);
    const userDetails = await getCredentials(fetch, csrfToken);
    let userExists = userDetails.status === 200;
    let knowledgeLevels;
    let wordsLearnedByAccount;

    //If user is logged in, get the details of the content the user has already learned
    if(userExists) {
        session.set(userDetails.json);

        //Get all knowledge levels that the user has learned
        let response = await fetch('http://localhost:3001/api/v1/learnMore/getAllKnowledgeLevelsLearnedByAccount', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken
            },
            credentials: 'include'
        });
        knowledgeLevels = await response.json();

        //Get all words the user has learned already
        response = await fetch('http://localhost:3001/api/v1/learnMore/getAllWordsAccountHasLearned', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken
            },
            credentials: 'include'
        });
        wordsLearnedByAccount = await response.json();
    } 
    
    //If no user, redirect to the index page because user does not have access
    else {
        session.set(null);
        throw redirect(303, '/');
    }

    console.log(knowledgeLevels);
    
    //Return the props
    return {
    csrfToken,
    knowledgeLevels,
    wordsLearnedByAccount
};
}
