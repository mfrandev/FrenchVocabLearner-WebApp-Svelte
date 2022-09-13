<script lang='ts'>

    export let definitions: Object[];
    export let name: string;

    //Capitalize first letter of string passed in args
    const capitalizeFirst = (word: string) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

</script>

<!-- Display word and that its definitions are below -->
<p>{capitalizeFirst(name)} Definitions:</p>

<!-- Scroll box containing all the definitions passed to component -->
<div class='definition-scroll-wrapper'>
    <div class='scroll-box'>
        {#each definitions as def}
        <p>{def}</p>
        {/each}
    </div>

</div>

<style>

    .definition-scroll-wrapper {
        display: flex;
        width: 100%;
        justify-content: start;
        box-shadow: inset 1px 1px 1px 1px grey;
        border-radius: 12px;
    }

    .scroll-box {
        height: 100px;
        width: 99%;
        overflow-y: auto;
        padding: 0 0 0 1rem;
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