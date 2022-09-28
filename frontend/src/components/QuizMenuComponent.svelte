<script lang='ts'>

    import { goto } from '$app/navigation';

    export let color: string;  
    export let path: string;
    export let selectMenu: boolean = false;
    export let selectMenuData: any = [];
    export let enabled: boolean;

    let select = 'any';

    const onClick = () => {
        if(enabled) {
            goto(selectMenu && enabled ? `/${path}?level=${select}` : `/${path}`, {replaceState: false});
        }
    }

</script>

<div class="learn-option-wrapper {enabled ? 'enabled' : ''}" style="{enabled ? color: color}" on:click|self="{onClick}">

    <div on:click="{onClick}">

        <slot name="title">

        </slot>

    </div>

    {#if selectMenu && enabled}
        <span on:click|self="{onClick}" class="select-annotation">Knowledge Level (More Options Coming Soon)</span>
        <select class="select-style" bind:value="{select}">
            {#each selectMenuData as option}
                {#if option.status.code === 200}
                    <!-- This if statement will get removed when quizzes for specifc knowledge levels are implemented -->
                    <!-- {#if option.type === 'any'} -->
                        <option>{option.type}</option>
                    <!-- {/if} -->
                {/if}
            {/each}
        </select>
    {/if}

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
        align-items: center;
    }

    .enabled:hover {
        cursor: pointer;
        transform: scale(1.02);
    }

    .select-annotation {
        margin-left: 2rem;
    }

    .select-style {
        padding: 3px;
        border-radius: 5px;
        background-color: #faf9f6;
        margin-left: 0.75rem; 
        width: 60px;
    }

    @media(max-width: 400px) {
        .learn-option-wrapper {
            flex-direction: column;
            align-items: start;
        }
        .select-annotation {
            margin-left: 0;
            margin-top: 1rem;
        }
        .select-style {
            margin-left: 0;
            margin-top: 1rem;
        }
    }

</style>