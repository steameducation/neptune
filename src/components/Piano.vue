<template>
    <svg
        id="mypiano"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 426.629 243.788"
    >
        <g id="Piano" transform="translate(-1474.033 -84.212)">
            <g
                id="C3"
                transform="translate(1474.033 84.212)"
                class="white"
                @click="pianoOn('C3')"
            >
                <rect width="53.329" height="243.788" stroke="none" />
                <rect x="0.5" y="0.5" width="52.329" height="242.788" />
            </g>
            <g
                id="D3"
                transform="translate(1527.362 84.212)"
                class="white"
                @click="pianoOn('D3')"
            >
                <rect width="53.329" height="243.788" stroke="none" />
                <rect
                    x="0.5"
                    y="0.5"
                    width="52.329"
                    height="242.788"
                    fill="none"
                />
            </g>
            <g
                id="E3"
                transform="translate(1580.69 84.212)"
                class="white"
                @click="pianoOn('E3')"
            >
                <rect width="53.329" height="243.788" stroke="none" />
                <rect
                    x="0.5"
                    y="0.5"
                    width="52.329"
                    height="242.788"
                    fill="none"
                />
            </g>
            <g
                id="F3"
                transform="translate(1634.019 84.212)"
                class="white"
                @click="pianoOn('F3')"
            >
                <rect width="53.329" height="243.788" stroke="none" />
                <rect
                    x="0.5"
                    y="0.5"
                    width="52.329"
                    height="242.788"
                    fill="none"
                />
            </g>
            <g
                id="G3"
                transform="translate(1687.348 84.212)"
                class="white"
                @click="pianoOn('G3')"
            >
                <rect width="53.329" height="243.788" stroke="none" />
                <rect
                    x="0.5"
                    y="0.5"
                    width="52.329"
                    height="242.788"
                    fill="none"
                />
            </g>
            <g
                id="A3"
                transform="translate(1740.676 84.212)"
                class="white"
                @click="pianoOn('A3')"
            >
                <rect width="53.329" height="243.788" stroke="none" />
                <rect
                    x="0.5"
                    y="0.5"
                    width="52.329"
                    height="242.788"
                    fill="none"
                />
            </g>
            <g
                id="B3"
                transform="translate(1794.005 84.212)"
                class="white"
                @click="pianoOn('B3')"
            >
                <rect width="53.329" height="243.788" stroke="none" />
                <rect
                    x="0.5"
                    y="0.5"
                    width="52.329"
                    height="242.788"
                    fill="none"
                />
            </g>
            <g
                id="C4"
                transform="translate(1847.333 84.212)"
                class="white"
                @click="pianoOn('C4')"
            >
                <rect width="53.329" height="243.788" stroke="none" />
                <rect
                    x="0.5"
                    y="0.5"
                    width="52.329"
                    height="242.788"
                    fill="none"
                />
            </g>
            <path
                id="Db3"
                d="M0,0H36.568a0,0,0,0,1,0,0V154.986a5,5,0,0,1-5,5H5a5,5,0,0,1-5-5V0A0,0,0,0,1,0,0Z"
                transform="translate(1509.078 84.212)"
                @click="pianoOn('Db3')"
            />
            <path
                id="Eb3"
                d="M0,0H36.568a0,0,0,0,1,0,0V154.986a5,5,0,0,1-5,5H5a5,5,0,0,1-5-5V0A0,0,0,0,1,0,0Z"
                transform="translate(1562.406 84.212)"
                @click="pianoOn('Eb3')"
            />
            <path
                id="Gb3"
                d="M0,0H36.568a0,0,0,0,1,0,0V154.986a5,5,0,0,1-5,5H5a5,5,0,0,1-5-5V0A0,0,0,0,1,0,0Z"
                transform="translate(1669.063 84.212)"
                @click="pianoOn('Gb3')"
            />
            <path
                id="Ab3"
                d="M0,0H36.568a0,0,0,0,1,0,0V154.986a5,5,0,0,1-5,5H5a5,5,0,0,1-5-5V0A0,0,0,0,1,0,0Z"
                transform="translate(1722.392 84.212)"
                @click="pianoOn('Ab3')"
            />
            <path
                id="Bb3"
                d="M0,0H36.568a0,0,0,0,1,0,0V154.986a5,5,0,0,1-5,5H5a5,5,0,0,1-5-5V0A0,0,0,0,1,0,0Z"
                transform="translate(1775.721 84.212)"
                @click="pianoOn('Bb3')"
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
            this.$root.$on('noteOn', this.pianoOn)
            this.$root.$on('noteOff', this.pianoOff)
        }
    },

    methods: {
        pianoOn(note) {
            return
            if (!this.highlight) return
            this.setHighlight(note, true)
        },

        pianoOff(note) {
            return
        },

        setHighlight(note, bool) {
            const key = this.$el.querySelector(`#${note}`)
            key.classList.toggle('active')
        },
    },
}
</script>

<style lang="scss">
.white {
    fill: #fff;
    stroke: #707070;
}

g .active {
    fill: var(--active);
}
</style>
