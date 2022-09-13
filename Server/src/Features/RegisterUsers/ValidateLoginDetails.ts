/**
 * Check whether or not a username is valid
 * @param username username to validate
 * @returns a boolean representing the validity of the username
 */
export const validateUsername = (username: string) => {

    //Matches all alphanumeric characters, the dash, and the underscore
    const regex = /[a-zA-Z0-9_\-]+/g;

    //Make sure there is only 1 match i.e., no spaces
    const found = username.match(regex);
    if(found === null) {
        return false;
    }

    //Check that the username is at least 5 characers long, no more than 15 long, and only 1 regex match
    return (username.length > 4 && username.length < 16 && found.length === 1 && username.length === found[0].length);

}

/**
 * Check whether or not a password is valid
 * @param password password to validate
 * @returns a boolean representing the validity of the password
 */
 export const validatePassword = (password: string) => {

    //Matches all Alphanumeric characters and a few select symbols 
    const regex = /[a-zA-Z0-9_\-!@#$%^&*()+=]+/g;

    //Make sure there is only 1 match i.e., no spaces
    const found = password.match(regex);
    if(found === null) {
        return false;
    }

    //Check that the password is at least 5 characers long, no more than 15 long, and only 1 regex match
    return (password.length > 7 && password.length < 26 && found.length === 1 && password.length === found[0].length);

}