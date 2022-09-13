<script lang='ts'>

    import { goto } from '$app/navigation';

    export let color: string;  
    export let name: string;
    export let path: string;
    export let enabled: boolean;

    let inputField = `checkbox_${name}`;
    let checked = false;

    const onClick = () => {
        goto(`/${path}?allNew=${checked}`, {replaceState: false});
    }

</script>

<div class="learn-option-wrapper {enabled ? 'enabled' : ''}" style="{color}" on:click|self="{onClick}">

    <!-- Only see new words: FEATURE COMING SOON -->
    <!-- <div class="checkbox-wrapper" on:click|self="{onClick}">

        <label for="checkbox" on:click|self="{onClick}">Only see new words</label>
        <input id={inputField} name="checkbox" type="checkbox" bind:checked="{checked}">

    </div> -->

    <div class="text-wrapper" on:click="{onClick}">

        <slot name="title">

        </slot>

    </div>

</div>

<style>

    .learn-option-wrapper {
        display: flex;
        transition: 0.5s ease-in-out;
        border: 1px solid black;
        border-radius: 12px;
        padding: 3rem 1.25rem;
        margin-bottom: 3.2rem;
        font-size: 1rem;
        color: #002654;
    }

    .enabled:hover {
        cursor: pointer;
        transform: scale(1.02);
    }

    .checkbox-wrapper {
        display: flex;
        /* justify-content: start; */
        
    }

    .text-wrapper {
        /* display: flex; */
        /* justify-content: center; */
        padding: 0 0 0 15px;
    }

</style>