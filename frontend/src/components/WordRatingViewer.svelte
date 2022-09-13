<script lang='ts'>
    import { fade } from 'svelte/transition';

    export let wordsShownOnScreen: any;

</script>

<div class='word-level-viewer' >
    {#key wordsShownOnScreen}
        <div in:fade={{duration: 500}} class='words-container'>
            {#if wordsShownOnScreen.length > 0}
                {#each wordsShownOnScreen as word}
                    <p style="margin-bottom: 2rem;">{word.word} -------> Knowledge Level {word.knowledgeLevel}</p>
                {/each}
            {:else}
                <h3 style='text-align: center'>No Words With These Specifications</h3>
            {/if}
        </div>
    {/key}
</div>

<style>
    .word-level-viewer {
        display: flex;
        background-color: #faf9f6;
        width: 80%;
        align-items: center;
        justify-content: center;
        /* margin-top: 3rem; */
        box-shadow: inset 1px 1px 1px 1px grey;
        /* padding: 10px; */
        border-radius: 12px;
        height: 60vh;
        overflow: auto;
        margin-bottom: 4rem;
    }

    .words-container {
        height: 95%;
        /* display: flex;
        align-items: center; */

    }

    /* width */
     ::-webkit-scrollbar {
        width: 8px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 5px grey;
        border-radius: 10px;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: grey;
        border-radius: 10px;
    }
</style>