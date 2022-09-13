<script lang='ts'>

    export let disabled: boolean;

</script>

<svelte:head>
    <script src="https://kit.fontawesome.com/41e1c7c256.js" crossorigin="anonymous"></script>
</svelte:head>

<button class="search-wrapper" disabled='{disabled}'>
    <i class="fa-solid fa-magnifying-glass"></i>
</button>

<style>

    .search-wrapper {
        background-color: transparent;
        padding: 0 8px 0 3px;
        font-size: 1rem;
        display: flex;
        align-items: center;
        border: none;
        transition: 0.2s ease-in-out;
    }

    .search-wrapper:hover {
        color: red;
        cursor: pointer;
    }

    .search-wrapper:disabled {
        color: rgba(0, 0, 0, 0.6);
        cursor: auto;
    }

</style>
