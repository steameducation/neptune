<template>
    <div class="bottombar">
        <div class="btnMute">
            <!-- <Volume /> -->
            <FontAwesomeIcon icon="volume-up" color="white"></FontAwesomeIcon>
        </div>

        <div class="pianoMode">
            <!-- <Arrow
                orientation="left"
                class="arrow"
                @click.native="changePianoMode(-1)"
            /> -->
            <FontAwesomeIcon
                icon="arrow-circle-left"
                color="white"
                @click.native="changePianoMode(-1)"
            ></FontAwesomeIcon>
            <div class="pianoModeText">
                {{ pianoMode }}
            </div>
            <FontAwesomeIcon
                icon="arrow-circle-right"
                color="white"
                @click.native="changePianoMode(1)"
            ></FontAwesomeIcon>
            <!-- <Arrow
                orientation="right"
                class="arrow"
                @click.native="changePianoMode(1)"
            /> -->
        </div>

        <div class="modes">
            <div
                class="modePiano"
                :class="{ active: mode === 'piano' }"
                @click="changeMode('piano')"
            >
                <Piano width="50" height="50" />
            </div>
            <div
                class="modeNASA"
                :class="{ active: mode === 'nasa' }"
                @click="changeMode('nasa')"
            >
                <img src="/img/svg/nasa.svg" alt="" />
            </div>
            <div
                class="modeRecord"
                :class="{ active: mode === 'record' }"
                @click="changeMode('record')"
            >
                <img src="/img/svg/microphone.svg" alt="" />
            </div>
        </div>

        <div class="btnPiano" @click="togglePiano">
            <Piano width="50px" height="50px" />
        </div>

        <div class="btnLock" :class="{ active: locked }" @click="toggleLock">
            <!-- <Lock :locked="locked" /> -->
            <FontAwesomeIcon
                :icon="locked ? 'unlock' : 'lock'"
                color="white"
            ></FontAwesomeIcon>
        </div>

        <div class="btnShare" @click="toggleShare">
            <!-- <Share /> -->
            <FontAwesomeIcon icon="link" color="white"></FontAwesomeIcon>
        </div>

        <div class="btnFullscreen" @click="toggleFullscreen">
            <!-- <Resize /> -->
        </div>

        <div class="btnInfo" @click="toggleInfo">
            <FontAwesomeIcon icon="info" color="white"></FontAwesomeIcon>
            <!-- <Info /> -->
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import store from '@/store.js'

import Piano from '@/components/Piano'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faInfo,
    faVolumeMute,
    faVolumeOff,
    faVolumeUp,
    faVolumeDown,
    faLock,
    faUnlock,
    faShare,
    faShareSquare,
    faLink,
    faArrowCircleLeft,
    faArrowCircleRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(
    faInfo,
    faVolumeMute,
    faVolumeOff,
    faVolumeUp,
    faVolumeDown,
    faLock,
    faUnlock,
    faShare,
    faShareSquare,
    faLink,
    faArrowCircleLeft,
    faArrowCircleRight
)
Vue.component('FontAwesomeIcon', FontAwesomeIcon)

import { Howler } from 'howler'
import screenfull from 'screenfull'

export default {
    components: {
        Piano,
    },

    computed: {
        pianoMode() {
            return store.pianoMode
        },

        mode() {
            return store.mode
        },

        locked() {
            return store.locked
        },

        muted() {
            return Howler.mute()
        },
    },

    methods: {
        toggleMute() {
            Howler.mute(!Howler.mute())
        },

        togglePiano() {
            store.showPiano = !store.showPiano
        },

        toggleLock() {
            store.locked = !store.locked
        },

        toggleInfo() {
            store.showInfo = !store.showInfo
        },

        toggleShare() {
            store.showShare = !store.showShare
        },

        toggleFullscreen() {
            if (screenfull.enabled) screenfull.toggle()
        },

        changePianoMode(dir) {
            const idx = store.modes.findIndex(mode => mode === store.mode)
            if (idx + dir < 0 || idx + dir >= store.modes.length) return
            store.mode = store.modes[idx + dir]
        },

        changeMode(mode) {
            store.mode = mode
        },
    },
}
</script>

<style lang="scss">
.bottombar {
    position: absolute;
    bottom: 0;
    background: rgba(168, 168, 168, 0.2);
    border-top: 1px solid var(--greyish);
    width: 100%;
    height: 100px;
    opacity: 0.8;
    display: grid;
    grid-template-columns: repeat(14, 1fr);
    grid-gap: 10px;
    justify-items: center;
    align-items: center;
}

.pianoMode {
    grid-column: span 4;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .pianoModeText {
        background: var(--white);
        border-radius: 15px;
        width: 50%;
        color: var(--greyish);
        height: 26px;
    }
    .arrow {
        width: 30px;
        margin: 0 10px;
        fill: var(--grey);
    }
}

.modes {
    display: flex;
    align-items: center;
    justify-content: center;
    grid-column: span 4;
    height: 65px;
    &:hover {
        cursor: pointer;
    }
    div {
        width: 80px;
        background: var(--white);
        border: 1px solid black;
        &.active {
            background: var(--active);
        }
        img {
            width: 50px;
            height: 50px;
        }
    }
    .modePiano {
        border-top-left-radius: 50%;
        border-bottom-left-radius: 50%;
    }
    .modeRecord {
        border-top-right-radius: 50%;
        border-bottom-right-radius: 50%;
    }
}

.btnMute,
.btnPiano,
.btnLock,
.btnShare,
.btnFullscreen,
.btnInfo {
    width: 30px;
    height: 30px;
    fill: var(--white);
    border: 1px solid var(--greyish);
    border-radius: 50%;
    width: 52px;
    height: 52px;
    padding: 15px;
    &.active {
        background: var(--active);
    }
    &:hover {
        cursor: pointer;
        &:not(.active) {
            border-color: var(--active);
        }
    }
}
</style>
