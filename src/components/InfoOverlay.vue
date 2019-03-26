<template>
    <Overlay>
        <section id="credits">
            <div class="wrapper">
                <div class="meta-wrapper">
                    <h1>NepTUNE</h1>
                    <p>
                        A simply dummy text of the printing and typesetting
                        industry. Lorem Ipsum has been the industry’s standard
                        dummy text ever since the 1500s.
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
            </div>
        </section>

        <section id="furtherCredits">
            <div class="wrapper">
                <div class="meta-wrapper">
                    <h2>Further Credits</h2>
                    <p>
                        A simply dummy text of the printing and typesetting
                        industry.
                    </p>
                    <div class="logos">
                        <a
                            target="_blank"
                            href="https://digitopia.casadamusica.com/"
                        >
                            <img
                                src="/img/logos/digitopia.png"
                                class="logo digitopia"
                                alt=""
                            />
                        </a>
                        <a target="_blank" href="http://www.casadamusica.com/"
                            ><img
                                src="/img/logos/cdm.png"
                                class="logo cdm"
                                alt=""
                        /></a>
                    </div>
                </div>
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

    created() {
        new Image().src = '/img/logos/cdm.png'
        new Image().src = '/img/logos/digitopia.png'
        new Image().src = '/img/logos/space.png'
    },
}
</script>

<style lang="scss">
.wrapper {
    width: 50%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
}

section {
    text-align: left;
    display: flex;
    font-size: 0.8em;
}

#credits {
    padding-top: var(--icon-size);
    height: 60%;
    a {
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }
    .steam {
        width: 20%;
    }
}

#furtherCredits {
    padding-top: 10px;
    height: 40%;
    background: #171411;
    img {
        margin-top: 10px;
        height: 36px;
    }
    .cdm {
        margin-left: 10px;
    }
}

.logo {
    border-radius: 5px;
    padding: 8px;
    background: white;
}

p,
a {
    font-size: 1em;
}

.steamGroup {
    margin-top: 10px;
    img {
        display: block;
        margin: 0 auto;
    }
    text-align: center;
}
</style>
