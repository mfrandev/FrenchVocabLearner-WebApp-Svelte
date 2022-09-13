import { writable } from "svelte/store";
// import { redirect } from '@sveltejs/kit';

//User session interface
export interface Session {
    email: string,
    username: string,
    userID?: string,
    roles: [{
        ID: number,
        Name: string
    }]
};

/**
 * Creates a session object to be kept in the store
 * @param sessionObj 
 * @returns 
 */
const createSessionStore = (sessionObj: Session | null) => {

    //Use a writable store to store the session
    const { subscribe, set } = writable(sessionObj, function start(set) {

        // console.log('creating session store');
        
        //Function to be called when the session is removed from the store
        return function stop() {
            // console.log('deleting session from store');
            // set(null);
        }   

    });

    //Returns the subscribe and set methods
    return {
        subscribe, 
        set
    }

}

//Create an empty store and export it
export const session = createSessionStore(null);

//Function that parameterizes the special fetch function from context='module' setting
export const getCredentials = async (fetchFunc: Function, csrfToken: string) => {
    
    //Get the account details for the current user from the server
    const response = await fetchFunc('http://localhost:3001/api/auth/getUserState', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken
        },
        credentials: 'include'
    });

    //Get the response and return the data
    const json = await response.json();
    return {
        status: response.status,
        json: json
    }
}
