<script lang='ts'>

    import { createEventDispatcher } from 'svelte';

    //String binded to input field
    let inputValue: string = '';

    //String input slightly lagging behind user input to delay actions until user stops typing
    let inputToSearch: string = '';

    //Save the current timeout 
    let keypressTimeout: NodeJS.Timeout;

    $: {
        if(inputToSearch.length < 2) {
           
        }
    }

    //Function that gets entries when use stops typing
    const keyfunction = (e: any) => {
        if(e.key !== 'Enter') {
            clearTimeout(keypressTimeout);
            keypressTimeout = setTimeout(async () => {
                inputToSearch = inputValue;
            }, 225);
        }
    }

    //When the user stops typing, dynamically dispatch this event with the newly updated values
    $: {
        dispatch('regexFilter', {
            filter: inputToSearch,
            knowledgeLevel: selectValue
        })
    }

    //Pass the knowledge levels which the user has learned
    export let knowledgeLevels: any[];

    //Knowledge level selected
    let select: any = 'Knowledge Level: any';

    //Parsed value selected
    $: selectValue = select.substring(17);

    let dispatch = createEventDispatcher();

    // Dispatch when knowledge level filter changes
    $: {
        dispatch('knowledgeLevelFilterChange', {
            filter: inputToSearch,
            knowledgeLevel: selectValue
        });
    }

</script>

<!-- Filter bar in /progress -->

<div class='bar-wrapper'>
    <div class='input-bar-wrap'>
        <form autocomplete='off' class="input-bar" on:submit={e => e.preventDefault()} id='search'>

            <!-- Display which knowledge levels the user has seen -->
            <select class='select' bind:value={select}>
                {#each knowledgeLevels as level}
                    <option>Knowledge Level: {level}</option>
                {/each}
            </select>

            <!-- Input for user to filter which learned words are displayed -->
            <input id="input" class="input-bar-search" bind:value={inputValue} on:keyup="{keyfunction}">
            <!-- <input on:focus="{toggleShowSuggestionsOn}" id="input" class="input-bar-search" bind:value={inputValue}> -->
        </form>
    </div>
</div>

<style>

    .bar-wrapper {
        margin-top: 1rem;
        /* height: 100px; */
        /* width: 20%; */
        /* background-color: aqua; */
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .input-bar {
        width: 100%;
        display: flex;
        align-items: center;

    }

    .input-bar-wrap {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 40%;
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

    .select {
        background-color: #faf9f6;
        background: #faf9f6;
        border: none;
        outline: none;
        font-size: 1rem;
        text-align: center;
        margin-right: 8px;
        /* border-color: black; */
    }

    .select:hover {
        cursor: pointer;
    }

</style>
