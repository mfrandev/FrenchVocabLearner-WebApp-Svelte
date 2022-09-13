<script lang="ts">

    import { createEventDispatcher } from 'svelte';
    import zxcvbn from 'zxcvbn';
 
    export let password = '';
    export let validatorFunction: Function = (): boolean => {return true};

    //Used to notify MoreInfo component when an invalid chararcter is entered
    let dispatch = createEventDispatcher();

    //Prints the string
    let status = '';

    //Renders the color of the bar and text
    let color = 'inherit';

    let barColors = {
        weak: 'gray',
        moderate: 'gray',
        strong: 'gray'
    }

    $: validPassword = validatorFunction(password);

    //Reactivly determine the password's strength
    $: passwordStrength = evaluate(password);

    //Reactively render the password strength bar
    $: {      

        if(passwordStrength === -3) {
            status = "Invalid Password"
            color = 'red';
            barColors.weak = 'red';
            barColors.moderate = 'red';
            barColors.strong = 'red';

            //Dispatch an event here to the MoreInfo component to trigger a pulse effect
            dispatch('triggerPulse', {
                
            });

        }

        //If there is no password, make sure that state is enforced
        if(passwordStrength === -2) {
            status = "No Password"
            color = 'inherit';
            if(barColors.weak !== 'gray') barColors.weak = 'gray';
            if(barColors.moderate !== 'gray') barColors.moderate = 'gray';
            if(barColors.strong !== 'gray') barColors.strong = 'gray';
        } 

        //If there is a password but not enough characters, make sure that is enforced
        else if(passwordStrength === -1) {
            status = "Please Enter 8 Symbols"
            color = 'inherit';
            if(barColors.weak !== 'gray') barColors.weak = 'gray';
            if(barColors.moderate !== 'gray') barColors.moderate = 'gray';
            if(barColors.strong !== 'gray') barColors.strong = 'gray';
        }

        //Render a weak password
        else if(passwordStrength === 0) {
            status = "Estimated Password Strength: Weak"
            color = 'red';
            if(barColors.weak !== 'red') barColors.weak = 'red';
            if(barColors.moderate !== 'gray') barColors.moderate = 'gray';
            if(barColors.strong !== 'gray') barColors.strong = 'gray';
        } 

        //Render a moderate password
        else if(passwordStrength ===  1) {
            status = "Estimated Password Strength: Moderate"
            color = 'orange';
            if(barColors.weak !== 'red') barColors.weak = 'red';
            if(barColors.moderate !== 'orange') barColors.moderate = 'orange';
            if(barColors.strong !== 'gray') barColors.strong = 'gray';
        } 

        //Render a strong password
        else if(passwordStrength === 2) {
            status = "Estimated Password Strength: Strong"
            barColors.strong = 'green';
            if(barColors.moderate !== 'orange') barColors.moderate = 'orange';
            if(barColors.weak !== 'red') barColors.weak = 'red';
            color = 'green'
        }
    }

    //Simple evaluate function for testing
    const evaluate = (password: string): number => {
        if(password.length === 0) {
            return -2
        }
        if(!validPassword) {
            return -3
        }
        else if(password.length > 0 && password.length < 8) {
            return -1;
        }
        let temp = zxcvbn(password);
        // console.log(temp);
        let score = temp.score;
        if(score <= 2) {
            return 0;
        }
        else if(score === 3) {
            return 1;
        }
        else if(score === 4) {
            return 2;
        }
        else {
            return -3
        }
    }

</script>

<!-- Media query for width of 1025 pixels to place status text below the bar -->

<div class = "password-strength-wrapper">
    <div class="progress-bar-wrapper">
        <div id="weak-bar" class="bar-settings" style="background-color: {barColors.weak}; transition: 0.3s ease-in-out;"/>
        <div id="moderate-bar" class="bar-settings" style="background-color: {barColors.moderate}; transition: 0.3s ease-in-out;"/>
        <div id="strong-bar" class="bar-settings" style="background-color: {barColors.strong}; transition: 0.3s ease-in-out;"/>
    </div>
    <div class="progress-bar-text">
        <span class="password-message" style="color: {color}; transition: all 0.3s ease-in-out;" data-label='{status}'></span>
    </div>

</div>

<style>

    .password-strength-wrapper {
        padding-top: 0.3125rem;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        /* For media query at width 1025, use the following */
        /* flex-direction: column; 
        align-items:flex-start; */
       
    }

    .progress-bar-wrapper {
        display: flex;
    }

    .bar-settings {
        height: 0.3125rem;
        width: 3.9rem;
        border-radius: 12px;
    }

    .progress-bar-text {
        flex: 1;
    }

    .password-message {
        padding: 0.825rem;
        /* For media query at width 1025, use the following */
        /* padding: 0; */
    }

    .password-message::before {
        content: attr(data-label);
    }

    @media (max-width: 1025px) {
        .password-message {
            padding: 0;
        }

        .progress-bar-text {
            padding-top: 0.3125rem;
        }

        .password-strength-wrapper {
            flex-direction: column; 
            align-items:flex-start;
        }

        .progress-bar-wrapper {
            padding-top: 0.0625rem;
        }

    }

    @media (max-width: 470px) {
        .progress-bar-wrapper {
            display: none;
        }
    }

</style>