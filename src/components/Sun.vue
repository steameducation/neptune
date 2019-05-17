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
                x="-10"
                y="-50"
                width="358.027"
                height="937.357"
                filterUnits="userSpaceOnUse"
            >
                <feOffset input="SourceAlpha" />
                <feGaussianBlur :stdDeviation="stdDeviation" result="blur" />
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
            playing: false,
            fading: false,
            stdDeviationObj: {
                max: 50,
                val: 50,
            },
        }
    },

    computed: {
        stdDeviation() {
            return this.stdDeviationObj.val
        },

        floodColor() {
            return this.playing ? 'red' : '#ffc20f'
        },
    },

    watch: {
        playing() {
            this.fading = true
            if (this.playing) {
                store.sun[0].fade(0, 0.3, 100)
                store.sun[1].fade(0, 0.3, 100)
                store.sun[2].fade(0, 0.3, 100)
                store.sun[0].play()
                store.sun[1].play()
                store.sun[2].play()
                setTimeout(() => {
                    this.fading = false
                })
            } else {
                store.sun[0].fade(store.sun[0].volume(), 0, 1500)
                store.sun[1].fade(store.sun[1].volume(), 0, 1500)
                store.sun[2].fade(store.sun[2].volume(), 0, 1500)
                setTimeout(() => {
                    this.fading = false
                    store.sun[0].stop()
                    store.sun[1].stop()
                    store.sun[2].stop()
                }, 1500)
            }
        },
    },

    mounted() {
        console.log('mounted')
        const val = !this.playing
            ? this.stdDeviationObj.max
            : this.stdDeviationObj.min
        console.log({ val })
        // window.TweenMax.to(this.stdDeviationObj, 0.5, {
        //     val,
        //     onUpdate: () => {
        //         console.log('updating')
        //     },
        //     yoyo: true,
        //     repeat: -1,
        // })
        this.y = store.canvas.height / 2 - this.height / 2
    },

    methods: {
        play() {
            if (this.fading) return // ignore clicks if fading
            this.playing = !this.playing
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
