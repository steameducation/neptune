<template>
  <svg width="100%" height="100%">
    <defs>
      <filter
        :id="`shadow-${name}`"
        x="-50%"
        y="-50%"
        width="1000%"
        height="1000%"
      >
        <feDropShadow
          dx="1"
          dy="1"
          :stdDeviation="stdDeviation"
          v-bind="{
            'flood-color': floodColor,
          }"
          flood-opacity="1"
        />
      </filter>
    </defs>
    <g
      :id="`planet-${name}`"
      ref="planetGroup"
      class="planet"
      @shake="shaked"
      @touchstart.stop="click"
      @mousedown="click"
    >
      <!-- NOTE: Use :filter="`url(#shadow-${name})`" to debug outer circle for improved interaction -->
      <circle :r="size / 2 + 20" fill="none" pointer-events="visible" />

      <circle
        :r="size / 2"
        :fill="color"
        class="planetCircle"
        :class="{ hasRecording: hasRecording }"
        :filter="`url(#shadow-${name})`"
      >
        <animate
          v-if="isRecording"
          attributeType="XML"
          attributeName="fill"
          values="#800;#f00;#800"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </circle>

      <text
        ref="label"
        :y="size / 2 + 30"
        :class="{ playing: playing }"
        :fill="color"
      >
        {{ $t(name) }}
      </text>

      <Fact
        v-show="showFact"
        :fact="fact"
        :size="size"
        :planetName="name"
        :factPosition="factPosition"
      />
    </g>
  </svg>
</template>

<script>
import teoria from 'teoria'
import store from '@/store.js'

import Vue from 'vue'

import Fact from '@/components/Fact.vue'

