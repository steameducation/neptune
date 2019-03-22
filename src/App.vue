<template>
    <div id="app">
        <div class="stars"></div>
        <!-- <div class="twinkling"></div> -->
        <div id="canvas">
            <svg viewBox="0 0 1920 1080">
                <Planet
                    v-for="(planet, index) in planets"
                    :key="planet.name"
                    :index="index"
                />
                <Piano
                    v-show="showPiano"
                    :width="pianoWidth"
                    :height="pianoHeight"
                    :x="canvas.width - pianoWidth - 25"
                    :y="-12 + 25"
                    :highlight="true"
                    opacity="0.4"
                />
                <Sun />
            </svg>
        </div>
        <Bottombar ref="bottombar" />
        <div v-show="fullscreen" class="grid">
            <div
                class="btnFullscreenClose btnFullscreen"
                @click="toggleFullscreen"
            >
                <FontAwesomeIcon icon="times" color="white"></FontAwesomeIcon>
            </div>
        </div>
        <div v-show="showShare || showInfo" class="overlay">
            <ShareOverlay v-if="showShare" />
            <InfoOverlay v-if="showInfo" />
        </div>
    </div>
</template>

<script>
import Planet from '@/components/Planet.vue'
import Bottombar from '@/components/Bottombar.vue'
import ShareOverlay from '@/components/ShareOverlay.vue'
import InfoOverlay from '@/components/InfoOverlay.vue'
import Piano from '@/components/Piano.vue'
import Sun from '@/components/Sun.vue'

import Vue from 'vue'

import screenfull from 'screenfull'

import store from '@/store.js'
import { sample, random } from 'lodash'

import Recorder from '@/recorder.js'

