<script lang="ts">
    // throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");
    /** @type {import('./$types').PageData */
    export let data: any;

    import { validate } from 'email-validator';
    import { fly, fade } from 'svelte/transition';
    import { goto } from '$app/navigation';

    /**
     * Setup the form variables
     */
    let username = '';
    let email = '';
    let password = '';
    let passwordConfirmation = '';

    //Verification status for each entry
    let validUsername = false;
    let validEmail = false;
    let validPassword = false;
    let validPasswordMatch = false;

    let json: any = {};

    //Enables the create account button once the client minimizes the chances of a processing error
    $: canSubmit = validEmail && validPassword && validUsername && validPasswordMatch;

    $: validUsernameChunk = validateusernameChunk(username);
    $: validPasswordChunk = validatePasswordChunk(password);

    /**
     * This function is used to check that if the user ever enters an invalid symbol in the username field
    */
    const validateusernameChunk = (usernameChunk: string) => {

        if(usernameChunk.length === 0) {
            return true;
        }

        const regex = /[a-zA-Z0-9_\-]+/g;

        //Make sure there is only 1 match i.e., no spaces
        const found = usernameChunk.match(regex);
        // console.log(found);
        if(found === null) {
            return false;
        }

        //Check that the username has no invalid characters and is not too long
        return (username.length === 0 || (found.length === 1 && found[0].length === username.length && username.length < 16));

    }

    /**
     * Check whether or not a username is valid
     * @param usernameCheck username to validate
     * @returns a boolean representing the validity of the username
     */
    const validateUsername = (usernameCheck: string) => {

        /**
         * RULES:
         * 1. Must have at least 5 characters and no more than 15
         * 2. Characters allowed: [a-zA-Z0-9_\-]
         */
        const regex = /[a-zA-Z0-9_\-]+/g;

        //Make sure there is only 1 match i.e., no spaces
        const found = usernameCheck.match(regex);
        if(found === null) {
            return false;
        }

        //Check that the username is at least 5 characers long, no more than 15 long, and only 1 regex match
        return (usernameCheck.length > 4 && usernameCheck.length < 16 && found.length === 1 && found[0].length === username.length);

    }

    /**
     * This function is used to check that if the user ever enters an invalid symbol in the password field
    */
    const validatePasswordChunk = (passwordChunk: string) => {

        if(passwordChunk.length === 0) {
            return true;
        }

        /**
         * RULES:
         * 1. Must have at least 8 characters and no more than 25
         * 2. Characters allowed: [a-zA-Z0-9_\-!@#$%^&*]+
         * 3. Password must have at least 1 upper-case and lower-case letter
         * 4. Password must have at least 1 number
         * 5. Password must have at least 1 symbol
         */
         const regex = /[a-zA-Z0-9_\-!@#$%^&*()+=]+/g;

        //Make sure there is only 1 match i.e., no spaces
        const found = passwordChunk.match(regex);
        // console.log(found);
        if(found === null) {
            return false;
        }

        //Check that the password is at least 8 characers long, no more than 25 long, and only 1 regex match
        return ((found.length === 1 && found[0].length === password.length && password.length < 26));

    }

    /**
    * Check whether or not a password is valid
    * @param passwordCheck password to validate
    * @returns a boolean representing the validity of the password
    */
    export const validatePassword = (passwordCheck: string) => {

        /**
         * RULES:
         * 1. Must have at least 8 characters and no more than 25
         * 2. Characters allowed: [a-zA-Z0-9_\-!@#$%^&*]+
         * 3. Password must have at least 1 upper-case and lower-case letter
         * 4. Password must have at least 1 number
         * 5. Password must have at least 1 symbol
         */
        const regex = /[a-zA-Z0-9_\-!@#$%^&*()+=]+/g;

        //Make sure there is only 1 match i.e., no spaces
        const found = passwordCheck.match(regex);
        if(found === null) {
            return false;
        }

        //Check that the password is at least 8 characers long, no more than 25 long, and only 1 regex match
        return (passwordCheck.length > 7 && passwordCheck.length < 26 && found.length === 1 && found[0].length === password.length);

    }

    /**
     * Post the user data to the server for signup
     * @param e
     */
    async function onSubmit(e: any) {

        //If signup failed, prevent default, and show error message
        e.preventDefault();

        //This returns the response itself
        const response = await fetch('http://localhost:3001/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password,
                email: email
            }),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': data.csrfToken
            },
            credentials: 'include'
        });
        json = await response.json();

        if(json.code === 200) {
            // setTimeout(() => {
            goto('/home', { replaceState: true });
            // }, 2000);
        }

    }

    let color: string;

    $: {
        if('code' in json) {
            color = json.code === 200 ? 'green' : 'red';
        }
    }

    import Header from '../../components/Header.svelte';
    import VisibleStatusOnInput from '../../components/VisibleStatusOnInput.svelte';
    import ShowPassword from '../../components/ShowPassword.svelte';
    import MoreInfo from '../../components/MoreInfo.svelte';
    import PasswordStrengthBar from '../../components/PasswordStrengthBar.svelte';
    
