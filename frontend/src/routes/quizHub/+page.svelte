<script lang='ts'>
    // throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");
    /** @type {import('./$types').PageData */
    export let data: any;

    import Header from '../../components/Header.svelte';
    import { fly } from 'svelte/transition';
    import QuizMenuComponent from '../../components/QuizMenuComponent.svelte';

</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Learning Hub</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@1,700&display=swap" rel="stylesheet">
</svelte:head>

<div class="page-wrapper">

    <Header headerVisible={true} position={'relative'}/>

    <div class="options-wrapper">

        <!-- Take a quiz of 10 random words the user has already learned (if available) -->
        <div in:fly={{x: -50, duration: 2000}}>
            <QuizMenuComponent path={'quizRandom'} selectMenu={true} selectMenuData={data.quizzesAvailable.quizzes}
            color={'background-image: linear-gradient(to right, rgba(0, 38, 84, 0.5), rgba(255, 255, 255, 0.5), rgba(237, 41, 57, 0.5))'}
            enabled={data.quizzesAvailable.numQuizzesAvailable > 0}>
                <div slot='title'>
                    {data.quizzesAvailable.numQuizzesAvailable > 0 ? 'Quiz On (Up To) 10 Random Words You\'ve Learned' : 'You Must Learn A Minimum Of Ten Words To Unlock This Quiz'}
                </div>
            </QuizMenuComponent>
        </div>

        <!-- Take a quiz on 10 of the most common nouns (if available) -->
        <div in:fly={{x: 50, duration: 2000}}>
            <QuizMenuComponent path={'quizHub'} color={'background-image: linear-gradient(to right, rgba(0, 133, 63, 0.5), rgba(253, 239, 66, 0.5), rgba(227, 27, 35, 0.5))'}
            enabled={false}>
                <div slot='title'>
                    {false ? 'Quiz On 10 Of The Top 200 Most Common Nouns (Coming Soon)' : 'You Must Learn At Least Ten Of The Top 200 Most Common Nouns (Coming Soon) To Unlock This Quiz'}
                </div>
            </QuizMenuComponent>
        </div>

        <!-- Take a quiz on 10 of the most common verbs (if available) -->
        <div in:fly={{x: -50, duration: 2000}}>
            <QuizMenuComponent path={'quizHub'} color={'background-image: linear-gradient(to right, rgba(234, 118, 0, 0.5), rgba(255, 255, 255, 0.5), rgba(0, 154, 68, 0.5))'}
            enabled={false}>
                <div slot='title'>
                    {false ? 'Quiz On 10 Of The Top 200 Most Common Verbs (Coming Soon)' : 'You Must Learn At Least Ten Of The Top 200 Most Common Verbs (Coming Soon) To Unlock This Quiz'}
                </div>
            </QuizMenuComponent>
        </div>

    </div>

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
    }

    .options-wrapper {
        margin: auto;
        width: 80%;
    }

</style>