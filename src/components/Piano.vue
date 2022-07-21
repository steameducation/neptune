<template>
  <svg
    id="mypiano"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 426.629 243.788"
  >
    <g id="Piano" transform="translate(-1474.033 -84.212)">
      <g id="C3" transform="translate(1474.033 84.212)" class="white">
        <rect width="53.329" height="243.788" />
      </g>
      <g id="D3" transform="translate(1527.362 84.212)" class="white">
        <rect width="53.329" height="243.788" />
      </g>
      <g id="E3" transform="translate(1580.69 84.212)" class="white">
        <rect width="53.329" height="243.788" />
      </g>
      <g id="F3" transform="translate(1634.019 84.212)" class="white">
        <rect width="53.329" height="243.788" />
      </g>
      <g id="G3" transform="translate(1687.348 84.212)" class="white">
        <rect width="53.329" height="243.788" />
      </g>
      <g id="A3" transform="translate(1740.676 84.212)" class="white">
        <rect width="53.329" height="243.788" />
      </g>
      <g id="B3" transform="translate(1794.005 84.212)" class="white">
        <rect width="53.329" height="243.788" />
      </g>
      <g id="C4" transform="translate(1847.333 84.212)" class="white">
        <rect width="53.329" height="243.788" />
      </g>
      <path
        id="Db3"
        d="M0,0H36.568a0,0,0,0,1,0,0V154.986a5,5,0,0,1-5,5H5a5,5,0,0,1-5-5V0A0,0,0,0,1,0,0Z"
        transform="translate(1509.078 84.212)"
      />
      <path
        id="Eb3"
        d="M0,0H36.568a0,0,0,0,1,0,0V154.986a5,5,0,0,1-5,5H5a5,5,0,0,1-5-5V0A0,0,0,0,1,0,0Z"
        transform="translate(1562.406 84.212)"
      />
      <path
        id="Gb3"
        d="M0,0H36.568a0,0,0,0,1,0,0V154.986a5,5,0,0,1-5,5H5a5,5,0,0,1-5-5V0A0,0,0,0,1,0,0Z"
        transform="translate(1669.063 84.212)"
      />
      <path
        id="Ab3"
        d="M0,0H36.568a0,0,0,0,1,0,0V154.986a5,5,0,0,1-5,5H5a5,5,0,0,1-5-5V0A0,0,0,0,1,0,0Z"
        transform="translate(1722.392 84.212)"
      />
      <path
        id="Bb3"
        d="M0,0H36.568a0,0,0,0,1,0,0V154.986a5,5,0,0,1-5,5H5a5,5,0,0,1-5-5V0A0,0,0,0,1,0,0Z"
        transform="translate(1775.721 84.212)"
      />
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    highlight: {
      type: Boolean,
      default: false,
    },
  },

  created() {
    if (this.highlight) {
      this.$root.$on('pianoOn', this.pianoOn)
      this.$root.$on('pianoOff', this.pianoOff)
      this.$root.$on('pianoClear', this.pianoClear)
    }
  },

  methods: {
    pianoOn(note) {
      // console.log('pianoOn', { note })
      if (!this.highlight) return
      this.setHighlight(note, true)
    },

    pianoOff(note) {
      if (!this.highlight) return
      this.setHighlight(note, false)
    },

    pianoClear() {
      // console.log('pianoClear')
      if (!this.highlight) return
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
      ]
      notes.forEach((note) => this.setHighlight(note, false))
    },

    setHighlight(note, bool) {
      const key = this.$el.querySelector(`#${note}`)
      if (bool) key.classList.add('active')
      else key.classList.remove('active')
    },
  },
}
</script>

<style lang="scss">
.white {
  fill: #fff;
}

path {
  stroke: #707070;
}

g .active {
  fill: var(--active);
}
</style>
