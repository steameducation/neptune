<template>
    <div id="app" :class="{ hide: !loaded, 'prevent-scrolling': fullscreen }">
        <div class="stars">
            <h1>lorem</h1>
            <!-- FIXME: think this is how Google Fonts works, so just requests font for headings when needed, so force request here so that when overlay shows up it is already loaded. fix later somehow more elantly. the images preload too -->
        </div>
        <div id="canvas" ref="canvas">
            <svg viewBox="0 0 1920 1080">
                <Sun></Sun>
                <Piano
                    v-show="showPiano && appMode === 'piano'"
                    :width="pianoWidth"
                    :height="pianoHeight"
                    :x="canvas.width - pianoWidth - 25"
                    :y="-12 + 25"
                    :highlight="true"
                    opacity="0.4"
                ></Piano>
                <Planet
                    v-for="planet in planets"
                    :key="planet.name"
                    :name="planet.name"
                    class="myPlanet"
                    @interaction="interaction"
                ></Planet>
                <!-- FIXME: -->
                <circle id="ball" cx="300" cy="300" r="50" fill="red"></circle>
            </svg>
        </div>
        <Bottombar ref="bottombar" @lock="lock" />
        <ShareOverlay v-show="showShare" class="overlay stars" />
        <InfoOverlay v-show="showInfo" class="overlay stars" />
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
import { api } from '@/store.js'

import { sample, random } from 'lodash'
import { Howler } from 'howler'

import WebMidi from 'webmidi'
import teoria from 'teoria'

import Recorder from '@/recorder.js'

