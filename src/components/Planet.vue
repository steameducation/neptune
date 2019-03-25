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
            @click="click"
        >
            <circle
                :r="size / 2"
                :fill="color"
                :filter="`url(#shadow-${name})`"
                :class="{ hasRecording: hasRecording }"
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
        index: {
            type: Number,
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
        }
    },

    computed: {
        planet() {
            return store.planets[this.index]
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

        matrix() {
            return this.$refs.planetGroup.transform.baseVal[0].matrix
        },

        name() {
            return this.planet.name
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
                    console.log('toggling fact')
                    console.log('toggling fact')
                    this.toggleFact()
                }
            } else if (this.appMode === 'record') {
                this.toggleRecording()
            }
        },

        'store.recordings': () => {
            console.log('recordings changed')
        },
    },

    created() {
        this.$root.$on('noteOn', this.noteOn)
        this.$root.$on('noteOff', this.noteOff)
        this.$root.$on('amplitude', evt => {
            if (evt.name === this.name) {
                this.amplitude = evt.amplitude
                if (this.appMode === 'piano')
                    store.sounds[this.note].volume(this.amplitude)
                if (this.appMode === 'nasa')
                    store.soundscapes[this.name].volume(this.amplitude)
                if (this.appMode === 'record')
                    store.recordings[this.name].volume = this.amplitude
            }
        })
    },

    mounted() {
        Vue.nextTick(() => {
            console.log('nextTick mounted planet')

            store.planets[this.index].draggable.addEventListener(
                'press',
                () => {
                    console.log('press')
                    this.$emit('interaction', name)
                    // this.holdingTimeoutId = window.setTimeout(() => {
                    //     this.holding = true
                    //     console.log('holding')
                    // }, 300)
                    // console.log('pressed')
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
                    console.log('dragStart')
                    this.dragging = true
                    this.holding = false
                    window.clearTimeout(this.holdingTimeoutId)
                }
            )

            store.planets[this.index].draggable.addEventListener(
                'dragend',
                () => {
                    if (this.locked) return
                    console.log('dragEnd')
                    this.dragging = false
                }
            )
        })

        // this.initHammer()
    },

    methods: {
        initHammer() {
            const el = document.querySelector(`#planet-${this.name}`)
            console.log(el)
            var mc = new window.Hammer.Manager(el)
            // mc.add(new window.Hammer.Tap({ event: 'doubletap', taps: 2 }))
            // mc.add(new window.Hammer.Tap({ event: 'singletap' }))
            mc.add(new window.Hammer.Press({ time: 300 }))
            // mc.get('doubletap').recognizeWith('singletap')
            // mc.get('singletap').requireFailure('doubletap')
            mc.on('press pressup', ev => {
                console.log(ev.type)
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
            console.log(
                'playing',
                this.note,
                '@',
                this.amplitude,
                this.sound.volume()
            )
            this.sound.volume(this.amplitude)
            this.sound.play()
            this.playing = true
            this.sound.on('end', () => {
                console.log('ended')
                this.$root.$emit('noteOff', this.index)
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
                console.log('stopping')
                store.soundscapes[this.name].fade(this.amplitude, 0, 1000)
                setTimeout(() => {
                    store.soundscapes[this.name].stop()
                }, 1000)
                // store.soundscapes[this.name].stop()
                this.playing = false
            }
        },

        playRecord() {
            this.playing = true
            if (store.recordings[this.name]) store.recordings[this.name].play()
        },

        toggleFact() {
            console.log('detected double click')
            if (this.showFact)
                this.factIndex = (this.factIndex + 1) % this.facts.length
            this.showFact = !this.showFact
        },

        click() {
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
            console.log('holding canceled')
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
