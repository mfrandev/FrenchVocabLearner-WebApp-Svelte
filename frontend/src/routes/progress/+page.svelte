<script lang='ts'>
    // throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");
    /** @type {import('./$types').PageData */
    export let data: any;

    //Get my components
    import Header from '../../components/Header.svelte';
    import FilterBar from '../../components/FilterBar.svelte';
    import WordRatingViewer from '../../components/WordRatingViewer.svelte';

    //Create a separate array from all words learned for filtering
    let wordsShownOnScreen: any[] = data.wordsLearnedByAccount;

    //Filter the words the user has learned by the knowledge level selected
    const filterWords = (regexToFilterBy: string, filterLevel: any) => {

        //All words the user has learned
        if(filterLevel === 'any') {
            wordsShownOnScreen = data.wordsLearnedByAccount.filter((word: { word: string; }) => word.word.substring(0, regexToFilterBy.length) === regexToFilterBy);
            return;
        } 
        
        //All words the user has learned with a given knowledge level
        else {
            filterLevel = filterLevel.toString();
            wordsShownOnScreen = data.wordsLearnedByAccount.filter((word: { knowledgeLevel: any; word: string; }) => word.knowledgeLevel === filterLevel && word.word.substring(0, regexToFilterBy.length) === regexToFilterBy);
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

<div class='page-wrapper'>

    <Header headerVisible={true} position={'relative'}/>

    <h2 class='title'>Words You've Already Learned</h2>

    <!-- Filter by the characters entered and/or knowledge level selected -->
    <FilterBar knowledgeLevels={data.knowledgeLevels} 
    on:knowledgeLevelFilterChange={e => filterWords(e.detail.filter, e.detail.knowledgeLevel)}
    on:regexFilter={e => filterWords(e.detail.filter, e.detail.knowledgeLevel)}/>

    <!-- Set a break in the page -->
    <div class="input-bar-placeholder"/>
    
    <!-- Display the words the user has selected to view -->
    <WordRatingViewer wordsShownOnScreen={wordsShownOnScreen} />

</div>


<style>

    .page-wrapper {
        height: 100%;
        width: 100%;
        font-family: 'Lato', sans-serif;
        min-height: 100vh;
        /* background-color: beige; */
        background-image: linear-gradient(to left , rgba(0, 154, 68, 0.3), rgba(255, 255, 255, 0.3), rgba(234, 118, 0, 0.3));
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .input-bar-placeholder {
        /* margin-top: 2rem; */
        /* margin-bottom: 2rem; */
        height: 100px;
        z-index: -100;
    }

    .title {
        margin: 1rem 0 2rem 0;
    }

</style>