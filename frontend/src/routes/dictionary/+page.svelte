<script lang='ts'>
    // throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");
    /** @type {import('./$types').PageData */
    export let data: any;

    import Header from '../../components/Header.svelte';
    import SearchIcon from '../../components/SearchIcon.svelte';
    import DeleteInput from '../../components/DeleteInput.svelte';
    import { fade, fly } from 'svelte/transition';

    //Binded to the value in the input field
    let inputValue: string = '';

    //Equal to the value of the input field after the timeout executes
    let inputToSearch: string = '';

    //Used to store data for the input bar suggestions
    let json: any = [];

    //Store the timeout
    let keypressTimeout: NodeJS.Timeout;

    //If the user has less than 2 characters in the input bar, clear the suggestions
    $: {
        if(inputToSearch.length < 2) {
            json = [];
        }
    }

    //This is used to only let the user learn a word if the characters typed equal the word searched
    $: enabled = inputToSearch !== inputValue.toLowerCase();

    /**
     * Function that gets entries when user stops typing
     */
    const keyfunction = (e: any) => {

        //Enter should be escaped because it is for searching
        if(e.key !== 'Enter') {

            //Erase the previous timeout and replace it with a new one
            clearTimeout(keypressTimeout);
            keypressTimeout = setTimeout(async () => {

                //Get rid of case sensitivity
                inputToSearch = inputValue.toLowerCase();

                //If there are two or more characers in the search bar
                if(inputValue.length >= 2) {

                    //Get the suggestions
                    const response = await fetch(`http://localhost:3001/api/v1/learnMore/getWordsFromRegex?regex=${inputToSearch}`, {
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'CSRF-Token': data.csrfToken
                        }
                    });

                    //Save the result of the AJAX call and show them on the screen
                    json = await response.json();
                    showSuggestions = true;
                }
            }, 225);
        }
    }

    //Stores the word the user searched
    let word: any = undefined;

    //State variable determining if suggestions based on input should be visible
    let showSuggestions = false;

    /**
     * Get the word that the user has searched for in the search bar for the user to see
     * @param e
     */
    const getWordBySearchBar = async (e: any) => {

        //Do not refresh the page
        e.preventDefault();
        console.log('fetching ' + inputToSearch);

        //clear the list of suggested words
        json = [];

        //Get the word the user wants to find
        const response = await fetch(`http://localhost:3001/api/v1/learnMore/getWord?word=${inputValue.toLowerCase()}`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': data.csrfToken
            }
        });

        //Get the word, display it, and get rid of the suggestions for the search bar
        const jsonResponse = await response.json();
        word = jsonResponse;
        showSuggestions = false;
    }
    
    import WordViewerDictionary from '../../components/WordViewerDictionary.svelte';

</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dictionary Search</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@1,700&display=swap" rel="stylesheet">
</svelte:head>

