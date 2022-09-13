
import { session, getCredentials } from '../../stores/sessionStore';
import { getCSRF } from '../../csrf';
import { redirect } from '@sveltejs/kit';

// @ts-ignore
export async function load({ fetch }) {
    
    const csrfToken = await getCSRF(fetch);
    const userDetails = await getCredentials(fetch, csrfToken);
    let userExists = userDetails.status === 200;

    //Save which quizzes the user can take here
    let quizzesAvailable;

    //If user is logged in, retrieve their details and store their account in the store
    if(userExists) {
        session.set(userDetails.json);

        //Determine if there are quizzes available for the user to take and return them if available
        let response = await fetch('http://localhost:3001/api/v1/learnMore/areQuizzesAvailable', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken
            },
            credentials: 'include'
        });
        quizzesAvailable = await response.json();
    } 
    
    //If user is not logged in, redirect to the index page
    else {
        session.set(null);
        throw redirect(303, '/');
    }
    
    //Return data prop object
    return {
    csrfToken,
    quizzesAvailable
};
}
