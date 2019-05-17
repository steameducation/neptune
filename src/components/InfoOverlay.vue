<template>
    <Overlay>
        <section id="credits">
            <div class="wrapper">
                <div class="meta-wrapper">
                    <h1>NepTune</h1>

                    <div v-html="$t('info.neptune')"></div>

                    <!-- <p>
                        NepTune is a web-based app developed in the context of
                        the Strategic Partnership SPACE, funded by the Erasmus+
                        program. It is both a musical instrument and an
                        educational tool for teachers and students, from any
                        level. It was conceptualized by the SPACE consortium,
                        composed by the teachers, from all our partner
                        institutions, and also students from AP University
                        College Antwerp, Dundalk Institute of Technology, and
                        Western Norway University of Applied Sciences.
                    </p>

                    <p>
                        Its main goal is to explore the common ground between
                        science (specifically, astronomy) and music, using the
                        planets from our solar system as a model, so it is, by
                        definition, a STEAM (Science, Technology, Engineering,
                        Arts and Mathematics) project.
                    </p>

                    <p>
                        You can use it in any device capable of running an
                        updated version of most web browsers, and it functions
                        on three modes (found on the bottom):
                    </p>

                    <ol>
                        <li>
                            the pitched mode, meaning musical notes from the
                            scale you choose;
                        </li>

                        <li>
                            space sounds, based on a collection of open-source
                            sounds from space;
                        </li>

                        <li>
                            as a recording tool, using your own sounds.
                        </li>
                    </ol>

                    <p>
                        For each of these modes, if you tap the planets it will
                        play the assigned sounds. If you long press a planet, it
                        will show a fun fact about it, related do the STEAM
                        subjects.
                    </p> -->

                    <div class="steamGroup">
                        <a target="_blank" href="http://steameducation.eu/">
                            <img
                                src="img/logos/space.png"
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
                    <h2>Credits</h2>

                    <div v-html="$t('info.credits')"></div>

                    <!-- Programming, development and design:<br />
                    <a
                        class="linkCdm"
                        href="https://digitopia.casadamusica.com/"
                        target="_blank"
                    >
                        Worten Digitópia Casa da Música</a
                    >:
                    <ul>
                        <li>Curator – Óscar Rodrigues</li>
                        <li>Development – Nuno Hespanhol</li>
                        <li>Testing and Sound Design – Filipe Fernandes</li>
                    </ul> -->

                    <div class="logos">
                        <a
                            target="_blank"
                            href="https://digitopia.casadamusica.com/"
                        >
                            <img
                                src="img/logos/digitopia.png"
                                class="logo digitopia"
                                alt=""
                            />
                        </a>
                        <a target="_blank" href="http://www.casadamusica.com/"
                            ><img
                                src="img/logos/cdm.png"
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
        new Image().src = 'img/logos/cdm.png'
        new Image().src = 'img/logos/digitopia.png'
        new Image().src = 'img/logos/space.png'
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
        color: var(--active);
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
    // background-color: #171411;
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
//
ol {
    li {
        // display: inline-block;
        margin-left: 40px;
    }
    margin-bottom: 10px;
}

ul {
    li {
        margin-left: 14px;
    }
}

#credits {
    p {
        margin-bottom: 10px;
    }
}

.linkCdm {
    text-decoration: none;
    color: var(--active) !important;
    &:hover {
        text-decoration: underline;
    }
}
</style>
