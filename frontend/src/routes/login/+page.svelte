<script lang='ts'>
    // throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");
    /** @type {import('./$types').PageData */
    export let data: any;

    import { goto } from '$app/navigation';

    /**
     * Setup the form variables
     */
    let authenticator = '';
    let password = '';

    let json: any = {};

    let color: string;

    //Dynamically color the success message based on request status
    $: {
        if('code' in json) {
            color = json.code === 200 ? 'green' : 'red';
        }
    }

    //Determines if password field is disabled or not
    $: canSubmit = (authenticator.length > 4 && password.length > 7 && password.length < 26);
    
    /**
     * Post the user data to the server for signup
     * @param e
     */
    async function onSubmit(e: any) {

        //If signup failed, prevent default, and show error message
        e.preventDefault();

        //This returns the response itself
        const response = await fetch('http://localhost:3001/api/auth/authenticateLogin', {
            method: 'POST',
            body: JSON.stringify({
                authenticator: authenticator,
                password: password,
            }),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': data.csrfToken
            },
            credentials: 'include'
        });

        // console.log('submitted ' + data.csrfToken);
        
        json = await response.json();

        // console.log(json);
        // console.log(response);

        if(json.code === 200) {
            // setTimeout(() => {
            goto('/home', { replaceState: true });
            // }, 2000);
        }
        
    }

    import { fly, fade } from 'svelte/transition';
    import Header from '../../components/Header.svelte';
    import ShowPassword from '../../components/ShowPassword.svelte';

</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create An Account</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@1,700&display=swap" rel="stylesheet">
</svelte:head>

<div class='page-wrapper'>

    <!-- Page Header Component -->
    <Header headerVisible={true} position={'relative'} padding={'1.7rem 0 1rem 0'} />

    <!-- This is the prompt telling the user this page is for creating an account -->
    <div class="header" in:fly={{x:-50, duration: 1500}}>
        <div class="text">
            Login To Your Account
        </div>
    </div>

    <!-- This IF block is used to display any error messages in the account creation process -->
    {#if json !== undefined && 'message' in json}
        <div class='response-message-wrapper' in:fade={{duration: 300}}>
            <div class='response-message-container' style='color: {color}; border-bottom: 1px solid {color};'>
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

            <!-- ----------E-MAIL/USERNAME FIELD---------- -->
            <div class='input-container'>
                <div class="label">
                    <label for='authenticator' class='label'>E-Mail or Username</label>
                </div>
                <div class = 'input-wrap flex'>
                    <input placeholder='E-Mail Address or Username' class='type' type='text' id='authenticator' bind:value={authenticator} required>
                </div>
            </div>

            <!-- ----------PASSWORD FIELD---------- -->
            <div class='input-container'>
                <div class="label">
                    <label for='registerPasswordConfirmation'>Password</label>
                </div>
                <div class = 'input-wrap flex'>
                    <input placeholder = 'Password' class='type' type='password' id='password' bind:value={password} required>
                    <ShowPassword inputFieldID='password' paddingRightLeft={'1rem'} />
                </div>
            </div>
        
            <!-- ----------SUBMIT BUTTON---------- -->
            <button type="submit" class="submit-button" disabled={!canSubmit}>Login</button>
    
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
        align-items: center;
        text-align: center;
        justify-content: center;
        flex-grow: 2;
    }

    .response-message-wrapper {
        display: flex;
        justify-content: center;
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

    @media (max-height: 850px) {
        .response-message-wrapper {
            padding-top: 1.75rem;
        }
    }

</style>