<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="boxWidth"
    :height="boxHeight"
    :viewBox="`0 0 ${boxWidth} ${boxHeight}`"
  >
    <!-- top-right -->
    <g v-if="position == 'top-right'" :transform="`translate(100 -200)`">
      <g
        id="Group_91"
        data-name="Group 91"
        transform="translate(-1367.203 -100)"
      >
        <path
          id="Union_1"
          data-name="Union 1"
          d="M-1989.492-1696.452q-.008-.273-.009-.549v-126a17.5,17.5,0,0,1,17.5-17.5h365a17.5,17.5,0,0,1,17.5,17.5v126a17.5,17.5,0,0,1-17.5,17.5h-353.943l-31.274,3.8Z"
          transform="translate(3360 1941)"
          stroke="#f8b763"
          stroke-width="3"
        />
        <FactInfo :width="textWidth" :height="textHeight" :fact="fact" />
      </g>
    </g>

    <!-- top-left -->
    <g v-if="position == 'top-left'" :transform="`translate(100 -200)`">
      <g
        id="Group_93"
        data-name="Group 93"
        transform="translate(1771 262) rotate(180)"
      >
        <path
          id="Union_1"
          data-name="Union 1"
          d="M-1972-1679.5a17.5,17.5,0,0,1-17.5-17.5v-114.386l-7.311-29.49,44.757.377H-1607a17.5,17.5,0,0,1,17.5,17.5v126a17.5,17.5,0,0,1-17.5,17.5Z"
          transform="translate(3950 1941)"
          stroke="#f8b763"
          stroke-width="1"
        />
      </g>
      <FactInfo
        :width="textWidth"
        :height="textHeight"
        :transform="`translate(-570 10)`"
        :fact="fact"
      />
    </g>

    <!-- bottom-left -->
    <g v-else-if="position == 'bottom-left'" :transform="`translate(100 -200)`">
      <g
        id="Group_92"
        data-name="Group 92"
        transform="translate(1771 266.872) rotate(180)"
      >
        <g
          id="Repeat_Grid_2"
          data-name="Repeat Grid 2"
          transform="translate(1365.203 100)"
          clip-path="url(#clip-path)"
        >
          <g transform="translate(-760 -300)">
            <path
              id="Union_1"
              data-name="Union 1"
              d="M-1989.5-1710.611V-1823a17.5,17.5,0,0,1,17.5-17.5h365a17.5,17.5,0,0,1,17.5,17.5v126a17.5,17.5,0,0,1-17.5,17.5h-347.706l-39.51,4.8Z"
              transform="translate(3360 1941)"
              stroke="#f8b763"
              stroke-width="1"
            />
          </g>
        </g>
      </g>
      <FactInfo
        :width="textWidth"
        :height="textHeight"
        :transform="`translate(-580 210)`"
        :fact="fact"
      />
    </g>

    <!-- bottom-right -->
    <g v-else-if="position == 'bottom-right'" :transform="`translate(100 50)`">
      <g
        id="Group_93"
        data-name="Group 93"
        transform="translate(-1362.548 -99.617)"
      >
        <path
          id="Union_1"
          data-name="Union 1"
          d="M-1972-1679.5a17.5,17.5,0,0,1-17.5-17.5v-114.386l-7.311-29.49,44.757.377H-1607a17.5,17.5,0,0,1,17.5,17.5v126a17.5,17.5,0,0,1-17.5,17.5Z"
          transform="translate(3360 1941)"
          stroke="#f8b763"
          stroke-width="1"
        />
        <g
          transform="matrix(1, 0, 0, 1, 1362.55, 99.62)"
          filter="url(#An_example_of_a_related_fact_goes_here._Lorem_ipsum_dolor_sit_amet_consectetur_adipiscing_elit._)"
        >
          <text
            id="An_example_of_a_related_fact_goes_here._Lorem_ipsum_dolor_sit_amet_consectetur_adipiscing_elit._2"
            data-name="An example of a related fact goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
            transform="translate(42.45 22.38)"
            fill="#f8b763"
            font-size="20"
            font-family="SpaceMono-Regular, Space Mono"
          >
            <tspan x="0" y="22">An example of a related</tspan>
            <tspan x="0" y="52">fact goes here. Lorem ipsum</tspan>
            <tspan x="0" y="82">dolor sit amet, consectetur</tspan>
            <tspan x="0" y="112">adipiscing elit.</tspan>
          </text>
        </g>
      </g>

      <FactInfo
        :width="textWidth"
        :height="textHeight"
        :transform="`translate(30 10)`"
        :fact="fact"
      />
    </g>
  </svg>
</template>

<script>
import store from '@/store.js'

import FactInfo from '@/components/FactInfo.vue'

export default {
  components: {
    FactInfo,
  },

  props: {
    fact: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    planetName: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      // values from exported svg from adobe xd
      boxWidth: 400,
      boxHeight: 187,
      offsetX: 1990,
      offsetY: 1841,
      padding: 10,
      position: 'top-right', // where to have the ballon box
    }
  },

  computed: {
    boxX() {
      return this.offsetX - this.boxWidth / 2
    },

    boxY() {
      return this.offsetY - this.boxHeight - this.size / 2 - this.padding
    },

    textX() {
      return -this.boxWidth / 2 + (0.1 * this.boxWidth) / 2
    },

    textY() {
      return -this.boxHeight - this.$parent.size / 2
      // return -this.boxHeight
      // return -this.boxHeight - this.padding * 2
      // return -1.5 * this.boxHeight + this.padding * 3
    },

    textWidth() {
      return 0.9 * this.boxWidth
    },

    textHeight() {
      return 0.8 * this.boxHeight
    },
  },

  created() {
    this.$root.$on('updatePlanetPosition', this.updateFactPosition)
  },

  methods: {
    updateFactPosition() {
      const sel = `#planet-${this.planetName}`
      const size = this.$parent.size
      const elem = document.querySelector(sel)
      const matrix = elem.transform.baseVal.getItem(0).matrix // type is SVGMatrix

      const x = matrix.e - size / 2
      const y = matrix.f - size / 2

      console.log({ sel, size, matrix, x, y })

      const w = store.canvas.width
      const h = store.canvas.height

      if (x >= w / 2) {
        // right
        if (y >= h / 2) {
          // is in bottom right
          this.position = 'top-left'
        } else {
          // is in top right
          this.position = 'bottom-left'
        }
      } else {
        // left
        if (y >= h / 2) {
          // is in bottom left
          this.position = 'top-right'
        } else {
          // is in top left
          this.position = 'bottom-right'
        }
      }

      console.log('this.position', this.position)
    },
  },
}
</script>

<style lang="scss">
.fact {
  stroke: var(--active);
}

.factText {
  color: var(--active);
  font-size: 20px;
}
</style>
