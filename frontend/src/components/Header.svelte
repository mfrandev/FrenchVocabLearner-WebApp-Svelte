<script lang='ts'>
    import { fly } from 'svelte/transition';
    import { session } from '../stores/sessionStore';
    import HamburgerMenu from './HamburgerMenu.svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';

    export let headerVisible: boolean;
    export let scrollVisible: boolean = true;
    export let position = 'absolute';
    export let padding = '1.7rem 0';
    export let hyperlinkOverwrite = false;
    export let indexPage = false;
    export let overwriteAction = () => {};

    let dispatch = createEventDispatcher();

    // Logout the user
    const handleLogout = async () => {
        const response = await fetch('http://localhost:3001/api/auth/logout', {
            method: 'GET',  
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        //After successful logout, direct user to index page
        if(response.status === 200 && $page.routeId !== '') {
            goto('/', { replaceState: true });
        } else if(response.status === 200 && $page.routeId === '') {
            session.set(null);
        }
    }

    let hamburgerMenuToggle = false;

</script>

<svelte:head>
    <script src="https://kit.fontawesome.com/41e1c7c256.js" crossorigin="anonymous"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@1,700&display=swap" rel="stylesheet">
</svelte:head>

{#if headerVisible}
    <div class='wrapper' style='position: {position}; padding: {padding};'>

        <nav class='navbar' in:fly = {{y:50, duration:2000}} out:fly|local={{y:50, duration:2000}}>

            <!-- Display the logo at the top left of the screen -->
            <div class='logo'>
                {#if !hyperlinkOverwrite}

                    <!-- Dynamic hyperlink depending on if user is logged in or not -->
                    <a href='{$session !== null ? '/home' : '/'}'>
                        <!-- VocabLearnerFR -->
                        <i class="fa-solid fa-house"></i>
                    </a>
                {:else}

                    <!-- Dynamic hyperlink depending on if user is logged in or not -->
                    <div on:click={() => {
                        dispatch('overwittenLink', {
                            link: $session !== null ? '/home' : '/',
                            destinationDescription: 'Home Page'
                        });
                        overwriteAction();
                    }} class="replicate">
                        <!-- VocabLearnerFR -->
                        <i class="fa-solid fa-house"></i>
                    </div>
                {/if}
            </div>

            <!-- ==============Regular Header Navbar=============== --> 
            <ul id='menu' class='menu'>

            <!-- If user is logged in -->
            {#if $session !== null}
                <!-- <li>{JSON.stringify($session)}</li> -->
                {#if !hyperlinkOverwrite}
                    <li><a href='/learnHub'>Learn Words</a></li>
                {:else}
                    <li><div on:click={() => {
                        dispatch('overwittenLink', {
                            link: $session !== null ? '/learnHub' : '/',
                            destinationDescription: 'Learning Hub'
                        });
                        overwriteAction();
                    }} class="replicate">Learn Words</div></li>
                {/if}
                {#if !hyperlinkOverwrite}
                    <li><a href='/dictionary'>Dictionary</a></li>
                {:else}
                    <li><div on:click={() => {
                        dispatch('overwittenLink', {
                            link: $session !== null ? '/dictionary' : '/',
                            destinationDescription: 'Dictionary'
                        });
                        overwriteAction();
                    }} class="replicate">Dictionary</div></li>
                {/if}
                {#if !hyperlinkOverwrite}
                    <li><a href="/quizHub">Quizzes</a></li>
                {:else}
                    <li><div on:click={() => {
                        dispatch('overwittenLink', {
                            link: $session !== null ? '/quizHub' : '/',
                            destinationDescription: 'Quiz Hub'
                        });
                        overwriteAction();
                    }} class="replicate">Quizzes</div></li>
                {/if}
                {#if !hyperlinkOverwrite}
                    <li class='outside replicate' on:click="{handleLogout}">Logout</li>
                {:else}
                    <li on:click={() => {
                        dispatch('logout', {
                            logoutFunc: handleLogout,
                            destinationDescription: 'Landing Page (via Logout)' 
                        });
                        overwriteAction();
                    }} class="outside replicate">Logout</li>
                {/if}
            {:else}
                <li><a href='/register'>Signup</a></li>
                <li class='outside'><a href='/login'>Login</a></li>
            {/if}
            </ul>

            <div class="burger-wrapper">
                <HamburgerMenu on:toggleMenu={e => hamburgerMenuToggle = e.detail.active}/>
            </div>

        </nav>

        {#if hamburgerMenuToggle}

            <!-- ===========Hamburger Header Menu=========== -->
            <div class='hamburger-menu-wrapper' style='z-index: 1;'>

                <!-- If user is logged in, display logged in options -->
                {#if $session !== null}
                    {#if !hyperlinkOverwrite}
                        <div class='hamburger-menu-option'><a href='/learnHub'>Learn Words</a></div>
                    {:else}
                        <div class='hamburger-menu-option'><div on:click={() => {
                            dispatch('overwittenLink', {
                                link: $session !== null ? '/learnHub' : '/',
                                destinationDescription: 'Learning Hub'
                            });
                            overwriteAction();
                        }} class="replicate">Learn Words</div></div>
                    {/if}
                    {#if !hyperlinkOverwrite}
                        <div class='hamburger-menu-option'><a href='/dictionary'>Dictionary</a></div>
                    {:else}
                        <div class='hamburger-menu-option'><div on:click={() => {
                            dispatch('overwittenLink', {
                                link: $session !== null ? '/dictionary' : '/',
                                destinationDescription: 'Dictionary'
                            });
                            overwriteAction();
                        }} class="replicate">Dictionary</div></div>
                    {/if}
                    {#if !hyperlinkOverwrite}
                        <div class='hamburger-menu-option'><a href="/quizHub">Quizzes</a></div>
                    {:else}
                        <div class='hamburger-menu-option'><div on:click={() => {
                            dispatch('overwittenLink', {
                                link: $session !== null ? '/quizHub' : '/',
                                destinationDescription: 'Quiz Hub'
                            });
                            overwriteAction();
                        }} class="replicate">Quizzes</div></div>
                    {/if}
                    {#if !hyperlinkOverwrite}
                        <div class='hamburger-menu-option replicate' on:click="{handleLogout}">Logout</div>
                    {:else}
                        <div on:click={() => {
                            dispatch('logout', {
                                logoutFunc: handleLogout,
                                destinationDescription: 'Landing Page (via Logout)' 
                            });
                            overwriteAction();
                        }} class='hamburger-menu-option replicate'>Logout</div>
                    {/if}

                <!-- Otherwise display non-logged in options -->
                {:else}
                <div class='hamburger-menu-option'><a href='/register'>Signup</a></div>
                <div class='hamburger-menu-option'><a href='/login'>Login</a></div>
                {/if}
            </div>
        {/if}

        <!-- Hacky solution for index page to place homescreen message in the header (easiest to format, less semantic sense) -->
        {#if indexPage}
            <div class='container'>
                {#if scrollVisible}
                    <p class='app-message' style='top: {hamburgerMenuToggle ? '0rem' : '2rem'};' in:fade={{duration:1000}}>
                        An Online French Language Vocabulary Memorization Tool
                    </p>
                {/if}
            </div>
        {/if}
    </div>
{/if}


<style>

    .container {
        position: relative;
        text-align: center;
    }

    .app-message {
        position: absolute;
        /* top: 8rem; */
        width: 100%;
        color: #002654;
        font-family: 'Lato', sans-serif;
        font-size: 1.5rem;
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;

    }

    a, a:hover {
        text-decoration: none;
    }

    a, .replicate {
        color: #002654;
        font-family: 'Lato', sans-serif;
    }

    a:hover, .replicate:hover {
        opacity: 60%;
        transition: 0.5s;
    }

    ul li {
        padding: 0 2rem;
    }

    .replicate:hover {
        cursor: pointer;
    }

    .navbar {
        display: flex;
        align-items: center;
        width: 100%;
        z-index: 1;
    }

    .logo {
        padding: 14px 4rem;
        /* text-align: center; */
        font-size: 1.2rem;
        /* padding: 14px 0; */
        flex-grow: 1;
    }

    .menu {
        flex-grow: 1;
        display: flex;
        align-items: center;
        list-style: none;
        justify-content: flex-end;
    }

    .outside {
        padding: 0 4rem 0 2rem;
    }

    .burger-wrapper {
        display: none;
    }

    .hamburger-menu-wrapper {
        display: none;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-bottom: 2rem;
    }

    .hamburger-menu-option {
        margin-top: 1rem;
        width: 50%;
        padding: 8px 0;
        border-bottom: 1px solid #002654;
        text-align: center;
        transition: 0.35s ease-in-out;
    }

    .hamburger-menu-option:hover {
        cursor: pointer;
        transform: scale(1.1);
    }

    @media (max-width: 842px) {
        .menu {
            display: none;
        }
        .burger-wrapper {
            display: flex;
        }
        .hamburger-menu-wrapper {
            display: flex;
        }
    }

    @media (max-width: 375px) {   
        .logo {
            padding: 14px 2rem;
        }
    }
   
</style>

