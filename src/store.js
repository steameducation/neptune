import Vue from 'vue'

import { Howl } from 'howler'

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
        },
        {
            name: 'venus',
            color: '#F8B763',
            size: 73,
        },
        {
            name: 'earth',
            color: '#0274FF',
            size: 100,
        },
        {
            name: 'mars',
            color: '#FF4A02',
            size: 146,
        },
        {
            name: 'jupiter',
            color: '#FFCF54',
            size: 166,
        },
        {
            name: 'saturn',
            color: '#FFE9B3',
            size: 112,
        },
        {
            name: 'uranus',
            color: '#01AE83',
            size: 112,
        },
        {
            name: 'neptune',
            color: '#1842FF',
            size: 84,
        },
    ],
    pianoModes: [
        'ionian',
        'dorian',
        'phrygian',
        'lydian',
        'mixolydian',
        'aeolian',
        'locrian',
    ],
    pianoMode: 'ionian',
    mode: 'piano', // 'piano', 'nasa', 'record'
    showPiano: true,
    showShare: false,
    showInfo: false,
    locked: false,
    muted: false,
    sounds: {},
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

notes.forEach(note => {
    store.sounds[note] = new Howl({
        src: `sounds/piano/${note}.mp3`,
        autoplay: false,
        volume: 0.6,
        loop: false,
        onend: function() {},
    })
})

export default store

window.store = store
