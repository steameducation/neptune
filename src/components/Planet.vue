<template>
    <svg :id="`planet-${name}`" :x="x" :y="y" width="300px" height="300px">
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
                    stdDeviation="10"
                    v-bind="{ 'flood-color': color }"
                    flood-opacity="1"
                />
            </filter>
        </defs>
        <g class="planet">
            <circle
                :r="size / 2"
                :fill="color"
                :filter="`url(#shadow-${name})`"
                @click="click"
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

import Draggable from 'gsap/Draggable'

export default {
    name: 'Planet',

    props: {
        index: {
            type: Number,
            required: true,
        },
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
                    .find(en => en.accidentalValue === -1) // find the one with just one flat
                    .scientific()
                    .slice(0, -1) // remove octave

            note = note[0].toUpperCase() + note.slice(1, note.length)
            const octave = this.index !== 7 ? '3' : '4'
            const ret = `${note.toUpperCase()}${octave}`
            return ret
        },
        amplitude() {
            return utils.map(this.y, 0, store.canvas.height, 1, 0)
        },
        sound() {
            return store.sounds[this.note]
        },
    },

    watch: {
        amplitude() {
            this.sound.volume(this.amplitude)
        },
    },

    mounted() {
        const id = `#planet-${this.name}`
        Draggable.create(id, {
            cursor: 'pointer',
            type: 'top,left',
            // onDrag: e => {
            //     store.planets[this.index].x = e.x
            //     store.planets[this.index].y = e.y
            // },
        })
    },

    methods: {
        click() {
            this.sound.play()
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
