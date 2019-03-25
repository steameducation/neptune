<template>
    <Overlay>
        <section class="credits">
            <div class="wrapper">
                <h1>NepTUNE</h1>
                <p>
                    A simply dummy text of the printing and typesetting
                    industry. Lorem Ipsum has been the industry’s standard dummy
                    text ever since the 1500s.
                </p>

                <p>
                    It was popularised in the 1960s with the release of Letraset
                    sheets containing.
                </p>

                <div class="steamGroup">
                    <a target="_blank" href="http://steameducation.eu/">
                        <img
                            src="/img/logos/space.png"
                            class="logo steam"
                            alt=""
                        />
                    </a>
                    <a target="_blank" href="http://steameducation.eu/"
                        >steameducation.eu</a
                    >
                </div>
            </div>
        </section>

        <section class="furtherCredits">
            <div class="wrapper">
                <h2>Further Credits</h2>
                <p>
                    A simply dummy text of the printing and typesetting
                    industry. Lorem Ipsum.
                </p>
                <a target="_blank" href="https://digitopia.casadamusica.com/">
                    <img
                        src="/img/logos/digitopia.png"
                        class="logo digitopia"
                        alt=""
                    />
                </a>
                <a target="_blank" href="http://www.casadamusica.com/"
                    ><img src="/img/logos/cdm.png" class="logo cdm" alt=""
                /></a>
            </div>
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
    padding: 10px;
    background: white;
}

.steam {
    width: 160px;
}

.steamGroup {
    img {
        display: block;
        margin: 0 auto;
    }
    text-align: center;
    margin-bottom: 30px;
}

.digitopia,
.cdm {
    height: 60px;
}

.cdm {
    margin-left: 15px;
}

.wrapper {
    width: 55%;
    margin: 0 auto;
}

section {
    margin: 0 auto;
    text-align: left !important;
    p {
        margin: 20px 0;
    }
}

.credits {
    // height: 80%;
    margin-top: 100px;
    h1 {
        margin-bottom: 20px;
    }
}

.furtherCredits {
    padding: 10px 0;
    height: 20%;
    background: #171411;
    text-align: left;
    font-size: 14px;
    display: flex;
    flex: 2;
    margin: 0;
}
</style>
