import Vue from 'vue'

import { Howl } from 'howler'

import messages from '@/messages.js'

import axios from 'axios'

const store = new Vue.observable({
    canvas: {
        width: 1920,
        height: 1080,
    },
    planets: [
        {
            name: 'mercury',
            color: '#FF8D02',
            size: 68,
            index: 0, // need index since the order of the planets in the array will change
        },
        {
            name: 'venus',
            color: '#F8B763',
            size: 73,
            index: 1,
        },
        {
            name: 'earth',
            color: '#0274FF',
            size: 100,
            index: 2,
        },
        {
            name: 'mars',
            color: '#FF4A02',
            size: 146,
            index: 3,
        },
        {
            name: 'jupiter',
            color: '#FFCF54',
            size: 166,
            index: 4,
        },
        {
            name: 'saturn',
            color: '#FFE9B3',
            size: 112,
            index: 5,
        },
        {
            name: 'uranus',
            color: '#01AE83',
            size: 112,
            index: 6,
        },
        {
            name: 'neptune',
            color: '#1842FF',
            size: 84,
            index: 7,
        },
    ],
    pianoModes: Object.keys(messages.en.modes),
    pianoMode: Object.keys(messages.en.modes)[0],
    appMode: 'piano', // 'piano', 'nasa', 'record'
    showPiano: false,
    showShare: true,
    showInfo: false,
    locked: false,
    muted: false,
    sequencing: false,
    fullscreen: false,
    recording: () => {
        return this.recorder.recording
    },
    recordingTimeout: null,
    recordingPlanet: '',
    sounds: {},
    soundscapes: {},
    recordings: {},
    sun: [],
    locales: Object.keys(messages),
    isPwa: false,
    isMobile: false,
    allNoteSoundsLoaded: false,
    allPlanetSoundsLoaded: false,
    allSunSoundsLoaded: false,
})

const notes = [
    'C3',
    'Db3',
    'D3',
    'Eb3',
    'E3',
    'F3',
    'Gb3',
    'G3',
    'Ab3',
    'A3',
    'Bb3',
    'B3',
    'C4',
]

import { Howler } from 'howler'
Howler.html5Poolsize = 30

// enlarge sizes lol
store.planets.forEach(planet => {
    planet.size *= 1.35
})

// Load note sounds
let noteSoundsLoaded = 0
notes.forEach(note => {
    store.sounds[note] = new Howl({
        src: `sounds/piano/${note}.mp3`,
        autoplay: false,
        volume: 0.6,
        loop: false,
        onload: () => {
            noteSoundsLoaded++
            if (noteSoundsLoaded === notes.length) {
                store.allNoteSoundsLoaded = true
            }
        },
    })
})

// Load planet's sounds (soundscapes)
let planetSoundsLoaded = 0
store.planets.forEach(planet => {
    store.soundscapes[planet.name] = new Howl({
        src: `sounds/nasa/${planet.name}.mp3`,
        autoplay: false,
        volume: 0.6,
        loop: true,
        onload: () => {
            planetSoundsLoaded++
            if (planetSoundsLoaded === store.planets.length) {
                store.allPlanetSoundsLoaded = true
            }
        },
        // html5: true, // commenting because if iOS then cannot change volume midway of playing
    })
})

// Load sun drone sounds
let sunSoundsLoaded = 0
for (let i = 0; i < 3; i++) {
    store.sun[i] = new Howl({
        src: `sounds/sun/sun${i + 1}.mp3`,
        autoplay: false,
        volume: 0.1,
        loop: true,
        onload: () => {
            sunSoundsLoaded++
            if (sunSoundsLoaded === 3) {
                store.allSunSoundsLoaded = true
            }
        },
    })
}

// TODO: move this to a better place?
export function planetsToJson() {
    let ret = []
    store.planets.forEach(planet => {
        const { name, size, color, index } = planet
        const el = document.querySelector(`#planet-${name}`)
        // const x = el.transform.baseVal.getItem(0).matrix.e - size
        // const y = el.transform.baseVal.getItem(0).matrix.f - size
        const x = el.transform.baseVal.getItem(0).matrix.e
        const y = el.transform.baseVal.getItem(0).matrix.f
        ret.push({
            name: planet.name,
            x,
            y,
            size,
            color,
            index,
        })
    })
    return ret
}

// TODO: move this to a better place?
export function compositionToJson() {
    return {
        pianoMode: store.pianoMode,
        planets: planetsToJson(),
    }
}

export const api = axios.create({
    baseURL: 'https://34.250.203.171/neptune/',
    timeout: 5000,
    // withCredentials: true,
    // headers: {
    //     'Access-Control-Allow-Origin': '*',
    // },
})

export default store

window.store = store
