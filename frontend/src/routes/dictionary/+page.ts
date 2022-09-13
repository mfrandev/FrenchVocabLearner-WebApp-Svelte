
import { session, getCredentials } from '../../stores/sessionStore';
import { getCSRF } from '../../csrf';
import { redirect } from '@sveltejs/kit';

// @ts-ignore
export async function load({ fetch }) {
    
    // session.set(-1);
    const csrfToken = await getCSRF(fetch);
    const userDetails = await getCredentials(fetch, csrfToken);
    let userExists = userDetails.status === 200;

    //If the user is logged in, set the store value
    if(userExists) {
        session.set(userDetails.json);
    } 
    
    //If no user, redirect to the index page because user does not have access
    else {
        session.set(null);
        throw redirect(303, '/');
    }
    
    return {
    csrfToken
};
}
