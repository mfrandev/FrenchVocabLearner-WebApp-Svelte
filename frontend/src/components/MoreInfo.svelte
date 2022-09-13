<script lang='ts'>

    import { fly } from 'svelte/transition';

    export let description: string;
    export let pulseActive: boolean = false;

    let isRendered = false;

    let color = 'transparent';
    let frequency = '0';

    $: {
        if(!pulseActive) {
            color = 'red';
            frequency = 'infinite';
        } else if(pulseActive) {
            color = 'transparent';
            frequency = '0';
        }
    } 

    function styles(node: any, styles: any) {
	    setCustomProperties(node, styles)
	
        return {
            update(styles: any) {
                setCustomProperties(node, styles)
            }
        };
    }

    function setCustomProperties(node: any, styles: any) {
        Object.entries(styles).forEach(([key, value]) => {
            node.style.setProperty(`--${key}`, value)
        })
    }

    const onHover = () => {
        isRendered = true;
    }

    const offHover = () => {
        isRendered = false;
    }

</script>

<svelte:head>
    <script src="https://kit.fontawesome.com/41e1c7c256.js" crossorigin="anonymous"></script>
</svelte:head>

<div id='info-data' class='info-wrapper' on:mouseenter="{onHover}" on:mouseleave="{offHover}">

    {#if isRendered}
        <div id ='tipbox' class='tip-box-wrapper' in:fly={{y: -50, duration: 300}} out:fly={{y: -50, duration:300}} style="transform: translateY(-102%);">
            <div class='text-box'>
                {@html description}
            </div>
            <div class='triangle'/>
        </div>
    {/if}

        <div class='pulse' use:styles={{ color, frequency }}>
            <i id='info' class="fa-solid fa-circle-info info"/>
        </div>

</div>

<style>

    div:hover i {
        color: inherit;
    }

    .tip-box-wrapper {
        position: absolute;
        display: flex;
        flex-direction: column;
    }
    
    .text-box {
        background-color: rgb(250, 244, 244);
        border: 1px solid rgb(250, 244, 244);
        border-radius: 12px;
        padding: 0.5rem;
        min-width: fit-content;
        min-height: fit-content;
        transform: translateX(-10px);
    }

    /* https://css-tricks.com/snippets/css/css-triangle/ */
    .triangle {
        width: 0; 
        height: 0; 
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 15px solid rgb(250, 244, 244);
    }

    .info-wrapper {
        padding-left: 0.4rem;
    }

    .info {
        transition: 0.3s ease-in-out;
        pointer-events: auto;
        font-size: 1.26rem;
        color: gray;
        /* position: relative; */
        /* transform: translate(-.17px, 1px); */
    }

    /* https://www.youtube.com/watch?v=PMGCOVfK-8s */

    .pulse {
        /* height: 21px; */
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .pulse::before,
    .pulse::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border-radius: 50%;
    }

    .pulse::after {
        background-color: var(--color);
        z-index: -1;
        animation: pulse 0.9s;
        animation-iteration-count: var(--frequency);
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 0.75;
        }
        100% {
            transform: scale(1.75);
            opacity: 0;
        }
    }


</style>