export default {
    name: 'App',

    components: {
        Planet,
        Piano,
        Sun,
        Bottombar,
        ShareOverlay,
        InfoOverlay,
    },

    computed: {
        planets() {
            return store.planets
        },

        canvas() {
            return store.canvas
        },

        pianoWidth() {
            // return 426.629
            return this.canvas.width * 0.2
        },

        pianoHeight() {
            return 243.788
        },

        showPiano() {
            return store.showPiano
        },

        fullscreen() {
            return store.fullscreen
        },

        showInfo() {
            return store.showInfo
        },

        showShare() {
            return store.showShare
        },

        appMode() {
            return store.appMode
        },
    },

    watch: {
        appMode() {
            if (this.appMode === 'record' && !store.recorder)
                this.initRecorder()
        },

        fullscreen() {
            if (screenfull.enabled) screenfull.toggle()
        },
    },

    created() {
        this.$root.$on('recordStart', this.recordStart)
        this.$root.$on('recordStop', this.recordStop)
        document.addEventListener('keyup', evt => {
            // bottom bar
            if (evt.key === 'l') store.locked = !store.locked
            if (evt.key === 'p') store.showPiano = !store.showPiano
            if (evt.key === 'i') store.showInfo = !store.showInfo
            if (evt.key === 'v') store.muted = !store.muted
            if (evt.key === 'm') {
                if (!evt.shiftKey) this.$refs.bottombar.changePianoMode(1)
                else this.$refs.bottombar.changePianoMode(-1)
            }
            // if (evt.key === 's') store.showShare = !store.showShare
            // if (evt.key === 'f') store.fullscreen = !store.fullscreen

            // app modes
            if (evt.key === 't') this.$refs.bottombar.toggleLanguage()
            if (evt.key === '1') store.appMode = 'piano'
            if (evt.key === '2') store.appMode = 'nasa'
            if (evt.key === '3') store.appMode = 'record'

            // planets
            if (evt.key === 'a') this.$root.$emit('noteOn', 0)
            if (evt.key === 's') this.$root.$emit('noteOn', 1)
            if (evt.key === 'd') this.$root.$emit('noteOn', 2)
            if (evt.key === 'f') this.$root.$emit('noteOn', 3)
            if (evt.key === 'g') this.$root.$emit('noteOn', 4)
            if (evt.key === 'h') this.$root.$emit('noteOn', 5)
            if (evt.key === 'j') this.$root.$emit('noteOn', 6)
            if (evt.key === 'k') this.$root.$emit('noteOn', 7)
        })
    },

    mounted() {
        this.positionPlanetsHorizontally()
        // this.positionPlanetsSequentially()
    },

    methods: {
        positionPlanetsSequentially() {
            for (let i = 0; i < this.planets.length; i++) {
                const x = i * (this.canvas.width / this.planets.length) + 150
                const y = this.canvas.height / 2
                Vue.set(this.planets[i], 'x', x)
                Vue.set(this.planets[i], 'y', y)
            }
        },

        positionPlanetsHorizontally() {
            let indexes = this.planets.map((planet, index) => index)
            for (let i = 0; i < this.planets.length; i++) {
                const r = this.planets[i].size
                const dy =
                    this.canvas.height -
                    2 * r -
                    document.querySelector('.bottombar').clientHeight -
                    20
                const y = random(dy) + r
                const index = sample(indexes)
                indexes = indexes.filter(el => el !== index)
                const x =
                    index * (this.canvas.width / this.planets.length) +
                    this.canvas.width / this.planets.length / 2
                Vue.set(this.planets[i], 'y', y)
                Vue.set(this.planets[i], 'x', x)
            }
        },

        positionPlanetsRandomly() {
            const t0 = performance.now()
            let totalIterations = 0
            for (let i = 0; i < this.planets.length; i++) {
                let overlap
                let iterations = 0
                let x1, y1
                do {
                    overlap = false
                    iterations++

                    const r1 = this.planets[i].size

                    const dx = this.canvas.width - 2 * r1
                    x1 = Math.floor(Math.random() * dx + r1)
                    console.log(x1, this.canvas.width, r1)

                    const dy =
                        this.canvas.height -
                        2 * r1 -
                        document.querySelector('.bottombar').clientHeight -
                        20
                    y1 = Math.floor(Math.random() * dy + r1)

                    console.log({ x1, y1 })

                    for (let j = 0; j < i; j++) {
                        const x2 = this.planets[j].x
                        const y2 = this.planets[j].y
                        const r2 = this.planets[j].size
                        const d = Math.sqrt(
                            Math.abs(x1 - x2) ** 2 + Math.abs(y1 - y2) ** 2
                        )
                        if (d < 2 * r1 + 2 * r2) {
                            overlap = true
                            break
                        }
                    }
                } while (overlap && iterations < 1000)
                Vue.set(this.planets[i], 'x', x1)
                Vue.set(this.planets[i], 'y', y1)
                console.log(
                    `Took ${iterations} iterations for planet ${
                        this.planets[i].name
                    }`
                )
                totalIterations += iterations

                console.log({ totalIterations })
                const t1 = performance.now()
                console.log(`Took ${t1 - t0} miliseconds`)
            }
        },

        toggleFullscreen() {
            screenfull.toggle()
        },

        setRecordingTimeout() {
            store.recordingTimeout = window.setTimeout(() => {
                console.log(
                    'timeout of 5 seconds reached, so forcefully stopping the recording'
                )
                store.recording = false
            }, 5000)
        },

        clearRecordingTimeout() {
            console.log('clearing recording timeout')
            window.clearTimeout(store.recordingTimeout)
        },

        initRecorder() {
            console.log('initting recorder')
            store.recorder = new Recorder(5000) // max timeout of 5 seconds
        },
    },
}
</script>

<style lang="scss">
@import 'assets/styles/globals';
@import 'assets/styles/starry';

#app {
    // font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-family: 'Space Mono', monospace;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    margin-top: 60px;
    --ratio: calc(16 / 9); // TODO: this should be inferred from image
    --percentage: 95; // percentage of viewport to use (better than using 100%)
    width: calc(var(--percentage) * 1vw);
    height: calc(1 / var(--ratio) * 95vw);
    max-height: calc(var(--percentage) * 1vh);
    max-width: calc(var(--ratio) * var(--percentage) * 1vh);
    margin: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border: 1px solid lightgrey;
}

#canvas,
.overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
}

.grid {
    position: absolute;
    bottom: 0;
    right: 0;
}

.btnFullscreenClose {
    grid-column: -2;
    border: 0;
    &:hover {
        svg {
            color: var(--active) !important;
        }
    }
}

.overlay {
    background: black;
    opacity: 0.8;
    color: var(--active);
}
</style>
