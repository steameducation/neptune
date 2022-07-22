<template>
  <div id="bottombar" class="grid">
    <!-- <div id="btnMute" class="btnIcon" @click="toggleMute">
            <FontAwesomeIcon
                class="arrow icon"
                :icon="muted ? 'volume-mute' : 'volume-up'"
            ></FontAwesomeIcon>
        </div> -->

    <div id="btnSequence" class="btnIcon" @click="toggleSequence">
      <FontAwesomeIcon
        class="arrow icon"
        :icon="sequencing ? 'pause' : 'play'"
      ></FontAwesomeIcon>
    </div>

    <div id="btnLanguage" class="btnIcon" @click="toggleLanguage">
      <div>{{ locale.toUpperCase() }}</div>
    </div>

    <div id="pianoMode" :class="{ hide: appMode !== 'piano' }">
      <FontAwesomeIcon
        icon="arrow-circle-left"
        class="arrow icon"
        @click="changePianoMode(-1)"
      ></FontAwesomeIcon>
      <div id="pianoModeText">{{ pianoModeText }}</div>
      <FontAwesomeIcon
        icon="arrow-circle-right"
        class="arrow icon"
        @click="changePianoMode(1)"
      ></FontAwesomeIcon>
    </div>

    <div id="appModes">
      <div
        id="appModePiano"
        class="appMode"
        :class="{ active: appMode === 'piano' }"
        @click="changeMode('piano')"
      >
        <Piano class="appModeIcon" :highlight="false" />
      </div>

      <div
        id="appModeNASA"
        class="appMode"
        :class="{ active: appMode === 'nasa' }"
        @click="changeMode('nasa')"
      >
        <FontAwesomeIcon
          class="appModeIcon icon"
          icon="satellite"
        ></FontAwesomeIcon>
      </div>

      <div
        id="appModeRecord"
        class="appMode"
        :class="{ active: appMode === 'record' }"
        @click="changeMode('record')"
      >
        <FontAwesomeIcon
          class="appModeIcon icon"
          icon="microphone"
        ></FontAwesomeIcon>
      </div>
    </div>

    <div
      id="btnShare"
      class="btnIcon"
      :class="{ isMobile: isMobile }"
      style="visibility: hidden"
      @click="toggleShare"
    >
      <FontAwesomeIcon icon="link" class="icon"></FontAwesomeIcon>
    </div>

    <div
      id="btnPiano"
      class="btnIcon"
      :class="{ active: showPiano, hide: appMode !== 'piano' }"
      @click="togglePiano"
    >
      <Piano fill="black" />
    </div>

    <div
      id="btnLock"
      class="btnIcon"
      :class="{ active: locked }"
      @click="$emit('lock', !locked)"
    >
      <FontAwesomeIcon
        :icon="locked ? 'lock' : 'unlock'"
        class="icon"
      ></FontAwesomeIcon>
    </div>

    <div id="btnInfo" class="btnIcon" @click="toggleInfo">
      <FontAwesomeIcon icon="info" class="icon"></FontAwesomeIcon>
    </div>

    <div
      v-show="isFullscreenCapable"
      id="btnFullscreen"
      class="btnIcon"
      :class="{ hide: isPwa }"
      @click="toggleFullscreen"
    >
      <!-- <FontAwesomeIcon
                :icon="fullscreen ? 'compress' : 'expand'"
                class="icon"
      ></FontAwesomeIcon>-->
      <Resize :expand="!fullscreen" />
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
  faCompress,
  faTimes,
  faMicrophone,
  faSatellite,
  faPlay,
  faPause,
  faClipboard,
} from '@fortawesome/free-solid-svg-icons'

import {
  faFacebookF,
  faTwitter,
  faFacebookSquare,
} from '@fortawesome/fontawesome-free-brands'

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
  faCompress,
  faTimes,
  faMicrophone,
  faSatellite,
  faFacebookF,
  faFacebookSquare,
  faTwitter,
  faPlay,
  faPause,
  faClipboard
)
Vue.component('FontAwesomeIcon', FontAwesomeIcon)

