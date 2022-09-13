
import { session, getCredentials } from '../../stores/sessionStore';
import { getCSRF } from '../../csrf';
import { redirect } from '@sveltejs/kit';

// @ts-ignore
export async function load({ fetch, url}) {

    const csrfToken = await getCSRF(fetch);
    const userDetails = await getCredentials(fetch, csrfToken);
    let userExists = userDetails.status === 200;

    //Store the quiz here
    let dataOld = undefined;

    //Store the user quiz state here
    let knowledgeLevelDisplacementMap = [];
    let choisesSubmitted = [];

    //If user is logged in...
    if(userExists) {
        
        //Save the details in the store
        session.set(userDetails.json);

        //Generate a quiz for the user from the words they've learned already
        let level = url.searchParams.get('level');
        const response = await fetch(`http://localhost:3001/api/v1/learnMore/generateRandomQuizOnLearnedWords?level=${level}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken
            },
            credentials: 'include'
        });

        //Store the quiz here
        dataOld = await response.json();

        //Save the user's quiz state in these 2 arrays
        for(let i = 0; i < dataOld.length; i++) {
            knowledgeLevelDisplacementMap[i] = 0;
            choisesSubmitted[i] = '';
        }

    } 
    
    //If the user is not logged in, redirect to the index page
    else {
        session.set(null);
        throw redirect(303, '/');
    }
    
    //Return the props
    return {
        csrfToken,
        dataOld,
        knowledgeLevelDisplacementMap,
        choisesSubmitted
    };
}
