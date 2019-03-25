<template>
    <div id="app">
        <div class="stars"></div>
        <div id="canvas">
            <svg viewBox="0 0 1920 1080">
                <defs>
                    <filter id="greyscale">
                        <feColorMatrix
                            type="matrix"
                            values="0.33 0.33 0.33 0 0
                             0.33 0.33 0.33 0 0
                             0.33 0.33 0.33 0 0
                             0 0 0 1 0"
                        />
                    </filter>
                </defs>
                <Sun />
                <Piano
                    v-show="showPiano && appMode === 'piano'"
                    :width="pianoWidth"
                    :height="pianoHeight"
                    :x="canvas.width - pianoWidth - 25"
                    :y="-12 + 25"
                    :highlight="true"
                    opacity="0.4"
                />
                <Planet
                    v-for="planet in planets"
                    :key="planet.name"
                    :name="planet.name"
                    @interaction="interaction"
                />
            </svg>
        </div>
        <Bottombar v-show="!fullscreen" ref="bottombar" @lock="lock" />
        <FontAwesomeIcon
            icon="times"
            class="btnFullscreenClose btnFullscreen"
            color="white"
            @click="toggleFullscreen"
        ></FontAwesomeIcon>
        <div v-if="showShare || showInfo" class="overlay">
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

import utils from '@/utils.js'
import Draggable from 'gsap/Draggable'

import store from '@/store.js'
import { sample, random, debounce } from 'lodash'
import { Howler } from 'howler'

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

    data() {
        return {
            maxDragHeight: 0,
            lastInteractedPlanetId: 'mercury',
        }
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
            // return window.screenfull.isFullscreen // NOTE: can't get this one to work!
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

        locked() {
            return store.locked
        },
    },

    watch: {
        appMode(newMode, oldMode) {
            console.log({ oldMode, newMode })
            if (this.appMode === 'record' && !store.recorder)
                this.initRecorder()

            if (oldMode === 'nasa') {
                Object.keys(store.soundscapes).forEach(soundscapeKey => {
                    if (store.soundscapes[soundscapeKey].playing()) {
                        store.soundscapes[soundscapeKey].fade(1, 0, 500)
                        setTimeout(() => {
                            store.soundscapes[soundscapeKey].stop()
                        }, 500)
                    }
                })
            } else if (oldMode === 'piano') {
                Object.keys(store.sounds).forEach(pianoKey => {
                    if (store.sounds[pianoKey].playing()) {
                        store.sounds[pianoKey].fade(1, 0, 500)
                        setTimeout(() => {
                            store.sounds[pianoKey].stop()
                        }, 500)
                    }
                })
            }
        },

        lastInteractedPlanetId() {
            Howler.ctx.resume()
            utils.swap(
                store.planets,
                store.planets.length - 1,
                store.planets.findIndex(
                    planet => planet.name === this.lastInteractedPlanetId
                )
            )
            // const planets = new Array.length()
            // store.planets.forEach(planet => {
            //     if (planet.name === lastInteractedPlanetId)
            // })
        },

        maxDragHeight() {
            console.log('maxDragHeight is now', this.maxDragHeight)
        },

        locked() {
            this.planets.forEach(planet => {
                if (this.locked) planet.draggable.disable()
                else planet.draggable.enable()
            })
        },
    },

    created() {
        this.$root.$on('recordStart', this.recordStart)
        this.$root.$on('recordStop', this.recordStop)
        this.initKeyboardShortcuts()
        window.screenfull.on('change', () => {
            store.fullscreen = window.screenfull.isFullscreen
            this.updateDragBounds()
        })
        window.addEventListener('resize', () => {
            this.updateDragBounds()
        })

        window.utils = utils
    },

    mounted() {
        // this.positionPlanetsHorizontally()
        this.positionPlanetsSequentially()
        // this.setPlanetPosition('neptune', 800, 400)
        this.initDraggables()
        this.updateDragBounds()
        console.log('app finished mounting')
    },

    methods: {
        initDraggables() {
            for (let i = 0; i < store.planets.length; i++) {
                const name = store.planets[i].name
                store.planets[i].draggable = Draggable.create(
                    `#planet-${name}`,
                    {
                        allowEventDefault: true,
                        cursor: 'pointer',
                        onDrag: () => {
                            if (store.locked) {
                                console.log('returning because locked')
                                return
                            } else {
                                console.log('store not locked', store.locked)
                            }
                            console.log('this drag')
                            this.interaction(name)
                            const y =
                                document.querySelector(`#planet-${name}`)
                                    .transform.baseVal[0].matrix.f -
                                store.planets[i].size

                            const height = window.screenfull.isFullscreen
                                ? store.canvas.height - store.planets[i].size
                                : store.canvas.height -
                                  2 * store.planets[i].size

                            // console.log({ height, y })
                            const mapped = utils.map(y, 0, height, 1, 0.01)
                            store.planets[i].amplitude =
                                mapped >= 1 ? 1 : mapped
                            console.log({ mapped })
                            console.log('amplitude', store.planets[i].amplitude)
                            this.$root.$emit('amplitude', {
                                name,
                                amplitude: mapped,
                            })
                        },
                    }
                )[0]
            }
        },

        interaction(evt) {
            console.log('interaction callback')
            this.lastInteractedPlanetId = evt
        },

        lock(evt) {
            store.locked = evt
        },

        resize() {
            console.log('resizing')
            debounce(() => {
                console.log('resizing')
            }, 100)
        },

        initKeyboardShortcuts() {
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

        getMaxDragHeight() {
            if (this.fullscreen) {
                return this.canvas.height
            } else {
                try {
                    const h1 = document.querySelector('.bottombar').clientHeight
                    const h2 = document.querySelector('#canvas').clientHeight
                    let ret = (1 - h1 / h2) * this.canvas.height - 18
                    return ret
                } catch (e) {
                    console.log('failing silently', e)
                    return this.canvas.height
                }
            }
        },

        updateDragBounds() {
            const maxDragHeight = this.getMaxDragHeight()
            store.planets.forEach(planet => {
                planet.draggable.applyBounds({
                    top: 0,
                    left: 0,
                    width: this.canvas.width,
                    height: maxDragHeight,
                })
            })
        },

        positionPlanetsSequentially() {
            for (let i = 0; i < this.planets.length; i++) {
                const x = i * (this.canvas.width / this.planets.length) + 150
                const y = this.canvas.height / 2
                this.setPlanetPosition(this.planets[i].name, x, y)
            }
        },

        setPlanetPosition(name, x, y) {
            // x and y attr
            // Vue.set(this.planets[i], 'x', x)
            // Vue.set(this.planets[i], 'y', y)

            // with transforms
            const planet = document.querySelector(`#planet-${name}`)
            planet.setAttribute('transform', `matrix(1,0,0,1,${x},${y})`)
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
                this.setPlanetPosition(this.planets[i].name, x, y)
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
            window.screenfull.toggle()
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
    // margin-top: 60px;
    --ratio: calc(16 / 9); // TODO: this should be inferred from image
    --percentage: 100; // percentage of viewport to use (better than using 100%)
    width: calc(var(--percentage) * 1vw);
    height: calc(1 / var(--ratio) * var(--percentage) * 1vw);
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

.stars,
#app {
    --border-radius: 0;
    border-radius: var(--border-radius);
    border: none;
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
    color: var(--active);
    // opacity: 0.94;
    width: 100%;
}
</style>
