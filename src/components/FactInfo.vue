<template>
  <foreignObject
    class="factText"
    :width="width"
    :height="height"
    :transform="transformAux"
  >
    <div
      class="d-flex align-items-center"
      style="height: 140px; display: flex; align-items: center"
    >
      <p>
        {{ fact }}
      </p>
    </div>
  </foreignObject>
</template>

<script>
export default {
  props: ['width', 'height', 'fact', 'transform'],

  computed: {
    transformAux() {
      if (this.transform) return this.transform
      return 'translate(1390 105)'
    },
  },
}
</script>
