
<script lang='ts'>

    import SubmitIconOnInput from './SubmitIconOnInput.svelte';
    import DefinitionScroller from './DefinitionComponent.svelte';

    export let word: any;
    export let csrfToken: string;
    export let wordLearnedID: number;
    export let wordLearned: string;

    const capitalizeFirst = (word: string) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    let learnWordForm = '';

    let json: any;

    let color: string;

    $: {
        if(json !== undefined && json.code === 500) {
            color = 'red';
        } else if(json !== undefined && json.code === 200) {
            color = 'green';
        }
    }

    $: wordIsLearned = learnWordForm.toLowerCase() !== word.word.WordName;

    const submitWordLearned = async (e: any) => {
        e.preventDefault();
        console.log('hi');
        const response = await fetch('http://localhost:3001/api/v1/learnMore/learnWord', {
            method: 'POST',
            body: JSON.stringify({
                wordLearnedID: wordLearnedID,
                wordName: wordLearned
            }),
            headers: {
                'Content-Type': 'application/json',
                'CSRF-Token': csrfToken
            },
            credentials: 'include'
        });
        json = await response.json();
        console.log(json);
    }

</script>

<!-- {JSON.stringify(word)} -->
<!-- <p>{word.word.WordName} == {learnWordForm}</p> -->

<div class='display'>
    <h2 style="text-align: center;">
        <span style="text-decoration: underline;">{capitalizeFirst(word.word.WordName)}</span> {'category' in word ? `: ${word.category.CategoryName}` : ''}
    </h2>
    {#if json !== undefined}
        <h3 style="text-align: center; color: {color};">
            {#if json.code === 200}
                <i class="fa-solid fa-circle-check valid"></i>
            {:else if json.code === 500}
                <i class="fa-solid fa-circle-xmark invalid"></i>
            {/if}
            <span>{json.message}</span>
        </h3>
    {/if}
    <DefinitionScroller name={word.word.WordName} definitions={word.definitions} />

    {#if word.relatedWords.length !== 0}
        <h4> Related Words:
            {#each word.relatedWords as related, iter}
                {#if iter + 1 < word.relatedWords.length}
                    {capitalizeFirst(related.WordName) + ', '}
                {:else}
                    {capitalizeFirst(related.WordName)}
                {/if}
            {/each}
        </h4>
    {/if}
</div>

<label for="learn-word-input" class="register-prompt">
    <p>Enter <b>{word.word.WordName}</b> below to register this word:</p>
</label>

<form on:submit="{submitWordLearned}" class="submit-form">
    <SubmitIconOnInput disabled={wordIsLearned} />
    <input name="learn-word-input" class="input" autocomplete="off" bind:value={learnWordForm}>
</form>

<style>

    .display { 
        display: grid;
    }

    .submit-form {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #faf9f6;
        border-radius: 12px;
        padding: 12px 8px;
        width: 20%;
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

    .register-prompt {
        display: flex;
        width: 20%;
    }
    

</style>