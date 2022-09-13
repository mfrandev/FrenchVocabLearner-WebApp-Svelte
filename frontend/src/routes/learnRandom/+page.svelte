<script lang='ts'>
    // throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");
    /** @type {import('./$types').PageData */
    export let data: any;

    import Header from '../../components/Header.svelte';
    import DefinitionComponent from '../../components/DefinitionComponent.svelte';
    import LearnConfirmInput from '../../components/LearnConfirmInput.svelte';
    import { fade, fly } from 'svelte/transition';
    import { goto } from '$app/navigation';
    
    let count = 0;

    let numLearned = 0;

    let confirmValue = '';

    //Cycle up which word is displayed on the screen
    const countUp = () => {
        count < data.dataOld.length - 1 ? count++ : count;
        confirmValue = '';
    }

    //Cycle down which word is displayed on the screen
    const countDown = () => {
        count > 0 ? count-- : count;
        confirmValue = '';
    }

    //Take an all lower case word and capitalize the first letter
    const capitalizeFirst = (word: string) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
    
    //State of whether the user is viewing the leave page menu
    let submitScreenOn = false;
    let background = "opacity: 1";
    $: disabled = submitScreenOn ? "disabled" : "";

    //Turn the submit screen on 
    const toggleSubmitScreenOn = () => {
        submitScreenOn = true;
        background = "opacity: 0.3";
    }

    //Turn the submit screen off
    const toggleSubmitScreenOff = () => {
        submitScreenOn = false;
        background = "opacity: 1";
        destination = '/learnHub';
        destinationDescription = 'Learning Hub';
    }

    //Don't let the user tab through the header or other input fields
    const limitActivityWhenDisabled = (e: any) => { 
        if(submitScreenOn) {
            e.preventDefault();
        }
    }

    //Endpoint for the pressed button (changes from header events)
    let destination: string = '/learnHub';

    //Description of the endpoint
    let destinationDescription: string = 'Learning Hub';

    //Function that logs out the user when called, definition overwritten from header event
    let logoutFunc: Function = () => {};

    //Function called to register the words the user has learned before leaving the page
    const leavePage = async () => {

        //If the user has learned at least one word, register the words in the DB
        if(numLearned > 0) {
            await fetch(`http://localhost:3001/api/v1/learnMore/learnMultipleWords`, {
                method: 'POST',

                //Add the words learned in the post body
                body: JSON.stringify({WordsLearned: data.learnedWordsID}),
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': data.csrfToken
                },
                credentials: 'include'
            });
        }

        //If not logging out, go to the next page and don't let the user go back to the current page
        if(destination !== 'logout') {
            // console.log('here');
            await goto(destination, { replaceState: true });
        }

        //Logout
        else if(destination === 'logout') {
            logoutFunc();
        }
    }

</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Learning Hub</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@1,700&display=swap" rel="stylesheet">
</svelte:head>

