<script lang='ts'>

    export let data: any;
    export let knowledgeLevelDisplacementMap: any;

    const calculateDisplacement = (increment: number, originalNumber: string) => {
        let num = parseInt(originalNumber);
        return increment === 1 ? (num < 5 ? num + 1 : num) : (num > 1 ? num - 1 : num);
    }

    const getColor = (original: number, updated: number) => {
        if(updated === 1) return 'red';
        if(updated === 5) return 'green';
        if(updated > original) return 'green';
        if(updated < original) return 'red';
    }


</script>

<p>Quiz Results:</p>
<div class='results-scroll-wrapper'>
    <div class='scroll-box'>
        {#each knowledgeLevelDisplacementMap as displacement, i}
            {#if displacement !== 0}
                <div class='element-level'>
                    {data[i].word.WordName}:  
                    <div class='rating'>
                        {data[i].knowledgeLevel} -----> 
                        <span style:color={getColor(data[i].knowledgeLevel, calculateDisplacement(displacement, data[i].knowledgeLevel))}>{calculateDisplacement(displacement, data[i].knowledgeLevel)}</span>
                    </div>
                </div>
            {/if}
        {/each}
    </div>

</div>

<style>
    .results-scroll-wrapper {
        display: flex;
        width: 100%;
        justify-content: center;
        box-shadow: inset 1px 1px 1px 1px grey;
        border-radius: 12px;
        margin-bottom: 2.5rem;
    }

    .scroll-box {
        height: 150px;
        /* padding: 10px 10px; */
        width: 99%;
        overflow-y: auto;
        padding: 0 0 0 1rem;
    }

    .element-level {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
    }

    .rating {
        margin-left: 4px;
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

    @media (max-width: 400px) {
        .element-level {
            flex-direction: column;
        }
    }

</style>