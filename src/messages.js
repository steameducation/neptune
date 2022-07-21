const messages = {
  pt: {
    planet: 'Planeta',
    mercury: 'Mercúrio',
    venus: 'Vénus',
    earth: 'Terra',
    mars: 'Marte',
    jupiter: 'Júpiter',
    saturn: 'Saturno',
    uranus: 'Urano',
    neptune: 'Neptuno',
    modes: {
      ionian: 'jónio',
      dorian: 'dórico',
      phrygian: 'frígio',
      lydian: 'lídio',
      mixolydian: 'mixolídio',
      aeolian: 'eólio',
      locrian: 'lócrio',
    },
    major: 'maior',
    minor: 'menor',
    shareHeader: 'A sua composição NepTune está disponível no seguinte link:',
    twitterDataText: 'Vejam a minha composition NepTune!',
  },

  en: {
    planet: 'Planet',
    mercury: 'Mercury',
    venus: 'Venus',
    earth: 'Earth',
    mars: 'Mars',
    jupiter: 'Jupiter',
    saturn: 'Saturn',
    uranus: 'Uranus',
    neptune: 'Neptune',
    modes: {
      ionian: 'ionian',
      dorian: 'dorian',
      phrygian: 'phrygian',
      lydian: 'lydian',
      mixolydian: 'mixolydian',
      aeolian: 'aeolian',
      locrian: 'locrian',
    },
    major: 'major',
    minor: 'minor',
    shareHeader: 'Your NepTune composition is saved at this link:',
    twitterDataText: 'Checkout my NepTune composition!',
  },
}

import info from '@/info.js'
messages.en.info = info.en
messages.pt.info = info.pt

import facts from '@/facts.js'
messages.en.facts = facts.en
messages.pt.facts = facts.pt

export default messages
