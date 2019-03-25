<template>
    <svg width="100%" height="100%" @click="$emit('interaction', name)">
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
                        'flood-color': !playing ? color : 'var(--active)',
                    }"
                    flood-opacity="1"
                />
            </filter>
        </defs>
        <g :id="`planet-${name}`" ref="planetGroup" class="planet">
            <circle
                :r="size / 2"
                :fill="color"
                :filter="`url(#shadow-${name})`"
                @click="play"
                @dblclick="toggleFact"
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
import utils from '@/utils.js'
import Draggable from 'gsap/Draggable'

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

    created() {
        console.log('planet created')
        this.$root.$on('noteOn', this.noteOn)
        this.$root.$on('noteOff', this.noteOff)
        store.planets[this.index].draggable = Draggable.create(
            `#planet-${this.name}`,
            {
                cursor: 'pointer',
            }
        )[0]
        this.$emit('updateDragBounds')
    },

    methods: {
        play() {
            this.$root.$emit('noteOn', this.index)
        },

        noteOn(index) {
            if (index !== this.index) return

            // First determine amplitude
            const y =
                this.$refs.planetGroup.transform.baseVal[0].matrix.f - this.size

            const height = window.screenfull.isFullscreen
                ? store.canvas.height
                : store.canvas.height - 2 * this.size
            this.amplitude = utils.map(y, 0, height, 1, 0.01)
            this.amplitude = this.amplitude >= 1 ? 1 : this.amplitude
            console.log('amplitude', this.amplitude)

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
            console.log('playing', this.note)
            this.sound.volume(this.amplitude)
            this.sound.play()
            this.playing = true
            this.sound.on('end', () => {
                console.log('ended')
                this.$root.$emit('noteOff', this.index)
            })
        },

        playNASA() {
            if (!this.playing) {
                store.soundscapes[this.name].volume(this.amplitude)
                store.soundscapes[this.name].play()
                this.playing = true
            } else {
                console.log('stopping')
                store.soundscapes[this.name].stop()
                this.playing = false
            }
        },

        playRecord() {
            if (!store.recorder.recording) {
                store.recorder.start(store.recordings, this.name)
            } else {
                store.recorder.stop()
            }
        },

        toggleFact() {
            console.log('detected double click')
            if (this.showFact)
                this.factIndex = (this.factIndex + 1) % this.facts.length
            this.showFact = !this.showFact
        },
    },
}
</script>

<style lang="scss">
svg {
    overflow: visible;
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