</script>

<!-- TODO (in any order)

    1. Show when an invalid password is entered and pulse the information circle
    2. Have a validateUsernameChunk to send a pulse to the username information circle

    Once ready to implement session cookies and frontend authorization
    2. Redirect to homescreen on success
    3. Figure out session cookies
    4. Figure out email confirmation for account access

-->

<svelte:head>
    <title>Create An Account</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@1,700&display=swap" rel="stylesheet">
</svelte:head>

<div class='page-wrapper'>

    <!-- Page Header Component -->
    <Header headerVisible={true} position={'relative'} padding={'1.7rem 0 1rem 0'}/>

    <!-- This is the prompt telling the user this page is for creating an account -->
    <div class="header" in:fly={{x:-50, duration: 1500}}>
        <div class="text">
            Create an account
        </div>
    </div>

    <!-- This IF block is used to display any error messages in the account creation process -->
    {#if json !== undefined && 'message' in json}
        <div class='response-message-wrapper' in:fade={{duration: 300}}>
            <div class='response-message-container' style='color: {color}; border-bottom: 1px solid {color};'>
                <!-- <div class='error-icon'>
                    <i class="fa-solid fa-circle-exclamation"/>
                </div>
                <div class='error-message'>
                    {json.message}
                </div> -->
                {#if json.code === 200}
                        <div class='icon'>
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                    {:else}
                        <div class='icon'>
                            <i class="fa-solid fa-circle-exclamation"/>
                        </div>
                    {/if}
                <div class='message'>
                    {json.message}
                </div>
            </div>
        </div>
    {/if}

    
    <!-- This is the whole input signup form -->
    <div class="wrapper">
        <form class="flexContainer" on:submit={onSubmit} in:fade={{duration:1500}}>

            <!-- ----------EMAIL FIELD---------- -->
            <div class='input-container'>
                <div class="label">
                    <label for='registerEmail' class='label'>E-Mail</label>
                </div>
                <div class = 'input-wrap flex'>
                    <input placeholder='E-Mail Address' class='type' type='email' id='registerEmail' bind:value={email} required>
                    <VisibleStatusOnInput  
                    on:updateVerificationStatus={event => validEmail = event.detail.isValid}
                    bind:value={email} 
                    verificationFunction={validate}
                    />
                </div>
            </div>
            
            <!-- ----------USERNAME FIELD---------- -->
            <div class='input-container'>
                <div class="label">
                    <div>
                        <label for='registerUsername' class='label'>Username</label>
                    </div>
                    <!-- TODO: implement the more info component -->
                    <MoreInfo description={'A Username Must:<br>1. Have between 5 and 15 characers (inclusive)\
                    <br>2. Use exclusively alphanumeric characers, the underscore ( _ ), and hyphen ( - )<br>\
                    3. Exclusively contain the characters referenced above'}
                    pulseActive={validUsernameChunk}/> 
                </div>
                <div class = 'input-wrap flex'>
                    <input placeholder = 'Username' class='type' type='text' id='registerUsername' bind:value={username} required>
                    <VisibleStatusOnInput   
                    on:updateVerificationStatus={event => validUsername = event.detail.isValid}
                    bind:value={username} 
                    verificationFunction={validateUsername}
                    />
                </div>
            </div>

            <!-- ----------PASSWORD FIELD---------- -->
            <div class='input-container'>
                <div class="label">
                    <label for='registerPassword' class='label'>Password</label>
                    <!-- TODO: implement the more info component -->
                    <MoreInfo description={'A Password On This Site:<br>1. Must have between 8 and 25 characers (inclusive)\
                        <br>2. May contain any alphanumeric characters<br>\
                        3. May contain any of the following symbols _ - ! @ # $ % ^ & * ( ) + =<br>4. Must exclusively contain the\
                        characters referenced above<br>5. Password strength estimations powered by zxcvbn'}
                        pulseActive={validPasswordChunk}
                    />
                </div>
                <div class = 'input-wrap flex'>
                    <input placeholder = 'Password' class='type' type='password' id='registerPassword' bind:value={password} required>
                    <ShowPassword inputFieldID='registerPassword'/>
                    <VisibleStatusOnInput  
                    on:updateVerificationStatus={event => validPassword = event.detail.isValid}
                    bind:value={password} 
                    verificationFunction={validatePassword}
                    />
                </div>
                <!-- Password Strength indicator goes here -->
                <PasswordStrengthBar bind:password={password} validatorFunction={validatePasswordChunk} />
            </div>

            <!-- ----------PASSWORD CONFIRM FIELD---------- -->
            <div class='input-container'>
                <div class="label">
                    <label for='registerPasswordConfirmation'>Confirm Password</label>
                </div>
                <div class = 'input-wrap flex'>
                    <input placeholder = 'Confirm Password' class='type' type='password' id='registerPasswordConfirmation' bind:value={passwordConfirmation} required>
                    <ShowPassword inputFieldID='registerPasswordConfirmation'/>
                    <VisibleStatusOnInput  
                    on:updateVerificationStatus={event => validPasswordMatch = event.detail.isValid}
                    verificationFunction={() => {
                        return password === passwordConfirmation && validPassword;
                    }} 
                    />
                </div>
            </div>
        
            <!-- ----------SUBMIT BUTTON---------- -->
            <button type="submit" class="submit-button" disabled={!canSubmit}>Submit</button>
    
        </form>
    </div>

</div>

<style>

    .page-wrapper {
        background-image: linear-gradient(to right bottom, rgba(0, 38, 84, 0.3), rgba(255, 255, 255, 0.3), rgba(237, 41, 57, 0.3));
        color: #002654;
        font-family: 'Lato', sans-serif;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        height: 100%;
    }

    .header {
        width: 100%;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        /* padding: 0 0 2rem 0; */
        flex-grow: 2;
    }

    .response-message-wrapper {
        display: flex;
        justify-content: center;
        /* padding-bottom: 0.5rem; */
        /* flex-grow: 2; */
    }

    .response-message-container {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 40%;
        padding-bottom: 1rem;
    }

    .icon {
        padding-right: 1rem;
        font-size: 1.26rem;
    }

    .message {
        flex: 1;
    }

    .text {
        font-size: 2rem;
    }

    .flexContainer { 
        display: flex;
        justify-content: space-around;
        flex-direction: column;
        width: 40%;
    }

    .label {
        padding: 0 0 0.4rem 0;
        display: flex;
        font-size: 1rem;
    }

    .wrapper {
        padding: 1rem 0 3rem 0;
        display: flex;
        justify-content: center;
        flex-grow: 5;
    }
    
    .type {
        width: 100%;
        background-color: transparent;
        border: none;
        padding: 1.0625rem;
        font-size: 0.8rem;
        border-radius: 12px;
    }

    .type:focus {
        outline: none;
    }

    .input-wrap {
        border-bottom: 1px solid #002654;
    } 

    .input-container {
        padding: 0 0 1rem 0;
        transition: 0.5s ease-in-out;
    }

    .input-container:hover {
        transform: scale(1.08, 1.08);
    }

    .flex {
        display: flex;
        align-items: center;
    }

    /* BELOW HERE IS BUTTON */

    .submit-button:disabled {
        background-color: rgba(0, 38, 84, 0.6);
    }

    .submit-button:disabled {
        cursor: auto;
    }

    .submit-button {
        background-color: #002654;
        border-radius: 12px;
        color: white;
        padding: 0.9rem;
        margin: auto;
        margin-top: 2rem;
        width: 30%;
        min-width: 70px;
        font-family: 'Lato', sans-serif;
        transition: 0.2s ease-in-out;
    }   

    .submit-button:hover:enabled {
        cursor: pointer;
        color: white;
        background-color: green;
    }

    @media (max-height: 925px) {
        .response-message-wrapper {
            padding-top: 1.75rem;
        }
    }

    @media (max-width: 472px) {
        .response-message-container {
            flex-direction: column;
        }
        .icon {
            padding-bottom: 0.5rem;
        }
    }
    
</style>