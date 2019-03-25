import Vue from 'vue'

import { Howl } from 'howler'

import messages from '@/messages.js'

const store = new Vue.observable({
    canvas: {
        width: 1920,
        height: 1080,
    },
    planets: [
        {
            name: 'mercury',
            color: '#FF8D02',
            size: 48,
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
    showShare: false,
    showInfo: false,
    locked: false,
    muted: false,
    fullscreen: false,
    recording: () => {
        return this.recorder.recording
    },
    recordingTimeout: null,
    recordingPlanet: '',
    sounds: {},
    soundscapes: {},
    recordings: {},
    locales: Object.keys(messages),
    zIndex: 1000,
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

// Load note sounds
notes.forEach(note => {
    store.sounds[note] = new Howl({
        src: `sounds/piano/${note}.mp3`,
        autoplay: false,
        volume: 0.6,
        loop: false,
        onend: function() {},
    })
})

// Load planet's sounds (soundscapes)
store.planets.forEach(planet => {
    store.soundscapes[planet.name] = new Howl({
        src: `sounds/nasa/${planet.name}.mp3`,
        autoplay: false,
        volume: 0.6,
        loop: true,
        html5: true,
    })
})

export default store

window.store = store
