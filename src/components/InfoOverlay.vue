<template>
    <Overlay>
        <section>
            <h1>NepTUNE</h1>
            <p>
                A simply dummy text of the printing and typesetting industry.
                Lorem Ipsum has been the industry’s standard dummy text ever
                since the 1500s.
            </p>

            <p>
                It was popularised in the 1960s with the release of Letraset
                sheets containing.
            </p>

            <p>
                <img src="" class="logo steam" alt="" />
                <a target="_blank" href="http://steameducation.eu/"
                    >steameducation.eu</a
                >
            </p>
        </section>

        <section>
            <h2>Further Credits</h2>
            <p>
                A simply dummy text of the printing and typesetting industry.
                Lorem Ipsum
            </p>
            <img src="" class="logo digitopia" alt="" />
            <img src="" class="logo ddm" alt="" />
        </section>
    </Overlay>
</template>

<script>
import Overlay from '@/components/Overlay'

export default {
    components: {
        Overlay,
    },
}
</script>

<style lang="scss">
.logo {
    border-radius: 10px;
}
</style>