import isUUID from 'validator/lib/isUUID'

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
            timeouts: [],
        }
    },

    computed: {
        loaded() {
            return (
                store.allNoteSoundsLoaded &&
                store.allPlanetSoundsLoaded &&
                store.allSunSoundsLoaded
            )
        },

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

        sequencing() {
            return store.sequencing
        },
    },

    watch: {
        sequencing() {
            console.log('sequencing changed to', this.sequencing)
            if (!store.sequencing) {
                this.timeouts.forEach(timeout => clearTimeout(timeout))
                return
            }

            this.timeouts = []
            if (store.sequencing) this.setTimeouts()
        },

        loaded() {
            if (this.loaded) {
                // store.showShare = false // NOTE: Hack so that twitter button gets properly styled
                setTimeout(() => {
                    document.querySelector('.loading').remove()
                    setTimeout(() => {
                        // store.sequencing = true
                    }, 1000)
                }, 200)
            }
        },

        appMode(newMode, oldMode) {
            document.querySelectorAll('circle').forEach(el => {
                el.classList.remove('hasRecording')
                el.classList.remove('active')
            })

            if (store.sequencing) store.sequencing = false

            if (this.appMode === 'record' && !store.recorder)
                this.initRecorder()

            const dur = 500 // 500 miliseconds for fadeout when changing modes
            if (oldMode === 'nasa') {
                Object.keys(store.soundscapes).forEach(soundscapeKey => {
                    const sound = store.soundscapes[soundscapeKey]
                    if (sound.playing()) {
                        sound.fade(sound.volume(), 0, dur)
                        setTimeout(() => {
                            sound.stop()
                            this.$root.$emit('noteClear')
                            this.$root.$emit('pianoClear')
                        }, dur)
                    }
                })
            } else if (oldMode === 'piano') {
                Object.keys(store.sounds).forEach(pianoKey => {
                    const sound = store.sounds[pianoKey]
                    if (sound.playing()) {
                        sound.fade(sound.volume(), 0, dur)
                        setTimeout(() => {
                            sound.stop()
                            this.$root.$emit('noteClear')
                            this.$root.$emit('pianoClear')
                        }, dur)
                    }
                })
            } else if (oldMode === 'record') {
                store.recordings = {}
            }
        },

        locked() {
            this.planets.forEach(planet => {
                if (this.locked) planet.draggable.disable()
                else planet.draggable.enable()
            })
        },
    },

    created() {
        if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            store.isMobile = true
        }

        store.isPwa =
            new URLSearchParams(window.location.search).get('utm_source') ===
            'homescreen'
        this.$root.$on('recordStart', this.recordStart)
        this.$root.$on('recordStop', this.recordStop)
        this.initKeyboardShortcuts()
        if (window.screenfull.enabled) {
            window.screenfull.on('change', () => {
                store.fullscreen = window.screenfull.isFullscreen
                this.updateDragBounds()
            })
        }

        if (this.appMode === 'record') this.initRecorder()

        this.initMidi()
        window.WebMidi = WebMidi

        this.removeHoverFromCss()
    },

    mounted() {
        // setTimeout(() => {
        //     store.showShare = false // NOTE: Hack so that twitter button gets properly styled
        // }, 500)

        this.initShake()

        window.addEventListener('resize', () => {
            this.updateDragBounds()
        })

        // this.positionPlanetsRandomly()
        this.positionPlanetsHorizontally()
        // this.positionPlanetsSequentially()

        this.initDraggables()
        this.updateDragBounds()

        // FIXME: a weird way to fix dragging in chrome android.. not sure why
        // this is happen. will need to figure it out later. Something to do
        // with the z-index or similar, since if this isn't used we can pull to
        // refresh, but with this fix we can't. just if selecting outside of the
        // svg canvas
        // Draggable.create('#ball')
        Draggable.create('.myPlanet')
        document.querySelector('#ball').remove()

        const parts = window.location.href.split('/')
        const possibleUUID = parts.pop() || parts.pop() // handle potential trailing slash
        if (isUUID(possibleUUID, 4)) {
            console.log(
                'Starting app with an UUID. Going to check if exists in database'
            )
            this.loadUUID(possibleUUID)
            // setTimeout(() => {
            //     store.sequencing = true
            // }, 10000)
        }

        const compress = true
        // Create a compressor node
        if (compress) {
            // NOTE: https://stackoverflow.com/questions/32460123/connect-analyzer-to-howler-sound/39651062#39651062
            // using default tone.js values
            const compressor = Howler.ctx.createDynamicsCompressor()
            compressor.ratio.setValueAtTime(30, Howler.ctx.currentTime)
            compressor.threshold.setValueAtTime(-24, Howler.ctx.currentTime)
            compressor.release.setValueAtTime(0.1, Howler.ctx.currentTime)
            compressor.attack.setValueAtTime(0.001, Howler.ctx.currentTime)
            compressor.knee.setValueAtTime(30, Howler.ctx.currentTime)

            // Apply compressor in between Howler masterGain and destination
            Howler.masterGain.connect(compressor)
            // compressor.connect(Howler.ctx.destination)
        }

        function absorbEvent_(event) {
            var e = event || window.event
            e.preventDefault && e.preventDefault()
            e.stopPropagation && e.stopPropagation()
            e.cancelBubble = true
            e.returnValue = false
            return false
        }

        function preventLongPressMenu(node) {
            node.ontouchstart = absorbEvent_
            node.ontouchmove = absorbEvent_
            node.ontouchend = absorbEvent_
            node.ontouchcancel = absorbEvent_
        }

        // NOTE: very werid bug.. release is being triggered after ~300ms-500ms on its own just after a click on mobile devices
        // For more info check:
        // - https://greensock.com/forums/topic/16979-draggable-onrelease-fires-in-mobile-device-after-a-moment/
        // - https://stackoverflow.com/questions/3413683/disabling-the-context-menu-on-long-taps-on-android
        function init() {
            const elems = document.querySelectorAll('.planet')
            elems.forEach(elem => preventLongPressMenu(elem))
        }
        init()
    },

    methods: {
        setTimeouts() {
            const width = this.$root.$children[0].canvas.width
            const x0s = store.planets.map(planet => {
                const x0 =
                    document
                        .querySelector(`#planet-${planet.name}`)
                        .transform.baseVal.getItem(0).matrix.e -
                    planet.size / 2
                return {
                    x0,
                    // timestamp: utils.map(x0, 0, width, 0, maxDuration),
                    index: planet.index,
                }
            })
            // Sort by x0
            x0s.sort((p1, p2) => {
                if (p1.x0 > p2.x0) return 1
                else return -1
            })

            // Add timestamps
            const maxDuration = 5 * 1000
            const maxX0 = x0s[x0s.length - 1].x0
            const duration = utils.map(maxX0, 0, width, 0, maxDuration)
            const timestamps = x0s.map(el => {
                return {
                    x0: el.x0,
                    index: el.index,
                    timestamp: utils.map(el.x0, 0, maxX0, 0, duration),
                }
            })

            console.log({ timestamps })

            // NOTE: doing this with timeout since Howler doesn't allow for scheduling!
            timestamps.forEach(ts => {
                this.timeouts.push(
                    setTimeout(() => {
                        console.log('playing', ts.index, 'at', ts.timestamp)
                        this.$root.$emit('noteOn', ts.index)
                    }, ts.timestamp)
                )
            })

            this.timeouts.push(
                setTimeout(() => {
                    this.setTimeouts()
                }, duration + 500) // leave 0.5 duration for last note before looping
            )
        },

        removeHoverFromCss() {
            // NOTE: More info here: https://stackoverflow.com/questions/23885255/how-to-remove-ignore-hover-css-style-on-touch-devices
            function hasTouch() {
                return (
                    'ontouchstart' in document.documentElement ||
                    navigator.maxTouchPoints > 0 ||
                    navigator.msMaxTouchPoints > 0
                )
            }

            if (hasTouch()) {
                // remove all :hover stylesheets
                try {
                    // prevent exception on browsers not supporting DOM styleSheets properly
                    for (var si in document.styleSheets) {
                        var styleSheet = document.styleSheets[si]
                        if (!styleSheet.rules) continue

                        for (
                            var ri = styleSheet.rules.length - 1;
                            ri >= 0;
                            ri--
                        ) {
                            if (!styleSheet.rules[ri].selectorText) continue

                            if (
                                styleSheet.rules[ri].selectorText.match(
                                    ':hover'
                                )
                            ) {
                                styleSheet.deleteRule(ri)
                            }
                        }
                    }
                } catch (ex) {
                    // console.log('do nothing')
                }
            }
        },

        midiNoteOnListener(e) {
            console.log(e.note.name + e.note.octave)
            const sNote = `${e.note.name}${e.note.octave}`
            console.log({ sNote })
            let note = teoria.note(sNote)
            if (sNote.includes('#')) {
                note = teoria
                    .note(sNote)
                    .enharmonics()
                    .find(en => en.accidentalValue() === -1) // find the one with just one flat
                console.log('note converted to', note)
            }
            // Iterate through planets to check if any has a .note() that is the same as the MIDI note on
            this.$children.forEach(component => {
                if (component.$options.name === 'Planet') {
                    if (component.note === note.scientific()) {
                        console.log(
                            'found a planet with proper note and index',
                            component.index
                        )
                        this.$root.$emit('noteOn', component.index)
                    }
                }
            })
        },

        initMidi() {
            WebMidi.enable(err => {
                if (err) {
                    console.log('WebMidi could not be enabled.', err)
                } else {
                    console.log('WebMidi enabled!')
                    console.log(WebMidi.inputs)
                    WebMidi.inputs.forEach(input => {
                        input.addListener('noteon', 'all', e => {
                            this.midiNoteOnListener(e)
                        })
                    })
                }
            })
        },

        initShake() {
            new window.Shake({ threshold: 15, timeout: 1000 }).start()
            window.addEventListener('shake', this.shaked, false)
        },

        shaked() {
            const randomPianoMode =
                store.pianoModes[
                    Math.floor(Math.random() * store.pianoModes.length)
                ]
            store.pianoMode = randomPianoMode
            this.positionPlanetsHorizontally()
            store.recordings = {}
            this.$children.forEach(component => {
                if (component.$options.name === 'Planet') {
                    component.hasRecording = false
                }
            })
        },

        loadUUID(uuid) {
            api.get(`compositions/${uuid}`)
                .then(response => {
                    // TODO: make this a direct mapping
                    const { data } = response.data
                    store.pianoMode = data.pianoMode
                    store.showPiano = data.showPiano
                    // store.planets = data.planets
                    store.planets.forEach(storePlanet => {
                        const dataPlanet = data.planets.find(
                            planet => planet.name === storePlanet.name
                        )
                        storePlanet.x = dataPlanet.x
                        storePlanet.y = dataPlanet.y
                    })
                    store.planets.forEach(planet => {
                        window.TweenLite.set(`#planet-${planet.name}`, {
                            x: planet.x,
                            y: planet.y,
                        })
                    })
                    this.updateDragBounds()

                    // const planetNames = store.planets.map(planet => {
                    //     return { name: planet.name, index: planet.index }
                    // })
                    // planetNames.sort((p1, p2) => {
                    //     if (p1.index > p2.index) return 1
                    //     else return -1
                    // })
                    // console.log({ planetNames })
                    // planetNames.forEach(planet => {
                    //     const { name } = planet
                    //     this.$children.forEach(component => {
                    //         if (
                    //             component.$options.name === 'Planet' &&
                    //             component.$vnode.key === name
                    //         ) {
                    //             console.log('setting listeners for', name)
                    //             component.setListeners()
                    //         }
                    //     })
                    // })
                })
                .catch(error => {
                    console.error(`Couldn't load UUID ${uuid} from database.`)
                    console.log({ error })
                })
        },

        initDraggables() {
            for (let i = 0; i < store.planets.length; i++) {
                let name = store.planets[i].name
                store.planets[i].draggable = Draggable.create(
                    `#planet-${name}`,
                    {
                        cursor: 'pointer',
                        onDrag: () => {
                            if (store.locked) return
                            this.$root.$emit('amplitude', {
                                name,
                                amplitude: this.determineAmplitude(name),
                            })
                        },
                        throwProps: true,
                    }
                )[0]
            }
        },

        determineAmplitude(name) {
            const sel = `#planet-${name}`
            const planet = store.planets.find(planet => planet.name === name)
            const { size } = planet
            const y =
                document.querySelector(sel).transform.baseVal.getItem(0).matrix
                    .f - size

            const height = window.screenfull.isFullscreen
                ? store.canvas.height - size
                : store.canvas.height - 2 * size

            const mapped = utils.map(y, 0, height, 1, 0)
            const ret = mapped >= 1 ? 1 : mapped
            // console.log(`ret is ${ret} but going to return ${ret * ret}`)
            return ret * ret
        },

        interaction(evt) {
            if (this.lastInteractedPlanetId === evt) {
                return
            }
            this.lastInteractedPlanetId = evt
            Howler.ctx.resume()
            utils.swap(
                store.planets,
                store.planets.length - 1,
                store.planets.findIndex(
                    planet => planet.name === this.lastInteractedPlanetId
                )
            )
        },

        lock(evt) {
            store.locked = evt
        },

        resize() {},

        initKeyboardShortcuts() {
            document.addEventListener('keypress', evt => {
                // bottom bar
                if (evt.key === 'l') store.locked = !store.locked
                if (evt.key === 'p') store.showPiano = !store.showPiano
                if (evt.key === 'i') store.showInfo = !store.showInfo
                if (evt.key === 'v') store.muted = !store.muted
                if (evt.key === 'm') {
                    if (!evt.shiftKey) this.$refs.bottombar.changePianoMode(1)
                    else this.$refs.bottombar.changePianoMode(-1)
                }
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

                // sequencing
                if (evt.key === ' ') store.sequencing = !store.sequencing
            })
        },

        getMaxDragHeight() {
            try {
                const h1 = this.$refs.bottombar.$el.clientHeight
                const h2 = this.$refs.canvas.clientHeight
                let ret = (1 - h1 / h2) * this.canvas.height
                return ret
            } catch (e) {
                console.log('failing silently', e)
                return this.canvas.height
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
            // with transforms
            const planet = document.querySelector(`#planet-${name}`)
            planet.setAttribute('transform', `matrix(1,0,0,1,${x},${y})`)
            window.TweenLite.set(`#planet-${name}`, { x, y })
        },

        positionPlanetsHorizontally() {
            let indexes = this.planets.map((planet, index) => index)
            for (let i = 0; i < this.planets.length; i++) {
                const r = this.planets[i].size
                const dy =
                    this.canvas.height -
                    2 * r -
                    document.querySelector('#bottombar').clientHeight -
                    20
                const y = random(dy) + r
                const index = sample(indexes)
                indexes = indexes.filter(el => el !== index)
                const sunWidth = document
                    .querySelector('#sun')
                    .getBoundingClientRect().width
                const x =
                    index *
                        ((this.canvas.width - sunWidth) / this.planets.length) +
                    this.canvas.width / this.planets.length / 2 +
                    sunWidth
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

                    const dy =
                        this.canvas.height -
                        2 * r1 -
                        document.querySelector('#bottombar').clientHeight -
                        20
                    y1 = Math.floor(Math.random() * dy + r1)

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
            if (!navigator.mediaDevices) {
                console.warn('No navigator.mediaDevices')
                return
            }
            store.recorder = new Recorder(5000) // max timeout of 5 seconds
        },
    },
}
</script>

<style lang="scss">
@import 'assets/styles/globals';
@import 'assets/styles/starry';

html:fullscreen,
body:fullscreen {
    overflow: hidden;
}

html {
    // background: #000;
    font-family: 'Space Mono', monospace;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
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
    // border: 1px solid var(--greyish);
    border-radius: 2px;
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

#canvas svg {
    z-index: 10000;
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
    background-color: rgba(0, 0, 0, 0.93);
    color: var(--active);
    width: 100%;
}

.stars {
    font-size: 14px;
}

#pleaserotate-graphic {
    margin-left: 0;
}
</style>