export default {
  name: 'Planet',

  components: {
    Fact,
  },

  props: {
    name: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      playing: false,
      factIndex: 0,
      showFact: false,
      holding: false,
      dragging: false,
      amplitude: 1,
      noteOns: [],
      hasTouch: false,
      hasRecording: false,
      factPosition: 'top-left',
      stdDeviationObj: {
        max: 30,
        min: 5,
        val: 5,
      },
    }
  },

  computed: {
    labelHeight() {
      return this.$refs.label.clientHeight
    },

    planet() {
      return store.planets.find((planet) => planet.name === this.name)
    },

    index() {
      return this.planet.index
    },

    recording() {
      return store.recordings[this.name]
    },

    floodColor() {
      if (
        this.appMode === 'piano' ||
        this.appMode === 'nasa' ||
        this.appMode === 'record'
      ) {
        if (!this.playing) return this.color
        else return 'var(--active)'
      }
      return this.color
    },

    size() {
      return this.planet.size
    },

    color() {
      return this.planet.color
    },

    appMode() {
      return store.appMode
    },

    isRecording() {
      return this.holding && store.appMode === 'record'
    },

    note() {
      console.log('planet', this.planet)
      console.log('index', this.index)
      const idx = this.index === 7 ? 0 : this.index
      let note = teoria.scale('c', store.pianoMode).simple()[idx]

      // If it's sharp, convert to flat
      if (note.includes('#'))
        note = teoria
          .note(note)
          .enharmonics()
          .find((en) => en.accidentalValue() === -1) // find the one with just one flat
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
      return this.stdDeviationObj.val
    },

    fact() {
      if (this.factIndex === -1) return ''
      return this.facts[this.factIndex].fact
    },

    facts() {
      return this.$t(`facts.${this.planet.name}`)
    },
  },

  watch: {
    playing() {
      const val = this.playing
        ? this.stdDeviationObj.max
        : this.stdDeviationObj.min
      window.TweenLite.to(this.stdDeviationObj, 0.2, { val })
    },

    showFact() {
      console.log('toggle show fact')
      this.$root.$emit('updatePlanetPosition')
    },

    holding() {
      if (this.appMode === 'piano' || this.appMode === 'nasa') {
        if (this.holding) {
          this.toggleFact()
        }
      } else if (this.appMode === 'record') {
        this.toggleRecording()
      }
    },

    isRecording() {
      console.log('recording is now', this.isRecording)
    },

    hasRecording() {
      // console.log('hasRecording changed', this.hasRecording)
    },
  },

  created() {
    this.$root.$on('noteClear', this.noteClear)
    this.$root.$on('noteOn', this.noteOn)
    this.$root.$on('noteOff', this.noteOff)
    this.$root.$on('amplitude', (evt) => {
      if (evt.name === this.name) {
        this.amplitude = evt.amplitude
        if (this.appMode === 'nasa') {
          const v = store.soundscapes[this.name].volume()
          store.soundscapes[this.name].fade(v, this.amplitude, 1000)
        }
        if (this.appMode === 'record')
          try {
            store.recordings[this.name].volume = this.amplitude
          } catch (e) {
            console.warn('couldnt set amplitude for recording')
          }
      }
    })
  },

  mounted() {
    Vue.nextTick(() => {
      this.setListeners()
    })
  },

  methods: {
    shaked() {
      console.log('plaenet got shaken')
    },

    setListeners() {
      store.planets[this.index].draggable.addEventListener('press', () => {
        this.$emit('interaction', this.name)
        this.holdingTimeoutId = window.setTimeout(() => {
          this.holding = true
        }, 300)
      })

      store.planets[this.index].draggable.addEventListener('release', () => {
        this.release()
      })

      store.planets[this.index].draggable.addEventListener('dragstart', () => {
        if (this.locked) return
        this.dragging = true
        this.holding = false
        window.clearTimeout(this.holdingTimeoutId)
      })

      store.planets[this.index].draggable.addEventListener('drag', () => {
        this.$root.$emit('updatePlanetPosition')
      })

      store.planets[this.index].draggable.addEventListener('dragend', () => {
        if (this.locked) return
        this.dragging = false
      })

      // NOTE: determine actual amplitude according to position on screen on start
      // this.amplitude = this.$parent.determineAmplitude(this.planet.name) // LOL...
    },

    initHammer() {
      const el = document.querySelector(`#planet-${this.name}`)
      var mc = new window.Hammer.Manager(el)
      mc.add(new window.Hammer.Press({ time: 300 }))
      mc.on('press pressup', (ev) => {
        if (this.appMode === 'piano' || this.appMode === 'nasa') {
          if (ev.type === 'press') {
            this.toggleFact()
          }
        } else {
          if (ev.type === 'press') {
            this.play()
          } else if (ev.type === 'pressup') {
            this.play()
          }
        }
      })
    },

    play() {
      this.$root.$emit('noteOn', this.index)
    },

    noteOn(index) {
      if (index !== this.index) return
      console.log('noteOn', index, this.note)
      // Then play sound
      if (store.appMode === 'record' && !this.hasRecording) return
      if (store.appMode === 'piano') this.playPiano()
      else if (store.appMode === 'nasa') this.playNASA()
      else if (store.appMode === 'record') this.playRecord()
    },

    noteClear() {
      this.$root.$emit('noteOff', this.index)
    },

    noteOff(index) {
      if (index !== this.index) return
      this.playing = false
    },

    playPiano() {
      this.amplitude = this.$parent.determineAmplitude(this.planet.name)
      this.$root.$emit('pianoOn', this.note)
      const v = store.sounds[this.note].volume()
      this.sound.volume(this.amplitude)
      console.log(
        'pianoOn',
        Number(v).toFixed(2),
        Number(store.sounds[this.note].volume()).toFixed(2),
        'should be',
        Number(this.amplitude).toFixed(2)
      )
      this.sound.play()
      this.noteOns.push(this.note)
      this.playing = true
      store.sounds[this.note].on('end', () => {
        if (this.noteOns.length === 0) {
          // console.log('trying to stop a sound that doesnt exist')
          return
        }
        let note = this.noteOns.shift()
        if (this.sound.playing() && this.noteOns[0] == note) return
        this.$root.$emit('noteOff', this.index)
        this.$root.$emit('pianoOff', note)
      })
    },

    toggleRecording() {
      console.log('toggleRecording')
      if (this.isRecording) {
        // console.log('starting recording in planet')
        store.recorder.start(store.recordings, this.name)
      } else {
        store.recorder.stop()
        this.hasRecording = true
        this.playing = false
        setTimeout(() => {
          if (store.recordings[this.name])
            store.recordings[this.name].addEventListener('ended', () => {
              console.log('ended')
              this.playing = false
            })
        }, 1000)
        // store.recordings[this.name].loop = true
      }
    },

    playNASA() {
      if (!this.playing) {
        store.soundscapes[this.name].volume(this.amplitude)
        store.soundscapes[this.name].play()
        store.soundscapes[this.name].fade(0, this.amplitude, 2000)
        this.playing = true
      } else {
        store.soundscapes[this.name].fade(this.amplitude, 0, 1000)
        setTimeout(() => {
          store.soundscapes[this.name].stop()
        }, 1000)
        this.playing = false
      }
    },

    playRecord() {
      if (!this.playing) {
        if (store.recordings[this.name]) store.recordings[this.name].play()
      } else {
        if (store.recordings[this.name]) store.recordings[this.name].pause()
        if (store.recordings[this.name])
          store.recordings[this.name].currentTime = 0
      }
      this.playing = !this.playing
    },

    toggleFact() {
      if (this.showFact)
        this.factIndex = (this.factIndex + 1) % this.facts.length
      this.showFact = !this.showFact
    },

    click(e) {
      console.log('click!')
      if (e.type === 'touchstart') this.hasTouch = true
      if (this.hasTouch && e.type !== 'touchstart') return
      if (!store.planets[this.index].draggable.enabled()) this.release()
    },

    release() {
      if (this.appMode === 'piano' || this.appMode === 'nasa') {
        if (!this.holding && !this.dragging) this.play()
      } else if (this.appMode === 'record' && !this.dragging) {
        if (!this.recording) this.play()
      }
      this.holding = false
      window.clearTimeout(this.holdingTimeoutId)
    },
  },
}
</script>

<style lang="scss" scoped>
svg {
  overflow: visible;
  circle.hasRecording {
    stroke: var(--active);
    stroke-width: 3px;
  }
  text {
    text-anchor: middle;
    fill: #707070;
    font-size: 24px;
    transition: fill 0.2s;
    &.playing {
      fill: var(--active);
    }
  }
}

.planet {
  &:hover {
    cursor: pointer;
  }
}

.hasRecording {
  stroke: red;
}

.planetCircle {
  stroke: var(--active);
  stroke-width: 0px;
  opacity: 0.97;
}
</style>
