<script lang='ts'>

    export let disabled: boolean;

</script>

<svelte:head>
    <script src="https://kit.fontawesome.com/41e1c7c256.js" crossorigin="anonymous"></script>
</svelte:head>

<button class="submit-wrapper" disabled='{disabled}'>
    <i class="fa-solid fa-arrow-left"></i>
</button>

<style>

    .submit-wrapper {
        background-color: transparent;
        padding: 0 8px 0 3px;
        display: flex;
        align-items: center;
        border: none;
        transition: 0.2s ease-in-out;
        font-size: 1rem;
    }

    .submit-wrapper:hover {
        color: red;
        cursor: pointer;
    }

    .submit-wrapper:disabled {
        color: rgba(0, 0, 0, 0.6);
        cursor: auto;
    }

</style>
