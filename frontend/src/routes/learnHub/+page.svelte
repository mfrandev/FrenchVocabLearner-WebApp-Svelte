<script lang='ts'>

    import Header from '../../components/Header.svelte';
    import LearnMenuOption from '../../components/LearnMenuOption.svelte';
    import { fly } from 'svelte/transition';

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

        <!-- Option to learn 10 random words -->
        <div in:fly={{x: -50, duration: 2000}}>
            <LearnMenuOption enabled={true} path={'learnRandom'} name={'random'} color={'background-image: linear-gradient(to right, rgba(0, 38, 84, 0.5), rgba(255, 255, 255, 0.5), rgba(237, 41, 57, 0.5))'}>
                <div slot='title'>
                    Learn 10 Random Words
                </div>
            </LearnMenuOption>
        </div>

        <!-- Option to learn 10 of the most common nouns -->
        <div in:fly={{x: 50, duration: 2000}}>
            <LearnMenuOption enabled={false} path={'learnHub'} name={'200_common_noun'} color={'background-image: linear-gradient(to right, rgba(0, 133, 63, 0.5), rgba(253, 239, 66, 0.5), rgba(227, 27, 35, 0.5))'}>
                <div slot='title'>
                    Learn From The Top 200 Most Common Nouns (Coming Soon)
                </div>
            </LearnMenuOption>
        </div>

        <!-- Option to learn 10 of the most common verbs -->
        <div in:fly={{x: -50, duration: 2000}}>
            <LearnMenuOption enabled={false} path={'learnHub'} name={'200_common_verb'} color={'background-image: linear-gradient(to right, rgba(234, 118, 0, 0.5), rgba(255, 255, 255, 0.5), rgba(0, 154, 68, 0.5))'}>
                <div slot='title'>
                    Learn From The Top 200 Most Common Verbs (Coming Soon)
                </div>
            </LearnMenuOption>
        </div>

        <!-- COMING SOON -->
        <!-- <div in:fly={{x: 50, duration: 2000}}>
            <LearnMenuOption path={'learnHub'} name={'200_common_adj'} color={'background-image: linear-gradient(to right, rgba(255, 0, 0, 0.5), rgba(255, 255, 255, 0.5), rgba(255, 0, 0, 0.5))'}>
                <div slot='title'>
                    Learn From The Top 200 Most Common Adjectives (Coming Soon)
                </div>
            </LearnMenuOption>
        </div>

        <div in:fly={{x: -50, duration: 2000}}>
            <LearnMenuOption path={'learnHub'} name={'200_common_adv'} color={'background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(253, 218, 36, 0.5), rgba(239, 51, 64, 0.5))'}>
                <div slot='title'>
                    Learn From The Top 200 Most Common Adverbs (Coming Soon)
                </div>
            </LearnMenuOption>
        </div> -->

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
        /* background-image: linear-gradient(to right bottom, rgba(0, 38, 84, 0.3), rgba(255, 255, 255, 0.3), rgba(237, 41, 57, 0.3)); */
    }

    .options-wrapper {
        /* padding-top: 2rem; */
        margin: auto;
        /* display: flex; */
        width: 80%;
    }

</style>