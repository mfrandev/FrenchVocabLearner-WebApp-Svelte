<script>

    import { createEventDispatcher } from 'svelte';

    let menuActive = false;

    let dispatch = createEventDispatcher();

    //Toggle whether the navbar menu is open or closed
    const toggleMenu = () => {
        menuActive = !menuActive;

        //Dispatch whether menu is open or closed to header component
        dispatch('toggleMenu', {
            active: menuActive
        });
    }

</script>
    
    <!-- Hamburger bar icon -->
    <div class='burger-icon-wrapper'>
        <i class="fa-solid fa-bars burger-icon" on:click={toggleMenu} />
    </div>

<style>

    .burger-icon-wrapper {
        padding: 14px 4rem;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
    }

    .burger-icon:hover {
        cursor: pointer;
    }

    @media (max-width: 375px) {   
        .burger-icon-wrapper {
            padding: 0 2rem 0 0;
        }
    }

</style>