<div class="page-wrapper">

    <div class='viewer-wrapper {disabled}' style="transition: 0.2s ease-in-out; {background}" on:keydown="{limitActivityWhenDisabled}">

        <!-- Header with implementations for events to customize events when clicking on links -->
        <Header headerVisible={true} position={'relative'} padding={'1.7rem 0 1rem 0'} 
        hyperlinkOverwrite={true} overwriteAction={toggleSubmitScreenOn} on:overwittenLink={(e) => {
            destination = e.detail.link;
            destinationDescription = e.detail.destinationDescription;
        }} on:logout={(e) => {
            destination = 'logout';
            destinationDescription = e.detail.destinationDescription;
            logoutFunc = e.detail.logoutFunc;
        }}/>

        <!-- {learnedWordsID} -->

        {#if !data.dataOld.message}

            <!-- Display which word/total the user is viewing -->
            <p style="text-align: center;">
                {count + 1}/{data.dataOld.length}
            </p>

            <!-- Showing the word and part of speech -->
            {#key count}
                <h2 style="text-align: center;" in:fade={{duration: 500}}>
                    <span style="text-decoration: underline;">{capitalizeFirst(data.dataOld[count].word.WordName)}</span>: {data.dataOld[count].category.CategoryName}
                </h2>
            {/key}
        {:else}
            <p>{JSON.stringify(data.dataOld)}</p>
        {/if}

        <!-- Show the definitions of the selected word -->
        {#key count}
            <div class="definition-container" in:fade={{duration: 500}}>
                {#if !data.dataOld.message}
                    <DefinitionComponent name={data.dataOld[count].word.WordName} definitions={data.dataOld[count].definitions}/>
                {/if}
            </div>

            <!-- Render the input field for the user to learn words and provide implementations to learn/unlearn words -->
            <LearnConfirmInput word={data.dataOld[count].word.WordName} registered={data.learnedWords[count]}
            on:register={() => {
                data.learnedWords[count] = true; 
                numLearned++; 
                data.learnedWordsID[count] = data.dataOld[count].word.WordID;
            }} 
            on:unregister={() => {
                data.learnedWords[count] = false; 
                numLearned--; 
                data.learnedWordsID[count] = -1
            }}
            bind:value={confirmValue}/>
        {/key}

        <!-- Toggle buttons to navigate which word is displayed -->
        <div class='toggle-wrapper width-80'>

            <!-- Arrow to count down (always displayed) -->
            <div on:click={countDown} class='back toggle'>
                <i class="fa-solid fa-arrow-left button-font"></i>
            </div>

            <!-- Arrow to count up (on display except for nth/n word) -->
            {#if count + 1 < data.dataOld.length}
            <div on:click={countUp} class='next-finish toggle'>
                <i class="fa-solid fa-arrow-right button-font"></i>
            </div>

            <!-- Submit button to register learned words (on display only for nth/n word) -->
            {:else}
            <div class='next-finish toggle' on:click={toggleSubmitScreenOn}>Finish</div>
            {/if}
        </div>

    </div>

    <!-- Renders only if the user is about to navigate out of the page -->
    {#if submitScreenOn}
        <div class='submit-wrapper' in:fly={{y: -250, duration: 500}} out:fly|local={{y: -250, duration: 500}}>
            <div class="submit-body">

                <!-- {#if numLearned < dataOld.length} -->
                    <div style='width: 90%; text-align: center;'>

                        <!-- Number of words you've learned -->
                        <span style="color: red;">You've learned {numLearned}/{data.dataOld.length} words.</span>  

                        <!-- Message prompting user action -->
                        {#if numLearned === 0}
                            <div style="padding-top: 5px;">Would you like to exit?</div>
                        {:else if numLearned < data.dataOld.length}
                            <div style="padding-top: 5px;">
                                Would you like to finish your session and register the words you've already learned?
                            </div>
                        {:else}
                            <div style="padding-top: 5px;">
                                Would you like to finish your session and register the words?
                            </div>
                        {/if}

                        <!-- Tell the user which endpoint they will go to after leaving the current page -->
                        <div style="padding-top: 5px;">
                            Destination: {destinationDescription}
                        </div>
                    </div>
                <!-- {/if} -->

                <div class='toggle-wrapper width-100'>

                    <!-- Go back to the learning screen -->
                    <div class='back toggle' on:click={toggleSubmitScreenOff}>
                        Back
                    </div>

                    <!-- Leave the learning page -->
                    <div class='next-finish toggle' on:click={leavePage}>
                        {#if numLearned > 0}
                            Finish
                        {:else}
                            Exit
                        {/if}
                    </div>
                </div>
            </div>
        </div>

    {/if}

</div>

<style>

.page-wrapper {
    height: 100%;
    width: 100%;
    font-family: 'Lato', sans-serif;
    min-height: 100vh;
    background-color: #faf9f6;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-image: linear-gradient(to right, rgba(0, 38, 84, 0.3), rgba(255, 255, 255, 0.3), rgba(237, 41, 57, 0.3));
}

.viewer-wrapper { 
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 100%;
    min-height: 100vh;
}

.disabled {
    pointer-events: none;
    user-select: none;
}

.submit-wrapper {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}

.submit-body {
    border: 1px solid black;
    border-radius: 12px;
    /* background-color: black; */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 50%;
    width: 50%;
    background-color: #faf9f6;
}

.definition-container { 
    width: 80%;
}

.toggle-wrapper {
    padding-top: 2.5rem;
    display: flex;
    justify-content: center;
}

.at-bottom {
    align-items: flex-end;
}

.width-80 {
    width: 80%;
}

.width-100 {
    width: 100%;
}

.toggle {
    width: 75px;
    text-align: center;
    border: 1px solid grey;
    padding: 8px;
    border-radius: 12px;
    cursor: pointer;
    user-select: none;
    transition: 0.25s ease-in-out;
    background-color: #faf9f6;
    font-size: 1rem;
}

.toggle:hover {
    transform: scale(1.035);
}

.back {
    /* padding: 0 1rem 0 0; */
    margin-right: 1rem;
}

.next-finish {
    /* padding: 0 0 0 1rem; */
    margin-left: 1rem;
}

</style>