<script lang='ts'>
    // throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");
    /** @type {import('./$types').PageData */
    export let data: any;

    import Header from '../../components/Header.svelte';
    import DefinitionComponent from '../../components/DefinitionComponent.svelte';
    import QuizInputField from '../../components/QuizInputField.svelte';
    import QuizResultsDisplay from '../../components/QuizResultsDisplay.svelte';
    import { fade, fly } from 'svelte/transition';
    import { goto } from '$app/navigation';
    
    let count = 0;
    $: numLearned = numCorrect + numIncorrect;

    let numCorrect = 0;
    let numIncorrect = 0;

    //View the next word of the quiz
    const countUp = () => {
        // if(!submitScreenOn) {
            count < data.dataOld.length - 1 ? count++ : count;
        // }
    }

    //View the previous word of the quiz
    const countDown = () => {
        // if(!submitScreenOn) {
            count > 0 ? count-- : count;
        // }
    }
    
    //Status of the pre-submission screen
    let submitScreenOn = false;
    let background = "opacity: 1";
    $: disabled = submitScreenOn ? "disabled" : "";

    //Turn on the pre-submission screen
    const toggleSubmitScreenOn = () => {
        submitScreenOn = true;
        background = "opacity: 0.3";
    }

    //Turn off the pre-submission screen
    const toggleSubmitScreenOff = () => {
        submitScreenOn = false;
        background = "opacity: 1";
        destination = '/quizHub';
        destinationDescription = 'Quiz Hub';
    }

    //Do not let the user interact with elements on the underlying page when the pre-submission screen
    const limitActivityWhenDisabled = (e: any) => { 
        if(submitScreenOn) {
            e.preventDefault();
        }
    }

    //Endpoint for the user's next destination
    let destination: string = '/quizHub';

    //Description of the next endpoint after the quiz page
    let destinationDescription: string = 'Quiz Hub';

    //Logout function that will be overwritten if used
    let logoutFunc: Function = () => {};

    //Leave the page to the dynamically defined destination
    const leavePage = async () => {

        //Go to new endpoint
        if(destination !== 'logout') {
            // console.log('here');
            await goto(destination, { replaceState: true });
        }

        //Logout
        else if(destination === 'logout') {
            logoutFunc();
        }
    }

    let json: any;

    //Update the knowledge level for the user and a word in the database
    const updateKnowledgeLevel = async (wasCorrect: boolean, previousKnowledgeLevel: string, wordIDToAlter: number) => {
        const response = await fetch('http://localhost:3001/api/v1/learnMore/updateKnowledgeLevelWithWordID', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': data.csrfToken
                },
            credentials: 'include',

            //Put whether the word was correct, the previous knowledge level, and the ID of the word to change in request body
            body: JSON.stringify({
                correctlyAnswered: wasCorrect,
                previousKnowledgeLevel: previousKnowledgeLevel,
                wordIDToAlter: wordIDToAlter
            })
        });
        json = await response.json();
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

        <!-- Overwrite the header to define custom behaviour upon pressing one of the links -->
        <Header headerVisible={true} position={'relative'} padding={'1.7rem 0 1rem 0'} 
        hyperlinkOverwrite={true} overwriteAction={toggleSubmitScreenOn} on:overwittenLink={(e) => {
            destination = e.detail.link;
            destinationDescription = e.detail.destinationDescription;
        }} on:logout={(e) => {
            destination = 'logout';
            destinationDescription = e.detail.destinationDescription;
            logoutFunc = e.detail.logoutFunc;
        }}/>
        
        <!-- {JSON.stringify(json)} -->

        {#if !data.dataOld.message}
        
            <!-- Display which word of the quiz the user is viewing -->
            <p style="text-align: center;">
                {count + 1}/{data.dataOld.length}
            </p>
        {#key count}

            <!-- Display the question marks representing the word and the word's part of speech -->
            <h2 style="text-align: center;" in:fade={{duration: 500}}>
                <span style="text-decoration: underline;">???</span>: {data.dataOld[count].category.CategoryName}
            </h2>
        {/key}
        {:else}
            <p>{JSON.stringify(data.dataOld)}</p>
        {/if}

        {#key count}
            <div class="definition-container" in:fade={{duration: 500}}>

                <!-- Display the definitions of the word the user should know -->
                {#if !data.dataOld.message}
                    <DefinitionComponent name={'???'} definitions={data.dataOld[count].definitions}/>
                {/if}
            </div>

            <!-- Place an input field for the user to enter the word described by the definitions and define behaviours for success and failure -->
            <QuizInputField word={data.dataOld[count].word.WordName} userInputCorrectness={data.knowledgeLevelDisplacementMap[count]}

            choiseEntered={data.choisesSubmitted[count]}

            
            on:correct={(e) => {
                data.knowledgeLevelDisplacementMap[count] = 1;
                data.choisesSubmitted[count] = e.detail.word;
                updateKnowledgeLevel(true, data.dataOld[count].knowledgeLevel, data.dataOld[count].word.WordID);
                numCorrect = numCorrect + 1;
            }}

            on:incorrect={(e) => {
                data.knowledgeLevelDisplacementMap[count] = -1;
                data.choisesSubmitted[count] = e.detail.word;
                updateKnowledgeLevel(false, data.dataOld[count].knowledgeLevel, data.dataOld[count].word.WordID);
                numIncorrect = numIncorrect + 1;
            }} />

        {/key}

        <!-- Buttons for user to nagivate through quiz -->
        <div class='toggle-wrapper width-80'>

            <!-- Count down -->
            <div on:click={countDown} class='back toggle'>
                <i class="fa-solid fa-arrow-left button-font"></i>
            </div>
            {#if count + 1 < data.dataOld.length}

                <!-- Count up -->
                <div on:click={countUp} class='next-finish toggle'>
                    <i class="fa-solid fa-arrow-right button-font"></i>
                </div>
            {:else}

                <!-- Acknowledge user is down with the quiz -->
                <div class='next-finish toggle' on:click={toggleSubmitScreenOn}>Finish</div>
            {/if}
        </div>

    </div>

    <!-- Pre-departure menu (same as learnRandom, see learnRandom:189 for comments) -->
    {#if submitScreenOn}
        <div class='summary-wrapper' in:fly={{y: -250, duration: 500}} out:fly|local={{y: -250, duration: 500}}>
            <div class="summary-body" style:width={numLearned === 0 ? '50%' : '60%'}
            style:height={numLearned === 0 ? '50%' : '80%'}>

                <!-- {#if numLearned < dataOld.length} -->
                    <div style='width: 90%; text-align: center;'>
                        <span style="color: red;">You've attempted {numLearned}/{data.dataOld.length} words.</span>  
                        {#if numLearned === 0}
                            <div style="padding-top: 5px;">Would you like to exit?</div>
                        {:else}

                            <QuizResultsDisplay data={data.dataOld} knowledgeLevelDisplacementMap={data.knowledgeLevelDisplacementMap} />

                            <div style="padding-top: 5px;">
                                Would you like to exit the quiz? (All progress described above has been saved)
                            </div>
                        {/if}
                        <div style="padding-top: 5px;">
                            Destination: {destinationDescription}
                        </div>
                    </div>
                <!-- {/if} -->

                <div class='toggle-wrapper width-100' style="{numCorrect + numIncorrect === 0 ? 'padding-top: 2.5rem;' : 'padding-top: 2.5rem;'}">
                    <div class='back toggle' on:click={toggleSubmitScreenOff}>
                        Back
                    </div>
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

    .summary-wrapper {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    }

    .summary-body {
        border: 1px solid black;
        border-radius: 12px;
        /* background-color: black; */
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: #faf9f6;
    }

    .definition-container { 
        width: 80%;
    }

    .toggle-wrapper {
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