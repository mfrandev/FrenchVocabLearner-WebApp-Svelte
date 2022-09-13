<script lang='ts'>
    
    import Header from '../../components/Header.svelte';
    import { goto } from '$app/navigation';
    import { fly, fade } from 'svelte/transition';
    import { session } from '../../stores/sessionStore';

    // Animaton objects so they dont have to be written more than once
    const leftFly = {x: -50, duration: 2000};
    const rightFly = {x: 50, duration: 2000};

    // Colors for each of the option boxes for the homepage
    let box1 = 'background-image: linear-gradient(to right bottom, rgba(0, 38, 84, 0.3), rgba(255, 255, 255, 0.3), rgba(237, 41, 57, 0.3));';
    let box2 = 'background-image: linear-gradient(to right top, rgba(0, 133, 63, 0.3), rgba(253, 239, 66, 0.3), rgba(227, 27, 35, 0.3))'
    let box3 = 'background-image: linear-gradient(to left bottom, rgba(255, 0, 0, 0.3), rgba(255, 255, 255, 0.3), rgba(255, 0, 0, 0.3))';
    let box4 = 'background-image: linear-gradient(to left top, rgba(0, 154, 68, 0.5), rgba(255, 255, 255, 0.5), rgba(234, 118, 0, 0.5))';
    // export let userExists: boolean;

    //Svelte-Kit navigation
    const navigate = (destination: string) => {
        goto(destination, {replaceState: false});
    }

</script>

<!-- Header -->
<Header headerVisible={true} position='relative' padding={'1.7rem 0 1rem 0'}/>

<div class='wrap-page'>

    <!-- Title at the top of the page greeting the user with a personalized message -->
    <!-- <h1 in:fade={{duration: 2000}} class="welcome" >Welcome, {$session?.username}!</h1> -->
    <h1 in:fade={{duration: 2000}} class="welcome" >Welcome, {$session?.username}</h1>

    <!-- Flex-Box for the top two boxes on the page -->
    <div class='line-wrapper' style="margin-top: 3rem;">

        <!-- Dictionary Link -->
        <div class="left box" in:fly={leftFly} style={box1} on:click="{() => navigate('/dictionary')}">
            <p class='text-width'>Search For A Word In The Dictionary</p>
        </div>

        <!-- Vertical separator between the top two boxes -->
        <div class='separator'/>

        <!-- Learning hub link -->
        <div class="right box" in:fly={rightFly} style={box2} on:click="{() => navigate('/learnHub')}">
            <p class='text-width'>Learn From A Collection Of Over 118,000 Words</p>
        </div>
    </div>

    <!-- Separate the two lines of boxes with a horizontal break -->
    <div id='separate-lines' style='height: 3rem;'/>

    <!-- Flex-Box for the bottom two boxes -->
    <div class='line-wrapper' style="margin-bottom: 2rem;">

        <!-- Quiz hub link -->
        <div class="left box" in:fly={leftFly} style={box3} on:click="{() => navigate('/quizHub')}">
            <p class='text-width'>Take A Quiz On What You've Learned</p>
        </div>

        <!-- Vertical separator between the bottom two boxes -->
        <div class='separator'/>

        <!-- Progress check link -->
        <div class="right box" in:fly={rightFly} style={box4} on:click="{() => navigate('/progress')}">
            <p class='text-width'>Check My Progress</p>
        </div>
    </div>
</div>

<style>

    .wrap-page {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .welcome {
        text-align: center; 
        color: #002654;
    }

    .text-width {
        width: 80%;
    }

    .line-wrapper {
        display: flex;
        margin: auto;
        width: 80%;
        height: 15rem;
        justify-content: center;
        /* background-color: black; */
    }

    .left {
        /* flex-grow: 2; */
        /* background-color: red; */
        width: 30%;
        height: 100%;
    }

    .separator {
        /* flex-grow: 0.5; */
        width: 10%;
        height: 100%;
    }

    .right {
        /* flex-grow: 2; */
        /* background-color: green; */
        width: 30%;
        height: 100%;
    }
    
    .box {
        border-radius: 12px;
        transition: 0.35s ease-in-out;
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: center;
        color: #002654;
        font-family: 'Lato', sans-serif;
        font-size: 1.1rem;
    }

    .box:hover {
        cursor: pointer;
        transform: scale(1.035);
    }

    @media(max-width: 842px) {
        .line-wrapper {
            width: 90%;
        }

        .left {
            width: 35%;
        }
        
        .right {
            width: 35%;
        }
        
    }

    @media(max-width: 450px) {
        .line-wrapper {
            width: 100%;
        }

        .left {
            width: 40%;
        }
        
        .right {
            width: 40%;
        }
        
    }

</style>