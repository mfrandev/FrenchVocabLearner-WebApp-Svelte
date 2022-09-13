<script>

    import { createEventDispatcher } from 'svelte';
    let dispatch = createEventDispatcher();

</script>

<svelte:head>
    <script src="https://kit.fontawesome.com/41e1c7c256.js" crossorigin="anonymous"></script>
</svelte:head>

<div class="search-wrapper">
    
    <!-- On click, dispatch event to parent telling it to delete the input in an input field -->
    <i class="fa-solid fa-xmark" on:click='{() => dispatch('deleteInput')}'></i>
</div>

<style>

    .search-wrapper {
        /* background-color: rgba(255, 255, 255, 1); */
        /* background-color: blue; */
        background-color: transparent;
        padding: 0 8px 0 8px;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
    }

    .search-wrapper:hover {
        transition: 0.2s ease-in-out;
        color: red;
        cursor: pointer;
    }

</style>