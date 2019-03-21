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
            </svg>
        </div>
        <Bottombar ref="bottombar" />
        <div v-show="isFullscreen" class="grid">
            <div
                class="btnFullscreenClose btnFullscreen"
                @click="toggleFullscreen"
            >
                <FontAwesomeIcon icon="times" color="white"></FontAwesomeIcon>
            </div>
        </div>
    </div>
</template>

<script>
import Planet from '@/components/Planet.vue'
import Bottombar from '@/components/Bottombar.vue'
import Piano from '@/components/Piano.vue'
import Vue from 'vue'

import screenfull from 'screenfull'

import store from '@/store.js'
import { sample, random } from 'lodash'

export default {
    name: 'App',

    components: {
        Planet,
        Piano,
        Bottombar,
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

        isFullscreen() {
            return store.isFullscreen
        },
    },

    mounted() {
        // this.positionPlanetsHorizontally()
        this.positionPlanetsSequentially()
    },

    methods: {
        positionPlanetsSequentially() {
            for (let i = 0; i < this.planets.length; i++) {
                const x = i * (this.canvas.width / this.planets.length) + 100
                const y = this.canvas.height / 2 - 100
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

#canvas {
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
</style>
