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
        shareHeader:
            'A sua composição NepTune está disponível no seguinte link:',
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
        facts: {
            mercury: [
                {
                    fact: 'A year lasts only 88 Earth days on Mercury.',
                },
                {
                    fact:
                        'The Romans knew of seven bright objects in the sky: the Sun, the Moon, and the five brightest planets.',
                },
            ],
            venus: [
                {
                    fact:
                        'Venus rotates very slowly: the planet takes 243 Earth days to complete 1 rotation around its axis.',
                },
            ],
            earth: [
                {
                    fact:
                        'The Earth is the only planet in our solar system not to be named after a Greek or Roman deity.',
                },
                {
                    fact:
                        'Earth formed approximately 4.54 billion years ago and is the only known planet to support life.',
                },
            ],
            mars: [
                {
                    fact:
                        'The planet is named after Mars, the Roman god of war.',
                },
                {
                    fact:
                        'Mars has seasons like Earth, but they last twice as long.',
                },
                {
                    fact: 'David Bowie has an album called “Life on Mars”.',
                },
            ],
            jupiter: [
                {
                    fact:
                        'Jupiter is two times more massive than all the other planets combined.',
                },
                {
                    fact:
                        "On Jupiter you would feel the force of gravity about 2.4 times stronger than on Earth's surface.",
                },
            ],
            saturn: [
                {
                    fact:
                        'Saturn is so big that Earth could fit into it whooping 755 times!',
                },
                {
                    fact:
                        'The circumstances on Saturn are simply too hostile for the emergence of life.',
                },
            ],
            uranus: [
                {
                    fact:
                        'Uranus’ poles lies west and east, equator South to north.',
                },
                {
                    fact:
                        'Uranus’ moons are named after characters created by William Shakespeare and Alexander Pope.',
                },
            ],
            neptune: [
                {
                    fact:
                        'It takes Neptune almost 165 Earth years to circle around the sun.',
                },
                {
                    fact:
                        'Galilei was the first person who saw Neptune although he did not recognize it as a planet.',
                },
            ],
        },
    },
}

// NOTE: for now copy the EN facts to PT
messages.pt.facts = messages.en.facts

export default messages
