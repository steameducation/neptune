<template>
    <svg
        width="358.027"
        height="937.357"
        viewBox="0 0 358.027 937.357"
        x="0"
        :y="y"
        @click="play"
    >
        <defs>
            <filter
                id="sunFilter"
                x="0"
                y="-50"
                width="358.027"
                height="937.357"
                filterUnits="userSpaceOnUse"
            >
                <feOffset input="SourceAlpha" />
                <feGaussianBlur stdDeviation="49.5" result="blur" />
                <feFlood :flood-color="floodColor" />
                <feComposite operator="in" in2="blur" />
                <feComposite in="SourceGraphic" />
            </filter>
        </defs>
        <path
            id="sun"
            filter="url(#sunFilter)"
            :d="`m 0 ${height} A ${width} 500 0 0 0 0 0`"
            fill="#ffc20f"
        />
    </svg>
</template>

<script>
import store from '@/store.js'

export default {
    data() {
        return {
            y: 0,
            height: 600,
            width: 200,
        }
    },

    computed: {
        floodColor() {
            return '#ffc20f'
            // if (store.sounds['C3'].playing()) {
            //     return '#ffc20f'
            // } else {
            //     return 'red'
            // }
        },
    },

    mounted() {
        this.y = store.canvas.height / 2 - this.height / 2
    },

    methods: {
        play() {
            store.sounds['C3'].play()
        },
    },
}
</script>

<style lang="scss">
#sun {
    &:hover {
        cursor: pointer;
    }
}
</style>
