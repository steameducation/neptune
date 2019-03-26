<template>
    <svg width="100%" height="100%">
        <defs>
            <filter
                :id="`shadow-${name}`"
                x="-50%"
                y="-50%"
                width="400%"
                height="400%"
            >
                <feDropShadow
                    dx="0"
                    dy="0"
                    :stdDeviation="stdDeviation"
                    v-bind="{
                        'flood-color': floodColor,
                    }"
                    flood-opacity="1"
                />
            </filter>
        </defs>
        <g
            :id="`planet-${name}`"
            ref="planetGroup"
            class="planet"
            @touchstart.stop="click"
            @mousedown="click"
        >
            <circle
                :r="size / 2"
                :fill="color"
                :class="{ hasRecording: hasRecording }"
                :filter="`url(#shadow-${name})`"
            ></circle>
            <text :y="size / 2 + 30" class="planetLabel">
                {{ $t(name) }}
            </text>
            <Fact v-show="showFact" :fact="fact" :size="size" />
        </g>
    </svg>
</template>

<script>
import teoria from 'teoria'
import store from '@/store.js'

import Vue from 'vue'

import Fact from '@/components/Fact.vue'

export default {
    name: 'Planet',

    components: {
        Fact,
    },

    props: {
        name: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            playing: false,
            factIndex: 0,
            showFact: false,
            holding: false,
            dragging: false,
            amplitude: 1,
            noteOns: [],
            hasTouch: false,
        }
    },

    computed: {
        planet() {
            return store.planets.find(planet => planet.name === this.name)
        },

        index() {
            return this.planet.index
        },

        // x() {
        //     // TODO:
        // },

        // y() {
        //     // TODO:
        // },

        // amplitude() {
        //     // TODO:
        // },

        // playing() {
        //     // TODO:
        // },

        floodColor() {
            if (this.appMode === 'piano' || this.appMode === 'nasa') {
                if (!this.playing) return this.color
                else return 'var(--active)'
            } else if (this.appMode === 'record') {
                if (this.holding) {
                    return 'red'
                } else {
                    return 'blue'
                }
            }
            return 'magenta'
        },

        size() {
            return this.planet.size
        },

        color() {
            return this.planet.color
        },

        appMode() {
            return store.appMode
        },

        recording() {
            return store.recordings[this.name]
        },

        hasRecording() {
            return this.recording != null
        },

        note() {
            const idx = this.index === 7 ? 0 : this.index
            let note = teoria.scale('c', store.pianoMode).simple()[idx]

            // If it's sharp, convert to flat
            if (note.includes('#'))
                note = teoria
                    .note(note)
                    .enharmonics()
                    .find(en => en.accidentalValue() === -1) // find the one with just one flat
                    .scientific()
                    .slice(0, -1) // remove octave

            note = note[0].toUpperCase() + note.slice(1, note.length)
            const octave = this.index !== 7 ? '3' : '4'
            const ret = `${note}${octave}`
            return ret
        },

        sound() {
            return store.sounds[this.note]
        },

        stdDeviation() {
            if (!this.playing) return 5
            else return 15
        },

        fact() {
            if (this.factIndex === -1) return ''
            return this.facts[this.factIndex].fact
        },

        facts() {
            return this.$t(`facts.${this.planet.name}`)
        },
    },

    watch: {
        holding() {
            if (this.appMode === 'piano' || this.appMode === 'nasa') {
                if (this.holding) {
                    this.toggleFact()
                }
            } else if (this.appMode === 'record') {
                this.toggleRecording()
            }
        },
    },

    created() {
        this.$root.$on('noteOn', this.noteOn)
        this.$root.$on('noteOff', this.noteOff)
        this.$root.$on('amplitude', evt => {
            if (evt.name === this.name) {
                this.amplitude = evt.amplitude
                // if (this.appMode === 'piano')
                //     store.sounds[this.note].volume(this.amplitude)
                if (this.appMode === 'nasa') {
                    // store.soundscapes[this.name].volume(this.amplitude)
                    const v = store.soundscapes[this.name].volume()
                    store.soundscapes[this.name].fade(v, this.amplitude, 1000)
                }
                // if (this.appMode === 'record')
                //     store.recordings[this.name].volume = this.amplitude
            }
        })
    },

    mounted() {
        Vue.nextTick(() => {
            store.planets[this.index].draggable.addEventListener(
                'press',
                () => {
                    this.holdingTimeoutId = window.setTimeout(() => {
                        this.holding = true
                    }, 300)
                }
            )

            store.planets[this.index].draggable.addEventListener(
                'release',
                () => {
                    this.release()
                }
            )

            store.planets[this.index].draggable.addEventListener(
                'dragstart',
                () => {
                    if (this.locked) return
                    this.dragging = true
                    this.holding = false
                    window.clearTimeout(this.holdingTimeoutId)
                }
            )

            store.planets[this.index].draggable.addEventListener(
                'dragend',
                () => {
                    if (this.locked) return
                    this.dragging = false
                }
            )

            // NOTE: determine actual amplitude according to position on screen on start
            this.amplitude = this.$parent.determineAmplitude(this.index) // LOL...
        })

        // this.initHammer()
    },

    methods: {
        initHammer() {
            const el = document.querySelector(`#planet-${this.name}`)
            var mc = new window.Hammer.Manager(el)
            // mc.add(new window.Hammer.Tap({ event: 'doubletap', taps: 2 }))
            // mc.add(new window.Hammer.Tap({ event: 'singletap' }))
            mc.add(new window.Hammer.Press({ time: 300 }))
            // mc.get('doubletap').recognizeWith('singletap')
            // mc.get('singletap').requireFailure('doubletap')
            mc.on('press pressup', ev => {
                if (this.appMode === 'piano' || this.appMode === 'nasa') {
                    if (ev.type === 'press') {
                        this.toggleFact()
                    }
                } else {
                    if (ev.type === 'press') {
                        this.play()
                    } else if (ev.type === 'pressup') {
                        this.play()
                    }
                }
            })
        },

        play() {
            this.$root.$emit('noteOn', this.index)
        },

        noteOn(index) {
            if (index !== this.index) return
            // Then play sound
            if (store.appMode === 'piano') this.playPiano()
            else if (store.appMode === 'nasa') this.playNASA()
            else if (store.appMode === 'record') this.playRecord()
        },

        noteOff(index) {
            if (index !== this.index) return
            this.playing = false
        },

        playPiano() {
            this.$root.$emit('pianoOn', this.note)
            const v = store.sounds[this.note].volume()
            this.sound.volume(this.amplitude)
            console.log(
                'pianoOn',
                v,
                store.sounds[this.note].volume(),
                'should be',
                this.amplitude
            )
            this.sound.play()
            this.noteOns.push(this.note)
            this.playing = true
            store.sounds[this.note].on('end', () => {
                if (this.noteOns.length === 0) {
                    console.log('trying to stop a sound that doesnt exist')
                    return
                }
                let note = this.noteOns.shift()
                console.log('ending note', { note })
                if (this.sound.playing() && this.noteOns[0] == note) return
                this.$root.$emit('noteOff', this.index)
                this.$root.$emit('pianoOff', note)
            })
        },

        toggleRecording() {
            if (!store.recorder.recording) {
                store.recorder.start(store.recordings, this.name)
            } else {
                store.recorder.stop()
                // store.recordings[this.name].loop = true
            }
        },

        playNASA() {
            if (!this.playing) {
                store.soundscapes[this.name].volume(this.amplitude)
                store.soundscapes[this.name].play()
                store.soundscapes[this.name].fade(0, this.amplitude, 2000)
                this.playing = true
            } else {
                store.soundscapes[this.name].fade(this.amplitude, 0, 1000)
                setTimeout(() => {
                    store.soundscapes[this.name].stop()
                }, 1000)
                this.playing = false
            }
        },

        playRecord() {
            this.playing = true
            if (store.recordings[this.name]) store.recordings[this.name].play()
        },

        toggleFact() {
            if (this.showFact)
                this.factIndex = (this.factIndex + 1) % this.facts.length
            this.showFact = !this.showFact
        },

        click(e) {
            if (e.type === 'touchstart') this.hasTouch = true
            if (this.hasTouch && e.type !== 'touchstart') return
            if (!store.planets[this.index].draggable.enabled()) this.release()
        },

        release() {
            if (this.appMode === 'piano' || this.appMode === 'nasa') {
                if (!this.holding && !this.dragging) this.play()
            } else if (this.appMode === 'record' && !this.dragging) {
                if (!this.recording) this.play()
            }
            this.holding = false
            window.clearTimeout(this.holdingTimeoutId)
        },
    },
}
</script>

<style lang="scss">
svg {
    overflow: visible;
    circle.hasRecording {
        stroke: var(--active);
        stroke-width: 3px;
    }
    text {
        text-anchor: middle;
        fill: #707070;
        font-size: 24px;
    }
}

.planet {
    &:hover {
        cursor: pointer;
    }
}
</style>
