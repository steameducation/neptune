<template>
    <div class="bottombar grid">
        <div class="btnMute" @click="toggleMute">
            <FontAwesomeIcon
                class="arrow icon"
                :icon="muted ? 'volume-mute' : 'volume-up'"
            ></FontAwesomeIcon>
        </div>

        <div class="btnLanguage icon" @click="toggleLanguage">
            <div>{{ locale.toUpperCase() }}</div>
        </div>

        <div class="pianoMode" :class="{ hide: appMode !== 'piano' }">
            <FontAwesomeIcon
                icon="arrow-circle-left"
                class="arrow icon"
                @click="changePianoMode(-1)"
            ></FontAwesomeIcon>
            <div class="pianoModeText">
                {{ pianoModeText }}
            </div>
            <FontAwesomeIcon
                icon="arrow-circle-right"
                class="arrow icon"
                @click="changePianoMode(1)"
            ></FontAwesomeIcon>
        </div>

        <div class="appModes">
            <div
                class="appModePiano"
                :class="{ active: appMode === 'piano' }"
                @click="changeMode('piano')"
            >
                <Piano class="modeIcon" :highlight="false" />
            </div>
            <div
                class="appModeNASA"
                :class="{ active: appMode === 'nasa' }"
                @click="changeMode('nasa')"
            >
                <FontAwesomeIcon
                    icon="satellite"
                    class="modeIcon fa-lg icon"
                ></FontAwesomeIcon>
            </div>
            <div
                class="appModeRecord"
                :class="{ active: appMode === 'record' }"
                @click="changeMode('record')"
            >
                <FontAwesomeIcon
                    class="modeIcon icon"
                    icon="microphone"
                ></FontAwesomeIcon>
            </div>
        </div>

        <div
            class="btnPiano"
            :class="{ active: showPiano, hide: appMode !== 'piano' }"
            @click="togglePiano"
        >
            <Piano fill="black" />
        </div>

        <div
            class="btnLock"
            :class="{ active: locked }"
            @click="$emit('lock', !locked)"
        >
            <FontAwesomeIcon
                :icon="locked ? 'lock' : 'unlock'"
                class="icon"
            ></FontAwesomeIcon>
        </div>

        <div class="btnShare" @click="toggleShare">
            <FontAwesomeIcon icon="link" class="icon"></FontAwesomeIcon>
        </div>

        <div class="btnInfo" @click="toggleInfo">
            <FontAwesomeIcon icon="info" class="icon"></FontAwesomeIcon>
        </div>

        <div
            v-show="isFullscreenCapable"
            class="btnFullscreen"
            @click="toggleFullscreen"
        >
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

export default {
    components: {
        Piano,
        Resize,
    },

    computed: {
        pianoMode() {
            return store.pianoMode
        },

        appMode() {
            return store.appMode
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

        locale() {
            return this.$i18n.locale
        },

        isFullscreenCapable() {
            return window.screenfull.enabled
        },

        pianoModeText() {
            const mode = this.$t(`modes.${this.pianoMode}`)
            if (this.pianoMode === 'ionian')
                return mode + ` (${this.$t('major')})`
            else if (this.pianoMode === 'aeolian')
                return mode + ` (${this.$t('minor')})`
            else return mode
        },
    },

    methods: {
        toggleMute() {
            store.muted = !store.muted
            Howler.mute(store.muted)
        },

        togglePiano() {
            store.showPiano = !store.showPiano
        },

        toggleInfo() {
            store.showInfo = !store.showInfo
        },

        toggleShare() {
            // store.showShare = !store.showShare
        },

        toggleFullscreen() {
            window.screenfull.toggle()
        },

        changePianoMode(dir) {
            const idx = store.pianoModes.findIndex(
                pianoMode => pianoMode === store.pianoMode
            )
            const newIdx =
                idx + dir < 0
                    ? store.pianoModes.length - 1
                    : (idx + dir) % store.pianoModes.length
            store.pianoMode = store.pianoModes[newIdx]
        },

        changeMode(appMode) {
            store.appMode = appMode
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
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
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
        font-size: 12px;
        line-height: 26px;
        width: 100%;
    }
    .arrow {
        width: 25px;
        height: 25px;
        margin: 0 8px;
        color: var(--grey);
        &:hover {
            cursor: pointer;
            color: var(--active);
        }
    }
}

.appModePiano,
.appModeRecord,
.appModeNASA {
    &.active {
        .modeIcon {
            &:hover {
                color: white;
            }
        }
    }
}

.appModes {
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
            &:hover {
                // color: white !important;
            }
        }
        .modeIcon {
            width: 100%;
            height: 100%;
            padding: 10px;
            display: flex;
            &:hover {
                color: var(--active);
                fill: var(--active);
            }
        }
        .appModeRecord svg,
        .appModeNASA svg {
            width: 100%;
            height: 50%;
        }
    }
    .appModePiano {
        border-top-left-radius: 30px;
        border-bottom-left-radius: 30px;
        --border-color: var(--greyish);
        border-top: 1px solid var(--border-color);
        border-bottom: 1px solid var(--border-color);
        border-left: 1px solid var(--border-color);
    }
    .appModeNASA {
        border: 1px solid var(--greyish);
    }
    .appModeRecord {
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
            svg {
                color: var(--active);
                fill: var(--active);
            }
            border-color: var(--active); // other hover alternative
            // svg {
            //     color: var(--active);
            //     fill: var(--active); // because maximize
            // }
        }
    }
}

// NOTE: disable share for now
.btnShare {
    &:hover {
        cursor: default;
        border: 1px solid var(--greyish) !important;
        svg {
            color: grey !important;
            &:hover {
                color: grey !important;
            }
        }
    }
    svg {
        color: grey !important;
    }
    fill: grey;
}

.btnLanguage {
    // color: var(--white);
    // }
    &:hover {
        color: var(--active);
    }
}

.hide {
    visibility: hidden;
}

.icon {
    color: white;
}
</style>
