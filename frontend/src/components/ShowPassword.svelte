<script lang='ts'>

    export let passwordVisible: boolean = false;
    export let inputFieldID: string;
    export let paddingRightLeft: string = '';

    const togglePasswordVisible = () => {
        passwordVisible = !passwordVisible;
        let elem = (<HTMLInputElement>document.getElementById(inputFieldID));
        if(elem !== null && passwordVisible) {
            elem.type = 'text';
        } else if(elem !== null && !passwordVisible) {
            elem.type = 'password';
        }
    }

</script>

<svelte:head>
    <script src="https://kit.fontawesome.com/41e1c7c256.js" crossorigin="anonymous"></script>
</svelte:head>

<div class='password-reveal' style='padding: 0 {paddingRightLeft};'>
    {#if passwordVisible}
        <i class="fa-solid fa-eye-slash toggle-password" on:click="{togglePasswordVisible}"></i>
    {:else}
        <i class="fa-solid fa-eye toggle-password" on:click="{togglePasswordVisible}"></i>
    {/if}
</div>      

<style>

    .password-reveal { 
        /* background-color: rgba(255, 255, 255, 1); */
        /* background-color: black; */
        background-color: transparent;
        font-size: 1rem;
        padding: 0.938rem 0; 
    }

    .toggle-password {
        color: rgba(0, 38, 84, 1);
        transition: 0.2s ease-in-out;
    }

    .toggle-password:hover {
        color: rgba(237, 41, 57, 1);
        cursor: pointer;
    }

</style>