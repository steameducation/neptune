<template>
    <!-- <svg :id="`planet-${name}`" :x="x" :y="y" width="300px" height="300px"> -->
    <svg width="300px" height="300px">
        <defs>
            <filter
                :id="`shadow-${name}`"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
            >
                <feDropShadow
                    dx="0"
                    dy="0"
                    :stdDeviation="stdDeviation"
                    v-bind="{ 'flood-color': floodColor }"
                    flood-opacity="1"
                />
            </filter>
        </defs>
        <g :id="`planet-${name}`" class="planet">
            <circle
                :r="size / 2"
                :fill="color"
                :filter="`url(#shadow-${name})`"
                @click="play"
            ></circle>
            <text :y="size / 2 + 30" class="planetLabel">
                {{ $t(name) }}
            </text>
        </g>
    </svg>
</template>

<script>
import teoria from 'teoria'
import store from '@/store.js'
import utils from '@/utils.js'

export default {
    name: 'Planet',

    props: {
        index: {
            type: Number,
            required: true,
        },
    },

    data() {
        return {
            playing: false,
        }
    },

    computed: {
        planet() {
            return store.planets[this.index]
        },

        x() {
            return this.planet.x
        },

        y() {
            return this.planet.y
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

        amplitude() {
            return utils.map(this.y, 0, store.canvas.height, 1, 0)
        },

        sound() {
            return store.sounds[this.note]
        },

        floodColor() {
            if (!this.playing) return this.color
            else return 'var(--active)'
        },

        stdDeviation() {
            if (!this.playing) return 10
            else return 30
        },
    },

    watch: {
        amplitude() {
            this.sound.volume(this.amplitude)
        },

        playing() {
            console.log('playing changed to', this.playing)
        },
    },

    created() {
        this.$root.$on('noteOn', this.noteOn)
        this.$root.$on('noteOff', this.noteOff)
    },

    methods: {
        play() {
            this.$root.$emit('noteOn', this.index)
        },

        noteOn(index) {
            if (index !== this.index) return
            if (store.appMode === 'piano') this.playPiano()
            else if (store.appMode === 'nasa') this.playNASA()
            else if (store.appMode === 'record') this.playRecord()
            this.playing = true
        },

        noteOff(index) {
            if (index !== this.index) return
            this.playing = false
        },

        playPiano() {
            console.log('playing', this.note)
            this.sound.play()
            this.sound.on('end', () => {
                console.log('ended')
                this.$root.$emit('noteOff', this.index)
            })
        },

        playNASA() {
            console.log('playing NASA')
            store.soundscapes[this.name].play()
        },

        playRecord() {
            if (!store.recorder.recording) {
                store.recorder.start(store.recordings, this.name)
            } else {
                store.recorder.stop()
            }
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
</style>
