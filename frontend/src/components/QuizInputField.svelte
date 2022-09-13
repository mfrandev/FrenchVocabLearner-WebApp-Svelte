<script lang='ts'>

    import SubmitIconOnInput from './SubmitIconOnInput.svelte';
    import { createEventDispatcher } from 'svelte';
    import VisibleStatusOnInput from './VisibleStatusOnInput.svelte';
    import { fade } from 'svelte/transition';
     
    let dispatch = createEventDispatcher();
    
    const onDispatch = (e: any) => {
        e.preventDefault();
        if(wordIsCorrect) {
            dispatch('correct', {
                word: value.toLowerCase()
            });
        } else {
            dispatch('incorrect', {
                word: value.toLowerCase()
            });
        }
    }
    
    export let word: string;

    //This will be 0 if no attempt made, 1 for correct, -1 for incorrect
    export let userInputCorrectness: number;
    
    export let value = '';

    export let choiseEntered: any;
    
    $: wordIsCorrect = value.toLowerCase() === word;
    
</script>

<div class='input-wrapper-outside'>
    <label for="learn-word-input" in:fade={{duration: 500}}>
        {#if userInputCorrectness === 0}
            What Word Posesses The Above Definitions?
        {:else if userInputCorrectness === 1}
            <span style:color='green'>{word}</span> Is Correct!
        {:else if userInputCorrectness === -1}
            The Correct Answer Is <span style:color="green">{word}</span>, You Entered <span style:color='red'>{choiseEntered.toLowerCase()}</span>
        {/if}
    </label>
    <form class="input-wrapper-inside" on:submit="{onDispatch}">
        <SubmitIconOnInput disabled={value.length < 1} />
        <input placeholder={userInputCorrectness === 0 ? '' : choiseEntered} name="learn-word-input" class="input" autocomplete="off" bind:value disabled={userInputCorrectness !== 0}>
        {#if userInputCorrectness !== 0}
            <VisibleStatusOnInput padding={'0 3px 0 8px'} verificationFunction={() => {
                if(userInputCorrectness === 1) return true;
                return false;
            }}/>
        {/if}
    </form>
</div>

<style>

    .input-wrapper-outside {
        width: 80%;
        margin-top: 3rem;
    }
    
    .input-wrapper-inside {
        display: flex;
        background-color: #faf9f6;
        border-radius: 12px;
        padding: 12px 8px;
        width: 20%;
        margin-top: 1rem;
    }
    
    .input {
        border: none;
        width: 100%;
        font-size: 1rem;
        background-color: #faf9f6;
    }
    
    .input:focus {
        outline: none;
    }
    
    </style>