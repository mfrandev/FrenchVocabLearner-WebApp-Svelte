<script lang='ts'>

import SubmitIconOnInput from './SubmitIconOnInput.svelte';
import { createEventDispatcher } from 'svelte';
import VisibleStatusOnInput from './VisibleStatusOnInput.svelte';
import { fade } from 'svelte/transition';
 
let dispatch = createEventDispatcher();

const onDispatch = (e: any) => {
    e.preventDefault();
    if(registered) {
        dispatch('unregister');
    } else {
        dispatch('register');
    }
}

export let word: string;
export let registered: boolean;

export let value = '';

$: wordIsLearned = value.toLowerCase() !== word;

</script>

<div class='input-wrapper-outside'>
    <label for="learn-word-input" in:fade={{duration: 500}}>Enter {word} and click the arrow to {registered ? 'un-register' : 'register'} this word</label>
    <form class="input-wrapper-inside" on:submit="{onDispatch}">
        <SubmitIconOnInput disabled={wordIsLearned} />
        <input name="learn-word-input" class="input" autocomplete="off" bind:value>
        <VisibleStatusOnInput padding={'0 3px 0 8px'} verificationFunction={() => {return registered}}/>
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