import { Howler } from 'howler'
import utils from '@/utils.js'

export default {
  components: {
    Piano,
    Resize,
  },

  computed: {
    isPwa() {
      return store.isPwa
    },

    isMobile() {
      return store.isMobile
    },

    fullscreen() {
      return store.fullscreen
    },

    sequencing() {
      return store.sequencing
    },

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
      // if (this.pianoMode === 'ionian')
      //     return mode + ` (${this.$t('major')})`
      // else if (this.pianoMode === 'aeolian')
      //     return mode + ` (${this.$t('minor')})`
      // else return mode
      return mode
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
      store.showShare = !store.showShare
    },

    toggleSequence() {
      store.sequencing = !store.sequencing
    },

    toggleFullscreen() {
      window.screenfull.toggle()
    },

    changePianoMode(step) {
      const idx = store.pianoModes.findIndex(
        (pianoMode) => pianoMode === store.pianoMode
      )
      const newIdx = utils.modulo(idx + step, store.pianoModes.length)
      store.pianoMode = store.pianoModes[newIdx]
    },

    changeMode(appMode) {
      store.appMode = appMode
    },

    toggleLanguage() {
      const idx = store.locales.findIndex(
        (locale) => locale === this.$i18n.locale
      )
      this.$i18n.locale = store.locales[(idx + 1) % store.locales.length]
    },
  },
}
</script>

<style lang="scss">
:root {
  --icon-size: 36px;
  --icon-padding: 10px;
}

#bottombar {
  &.grid {
    display: grid;
    grid-template-columns: repeat(14, 1fr);
    justify-items: center;
    align-items: center;
    width: 100%;
    // height: calc(max(50px, 20%));
    bottom: 0;
    position: absolute;
    // grid-gap: 10px;
  }
  background: rgba(168, 168, 168, 0.2);
  opacity: 0.8;
  border-top: 1px solid var(--greyish);
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}

#pianoMode {
  grid-column: span 3;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  #pianoModeText {
    background: var(--white);
    border-radius: 15px;
    width: 100%;
    max-width: 150px;
    color: var(--greyish);
    height: calc(0.5 * var(--icon-size));
    line-height: calc(0.5 * var(--icon-size));
    font-size: 11px;
  }
  .arrow {
    width: calc(0.5 * var(--icon-size));
    height: calc(0.5 * var(--icon-size));
    margin: 0 8px;
    color: var(--grey);
    &:hover {
      cursor: pointer;
      color: var(--active);
    }
  }
}

#appModes {
  display: flex;
  align-items: center;
  justify-content: center;
  grid-column: span 4;
  // height: calc(1.5 * var(--icon-size));
  padding: 5px;
  &:hover {
    cursor: pointer;
  }
  .appMode {
    width: calc(1.4 * var(--icon-size));
    height: calc(1.4 * var(--icon-size));
    &.active {
      background: var(--active);
      .appModeIcon:hover {
        color: white;
      }
    }
    .appModeIcon {
      width: var(--icon-size);
      height: var(--icon-size);
      width: 100%;
      height: 100%;
      padding: var(--icon-padding);
      &:hover {
        color: var(--active);
      }
    }
  }
  #appModePiano {
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
    --border-color: var(--greyish);
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    border-left: 1px solid var(--border-color);
  }
  #appModeNASA {
    border: 1px solid var(--greyish);
  }
  #appModeRecord {
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
    border-top: 1px solid var(--greyish);
    border-bottom: 1px solid var(--greyish);
    border-right: 1px solid var(--greyish);
  }
}

.btnIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  fill: var(--white);
  border: 1px solid var(--greyish);
  border-radius: 50%;
  width: var(--icon-size);
  height: var(--icon-size);
  padding: 10px;
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
    }
  }
  *:focus {
    outline: none;
  }
}
#btnLanguage {
  font-size: 11px;
  color: white;
  &:hover {
    color: var(--active);
  }
}

.icon {
  color: white;
}

.hide {
  visibility: hidden;
}
</style>