<div class="page-wrapper">

    <Header headerVisible={true} position={'relative'}/>

    <div class='grid'>

        <!-- This block level contains the title of the page, the search bar, and the search suggestions -->
        <div class="title-search-wrapper" in:fly={{x: -50, duration: 2000}}>

            <!-- Page title -->
            <div class='description'>
                <h1 class='title'>Dictionary</h1>
                <h4 class='details'>Use the search bar below to find specific words and have the option to learn them</h4>
            </div>
        
            <!-- Search Bar -->
            <div class="center-input">
                <div class="input-bar-wrap">
                    <!-- <div class="input-bar"> -->
                        <form autocomplete='off' class="input-bar" on:submit='{getWordBySearchBar}' id='search'>
                            <!-- <SearchIcon disabled='{false}'/> -->
                            <SearchIcon disabled='{inputToSearch.length > 1 ? enabled : true}' />
                            <input id="input" class="input-bar-search" bind:value={inputValue} on:keyup="{keyfunction}">
                            <!-- <input on:focus="{toggleShowSuggestionsOn}" id="input" class="input-bar-search" bind:value={inputValue}> -->
                            <DeleteInput on:deleteInput='{() => {
                                inputValue = '';
                                inputToSearch = '';
                            }}'/>
                        </form>
                    <!-- </div> -->
                    <div class="recommended">
                        {#await json then words}
                            {#if showSuggestions}
                                {#each words as word}
                                    <button on:click='{() => {
                                        inputValue = word.word.WordName;
                                        inputToSearch = word.word.WordName;
                                    }}' form='search' in:fade={{duration: 300}} out:fade|local={{duration:300}} class="suggest">{word.word.WordName}</button>
                                {/each}
                            {/if}
                        {/await}
                    </div>
                </div> 
            </div>
        
            <!-- Search bar is position absolute, create div in flow of the document in the same place of the search bar -->
            <div class="center-input input-bar-placeholder"/>
        
            <!-- End Search Bar -->
        </div>

        <!-- Placeholder -->
        <div style="height: 3.5rem;"/>

        <!-- Used to view the word, its part of speech, definition, and learning input bar -->
        <div class="learn-interface" in:fly={{x: 50, duration: 2000}}>
        {#if word !== undefined}
            {#key word}
                <div class="word-viewer-wrapper" in:fade={{duration: 500}}>
                    <WordViewerDictionary word={word} csrfToken={data.csrfToken} wordLearnedID={word.word.WordID} wordLearned={word.word.WordName}/>
                </div>
            {/key}
        {:else}
            <h2 class="instruction-message">Select a word using the search bar above to see details</h2>
        {/if}
        </div>

        <!-- {JSON.stringify(word)} -->

    </div>
</div>

<style>

    .page-wrapper {
        height: 100%;
        width: 100%;
        min-height: 100vh;
        background-color: #faf9f6;
        font-family: 'Lato', sans-serif;
        /* background-image: linear-gradient(to right bottom, rgba(0, 38, 84, 0.3), rgba(255, 255, 255, 0.3), rgba(237, 41, 57, 0.3)); */
    }

    .grid {
        display: grid;
    }

    .title-search-wrapper {
        /* background-color: beige; */
        background-image: linear-gradient(to right, rgba(0, 38, 84, 0.15), rgba(255, 255, 255, 0.15), rgba(237, 41, 57, 0.15));
        width: 70%;
        margin: auto;
        padding: 1.2rem 0 4rem 0;
        border-radius: 12px;
    }

    .description {
        color: #002654;
        padding: 0 0 1rem 0;
    }

    .title {
        text-align: center;
    }

    .details {
        text-align: center;
        padding: 0 1rem;
    }

    .center-input {
        display: flex;
        margin: auto;
        justify-content: center;
        position: relative;
    }

    .input-bar {
        width: 100%;
        display: flex;
        align-items: center;
    }

    .input-bar-placeholder {
        height: 44px;
        z-index: -100;
    }

    .input-bar-wrap {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 50%;
        padding: 8px;
        background-color: #faf9f6;
        border-radius: 12px;
    }

    .input-bar-search {
        width: 100%;
        border: none;
        padding: 5px 0px;
        font-size: 1rem;
        background-color: #faf9f6;
    }

    .input-bar-search:focus {
        outline: none;
    }

    .recommended {
        /* position: absolute; */
        top: 100%;
        display: grid;
        align-content: center;
        padding: 0px 2px;
        background-color: #faf9f6;
        width: 100%;
    }

    .suggest {
        width: 100%;
        border: none;
        background-color: transparent;
        text-align: start;
        font-size: 0.9rem;
        padding: 8px 0;
    }

    .suggest:hover { 
        text-decoration: underline;
        cursor: pointer;
    }
    
    .word-viewer-wrapper {
        /* display: flex; */
        /* justify-content: center; */
        width: 95%;
        margin: auto;
        color: #002654;
    }

    .learn-interface {
        width: 85%;
        margin: auto;
        min-height: 8rem;
        border-radius: 12px;
        padding: 1rem 0;
        margin-bottom: 2.5rem;
        background-image: linear-gradient(to right, rgba(0, 38, 84, 0.15), rgba(255, 255, 255, 0.15), rgba(237, 41, 57, 0.15));
    }

    .instruction-message {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 14rem;
        color: #002654;
        font-size: 1rem;
    }

</style>