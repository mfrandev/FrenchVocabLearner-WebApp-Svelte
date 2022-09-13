<script lang='ts'>

    import { createEventDispatcher } from 'svelte';

    export let value = '';
    export let verificationFunction = (value: any) : boolean => { return false };
    export let padding = '0.938rem 1rem 0.938rem 1rem';
    
    let myDispatch = createEventDispatcher();

    $: valid = verificationFunction(value);

    $: {
        myDispatch('updateVerificationStatus', {
            isValid: valid
        });
    };

</script>

<svelte:head>
    <script src="https://kit.fontawesome.com/41e1c7c256.js" crossorigin="anonymous"></script>
</svelte:head>

<div class='button-addon' style='padding: {padding};'>
    
    {#if valid}
        <i class="fa-solid fa-circle-check valid"></i>
    {:else}
        <i class="fa-solid fa-circle-xmark invalid"></i>
    {/if}

</div>      

<style>

    .button-addon { 
        /* background-color: rgba(255, 255, 255, 1); */
        /* background-color: blue; */
        background-color: transparent;
        font-size: 1rem;
    }

    .valid {
        color: green;
    }

    .invalid {
        color: rgba(237, 41, 57, 1);
    }

</style>