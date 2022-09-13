
import { session, getCredentials } from '../stores/sessionStore';
import { getCSRF } from '../csrf';

// @ts-ignore
export async function load({ fetch }) {

    // session.set(-1);
    const csrfToken = await getCSRF(fetch);
    const userDetails = await getCredentials(fetch, csrfToken);
    let userExists = userDetails.status === 200;

    //If user is logged in, save their details in the store
    if(userExists) {
        session.set(userDetails.json);
    } 
    
    //Otherwise store is empty
    else {
        session.set(null);
    }
   
    return {
        // csrfToken
    };
}
