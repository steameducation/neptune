<template>
    <svg :x="x" :y="y" width="300px" height="300px">
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
            <text :y="size / 2 + 20" class="planetLabel">
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
            const n = teoria.scale('c', store.mode).simple()[idx]
            const octave = this.index !== 7 ? '3' : '4'
            return `${n.toUpperCase()}${octave}`
        },
        amplitude() {
            return utils.map(this.y, 0, store.canvas.height, 1, 0)
        },
        sound() {
            return store.sounds[this.note]
        },
    },

    watch: {
        note() {
            console.log('note is now', this.note)
        },
        amplitude() {
            this.sound.volume(this.amplitude)
        },
    },

    methods: {
        click() {
            const v = this.sound.volume()
            this.sound.play()
            this.sound.fade(v, 0, 1000)
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
    }
}
</style>
