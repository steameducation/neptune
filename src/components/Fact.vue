<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="boxWidth"
        :height="boxHeight"
        :viewBox="`0 0 ${boxWidth} ${boxHeight}`"
        transform="translate(0, 200)"
    >
        <path
            class="fact"
            d="M-1808.41-1679.5H-1972a17.5,17.5,0,0,1-17.5-17.5v-126a17.5,17.5,0,0,1,17.5-17.5h365a17.5,17.5,0,0,1,17.5,17.5v126a17.5,17.5,0,0,1-17.5,17.5h-163.2l-19.3,24.63Z"
            :transform="`translate(${boxX} ${boxY})`"
        />
        <foreignObject
            class="factText"
            :width="textWidth"
            :height="textHeight"
            :transform="`translate(${textX} ${textY})`"
        >
            <p>
                {{ fact }}
            </p>
        </foreignObject>
    </svg>
</template>

<script>
export default {
    props: {
        fact: {
            type: String,
            required: true,
        },
        size: {
            type: Number,
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
            return 1.0 * this.boxHeight
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
    font-size: 22px;
}
</style>
