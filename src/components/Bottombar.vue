<template>
    <div class="bottombar grid" :class="{ fullscreen: fullscreen }">
        <div class="btnMute" @click="toggleMute">
            <FontAwesomeIcon
                class="arrow"
                :icon="muted ? 'volume-mute' : 'volume-up'"
                color="white"
            ></FontAwesomeIcon>
        </div>

        <div class="btnLanguage" @click="toggleLanguage">
            <div>{{ locale.toUpperCase() }}</div>
        </div>

        <div class="pianoMode" :class="{ hide: mode !== 'piano' }">
            <FontAwesomeIcon
                icon="arrow-circle-left"
                color="white"
                class="arrow"
                @click="changePianoMode(-1)"
            ></FontAwesomeIcon>
            <div class="pianoModeText">
                {{ $t(`modes.${pianoMode}`) }}
            </div>
            <FontAwesomeIcon
                icon="arrow-circle-right"
                color="white"
                class="arrow"
                @click="changePianoMode(1)"
            ></FontAwesomeIcon>
        </div>

        <div class="modes">
            <div
                class="modePiano"
                :class="{ active: mode === 'piano' }"
                @click="changeMode('piano')"
            >
                <Piano class="modeIcon" :highlight="false" />
            </div>
            <div
                class="modeNASA"
                :class="{ active: mode === 'nasa' }"
                @click="changeMode('nasa')"
            >
                <FontAwesomeIcon
                    icon="satellite"
                    color="white"
                    class="modeIcon fa-lg"
                ></FontAwesomeIcon>
            </div>
            <div
                class="modeRecord"
                :class="{ active: mode === 'record' }"
                @click="changeMode('record')"
            >
                <FontAwesomeIcon
                    class="modeIcon"
                    icon="microphone"
                    color="white"
                ></FontAwesomeIcon>
            </div>
        </div>

        <div
            class="btnPiano"
            :class="{ active: showPiano, hide: mode !== 'piano' }"
            @click="togglePiano"
        >
            <Piano fill="black" />
        </div>

        <div class="btnLock" :class="{ active: locked }" @click="toggleLock">
            <FontAwesomeIcon
                :icon="locked ? 'unlock' : 'lock'"
                color="white"
            ></FontAwesomeIcon>
        </div>

        <div class="btnShare" @click="toggleShare">
            <FontAwesomeIcon icon="link" color="white"></FontAwesomeIcon>
        </div>

        <div class="btnInfo" @click="toggleInfo">
            <FontAwesomeIcon icon="info" color="white"></FontAwesomeIcon>
        </div>

        <div class="btnFullscreen" @click="toggleFullscreen">
            <!-- <FontAwesomeIcon icon="expand" color="white"></FontAwesomeIcon> -->
            <Resize />
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import store from '@/store.js'

import Piano from '@/components/Piano'
import Resize from '@/components/Resize'

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
    faExpand,
    faTimes,
    faMicrophone,
    faSatellite,
} from '@fortawesome/free-solid-svg-icons'

import { faFacebookF, faTwitter } from '@fortawesome/fontawesome-free-brands'

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
    faArrowCircleRight,
    faExpand,
    faTimes,
    faMicrophone,
    faSatellite,
    faFacebookF,
    faTwitter
)
Vue.component('FontAwesomeIcon', FontAwesomeIcon)

import { Howler } from 'howler'
import screenfull from 'screenfull'

window.screenfull = screenfull

export default {
    components: {
        Piano,
        Resize,
    },

    filters: {
        modify(mode) {
            if (mode === 'ionian') return mode + ' (major)'
            else if (mode === 'aeolian') return mode + ' (minor)'
            else return mode
        },
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
            return store.muted
        },

        showPiano() {
            return store.showPiano
        },

        fullscreen() {
            return store.fullscreen
        },

        locale() {
            return this.$i18n.locale
        },
    },

    watch: {
        fullscreen() {
            console.log('fullscreen is now', this.fullscreen)
        },
    },

    created() {
        // NOTE: computed property is not picking up change automatically
        screenfull.on('change', () => {
            store.fullscreen = screenfull.isFullscreen
        })
    },

    methods: {
        toggleMute() {
            store.muted = !store.muted
            Howler.mute(store.muted)
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
            const idx = store.pianoModes.findIndex(
                mode => mode === store.pianoMode
            )
            const newIdx =
                idx + dir < 0
                    ? store.pianoModes.length - 1
                    : (idx + dir) % store.pianoModes.length
            store.pianoMode = store.pianoModes[newIdx]
        },

        changeMode(mode) {
            store.mode = mode
        },

        toggleLanguage() {
            const idx = store.locales.findIndex(
                locale => locale === this.$i18n.locale
            )
            this.$i18n.locale = store.locales[(idx + 1) % store.locales.length]
        },
    },
}
</script>

<style lang="scss">
.grid {
    display: grid;
    grid-template-columns: repeat(14, 1fr);
    grid-gap: 10px;
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 100px;
    bottom: 0;
    position: absolute;
}

.bottombar {
    background: rgba(168, 168, 168, 0.2);
    border-top: 1px solid var(--greyish);
    opacity: 0.8;
    &.fullscreen {
        display: none;
    }
}

.pianoMode {
    grid-column: span 3;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .pianoModeText {
        background: var(--white);
        border-radius: 15px;
        width: 50%;
        color: var(--greyish);
        height: 26px;
        font-size: 14px;
        line-height: 26px;
    }
    .arrow {
        width: 25px;
        height: 25px;
        margin: 0 8px;
        color: var(--grey);
        &:hover {
            cursor: pointer;
        }
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
        width: 65px;
        height: 55px;
        // background: var(--white);
        &.active {
            background: var(--active);
        }
        .modeIcon {
            width: 100%;
            height: 100%;
            padding: 10px;
            display: flex;
        }
        .modeRecord svg,
        .modeNASA svg {
            width: 100%;
            height: 50%;
        }
    }
    .modePiano {
        border-top-left-radius: 30px;
        border-bottom-left-radius: 30px;
        --border-color: var(--greyish);
        border-top: 1px solid var(--border-color);
        border-bottom: 1px solid var(--border-color);
        border-left: 1px solid var(--border-color);
    }
    .modeNASA {
        border: 1px solid var(--greyish);
    }
    .modeRecord {
        img {
            padding: 10px;
        }
        border-top-right-radius: 30px;
        border-bottom-right-radius: 30px;
        border-top: 1px solid var(--greyish);
        border-bottom: 1px solid var(--greyish);
        border-right: 1px solid var(--greyish);
    }
}

.btnMute,
.btnLanguage,
.btnPiano,
.btnLock,
.btnShare,
.btnFullscreen,
.btnInfo {
    display: flex;
    align-items: center;
    justify-content: center;
    fill: var(--white);
    border: 1px solid var(--greyish);
    border-radius: 50%;
    width: 55px;
    height: 55px;
    padding: 15px;
    svg {
        width: 100%;
        height: 100%;
    }
    &.active {
        background: var(--active);
    }
    &:hover {
        cursor: pointer;
        &:not(.active) {
            border-color: var(--active); // other hover alternative
            // svg {
            //     color: var(--active);
            //     fill: var(--active); // because maximize
            // }
        }
    }
}

.btnLanguage {
    color: var(--white);
}

.hide {
    visibility: hidden;
}
</style>
