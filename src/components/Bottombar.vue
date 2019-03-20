<template>
    <div class="bottombar">
        <button class="btnMute"></button>

        <div class="piano-mode"></div>

        <div class="mode-chooser">
            {{ mode }}
        </div>

        <button class="btnShowPiano"></button>

        <div class="btnLock"></div>

        <div class="btnShare"></div>

        <div class="btnFullscreen"></div>

        <div class="btnInfo"></div>
    </div>
</template>

<script>
import store from '@/store.js'

export default {
    computed: {
        mode() {
            return store.mode
        },
    },
}
</script>

<style lang="scss">
.bottombar {
    position: absolute;
    bottom: 0;
    background: #a8a8a8;
    border: 2px solid #707070;
    width: 100%;
    height: 100px;
    opacity: 0.8;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 10px;
    justify-items: center;
    align-items: center;
}

.btnMute {
    background-image: url('/img/svg/volume.svg');
    background-repeat: no-repeat;
    border: 1px solid black;
    border-radius: 50%;
    width: 50%;
    height: 50%;
    background-position: center;
}
</style>
