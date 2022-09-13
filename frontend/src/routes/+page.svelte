<script lang='ts'>

    import { onMount } from 'svelte';
    import { fly, fade } from 'svelte/transition';
    import Header from '../components/Header.svelte';
    let src = 'homepage.jpg';
    import { session } from '../stores/sessionStore';

    //Save the bounding client for later access
    let boundingClient: DOMRect | undefined;

    //Associate the effect visibility data together
    let effectStatuses = {
        headerVisible: false,
        scrollVisible: false
    };

    let y: number;

    // let transition = 'local';

    //When the page loads, show save the bounding client and show content
    onMount(() => {
        // transition = 'local';
        effectStatuses.headerVisible = true;
        effectStatuses.scrollVisible = true;
        boundingClient = document.getElementById('wrapper')?.getBoundingClientRect();
    });

    //Bounding client operations to determine when the index page data should disappear based on scroll location
    $: {

        //User has scrolled down enough to remove the content from the screen
        if(boundingClient && y > ((boundingClient.height / 2) * 0.15)) {
            effectStatuses.scrollVisible = false;
            effectStatuses.headerVisible = false;
        } 
        
        //Bring back the header, index message, and scroll icon
        else {
            effectStatuses.scrollVisible = true;
            effectStatuses.headerVisible = true;
        }
    }

    //Save transition objects
    const leftFly = {x: -50, duration: 2000};
    const rightFly = {x: 50, duration: 2000};

    </script>

    <svelte:head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://kit.fontawesome.com/41e1c7c256.js" crossorigin="anonymous"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@1,700&display=swap" rel="stylesheet">
    </svelte:head>

    <svelte:window bind:scrollY={y}/>

    {#key $session === null}

        <div id='wrapper'>

            <!-- Customised header so it is placed over background image -->
            <Header bind:headerVisible={effectStatuses.headerVisible} 
            bind:scrollVisible={effectStatuses.scrollVisible}
            position={'absolute'} indexPage={true}/>

            <!-- https://stackoverflow.com/questions/54508374/how-can-i-position-an-icon-over-an-image -->

            <div style='height: 100vh;' class='details'/>

            <!-- Arrow at the bottom of the screen saying 'scroll to learn more' -->
            {#if effectStatuses.scrollVisible}
                <p class='scroll-message' in:fly = {{x:-50, duration:1500}} out:fly|local  = {{x:-50, duration:1500}}>
                    Scroll to Learn More
                </p>
                <div class='scroll-arrow' in:fly = {{x:-50, duration:1500}} out:fly|local  = {{x:-50, duration:1500}}>
                    <i class="fa-solid fa-angles-down bounce"></i>
                </div>
            {/if}
            
            <!-- Portion of page telling what the app does -->
            <div class='details-wrapper' style='padding-bottom: 4rem;'>

                <div class='title-learn-more'>
                    <div>
                        Features Included In This App
                    </div>
                </div>

                <!-- Top level boxes -->
                <div class='line-wrapper'>

                    <!-- Top left Box -->
                    <div class="left box" in:fly={leftFly}>
                        <p class='text-width'>Learn Words In The Dictionary Via. Search</p>
                    </div>
            
                    <!-- Vertical Separator between top level boxes -->
                    <div class='separator'/>
            
                    <!-- Top right box -->
                    <div class="right box" in:fly={rightFly} >
                        <p class='text-width'>Learn From A Collection Of Over 118,000 Words</p>
                    </div>
                </div>
            
                <!-- Horizontal separator between top and bottom level boxes -->
                <div id='separate-lines' style='height: 3rem;'/>
            
                <!-- Bottom level boxes -->
                <div class='line-wrapper'>

                    <!-- Bottom left box -->
                    <div class="left box" in:fly={leftFly}>
                        <p class='text-width'>Take Quizzes On What You've Learned</p>
                    </div>
            
                    <!-- Vertical Separator between bottom level boxes -->
                    <div class='separator'/>
            
                    <!-- Bottom right box -->
                    <div class="right box" in:fly={rightFly}>
                        <p class='text-width'>Learn From A Curated List Of The Most Common Nouns, Verbs, And Adjectives (Coming Soon)</p>
                    </div>
                </div>    
            </div>

        </div>
    {/key}
    
    
    
<style>

    .details-wrapper {
        /* background-image: url('/homepage.jpg'); */
        position: relative;
    }

    /* https://sebhastian.com/background-image-opacity-css/ */
    .details-wrapper::before {
        content: "";
        background-image: url('/homepage.jpg');
        background-attachment: fixed;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: -1;
        opacity: 0.2;
    }

    .title-learn-more {
        padding-top: 4rem;
        padding-bottom: 4rem;
        display: flex;
        margin: auto;
        align-items: center;
        justify-content: center;
        color: #002654;
        font-family: 'Lato', sans-serif;
        font-size: 1.8rem;
    }

    /* .container {
        position: relative;
        text-align: center;
    }

    .app-message {
        position: absolute;
        top: 8rem;
        width: 100%;
        color: #002654;
        font-family: 'Lato', sans-serif;
        font-size: 1.5rem;
    } */

    .scroll-arrow {
        position: absolute;
        left: 49.4%;
        bottom: 1.2rem;
    }

    .scroll-message {
        position: absolute;
        text-align: center;
        bottom: 3rem;
        width: 100%;
        color: #002654;
        font-family: 'Lato', sans-serif;
    }

    .bounce {
        animation: bounce 2s infinite;
    }

    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-18px);
        }
        60% {
            transform: translateY(-11px);
        }
    }

    div i {
        color: #002654;
        font-size: 1.2rem;
    }

    .details {
        width: 100vw;
        background-image: url('/homepage.jpg');
        background-attachment: fixed;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        opacity: 40%;
    }

    .line-wrapper {
        display: flex;
        margin: auto;
        width: 80%;
        height: 15rem;
        justify-content: center;
    }

    .left {
        width: 30%;
        height: 100%;
    }

    .separator {
        flex-grow: 0.5;
        width: 0%;
        height: 100%;
    }

    .right {
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
        background-color: #faf9f6;
        box-shadow: 2px 2px;
    }

</style>