<template>
    <Overlay class="shareOverlay" keepalive>
        <div class="overlayContent">
            <p>{{ $t('shareHeader') }}</p>
            <div id="shareDiv" @click="click">
                {{ shareUrl }}
            </div>
            <br />

            <!-- <button
            class="copyButton"
            data-clipboard-target="#foo1"
            data-clipboard-action="copy"
        >
            Copy Text
        </button>

        <div class="clipboard">
            Copy link
            <FontAwesomeIcon
                icon="clipboard"
                class="clipboardIcon"
                data-clipboard-target="#foo1"
                data-clipboard-action="copy"
            ></FontAwesomeIcon>
        </div> -->

            <!-- <div id="foo1" data-clipboard-text="foobarbaconeggs">lorem</div> -->

            <div class="shareArea">
                <p>Share your NepTune composition!</p>
                <div class="shareButtons">
                    <div class="facebook">
                        <button class="btnFacebook" @click="facebook">
                            <FontAwesomeIcon
                                :icon="['fab', 'facebook-square']"
                            ></FontAwesomeIcon
                            >&nbsp;&nbsp;Share
                        </button>
                    </div>

                    <div class="twitter">
                        <a
                            href="https://twitter.com/intent/tweet?screen_name=SteamSpace1&ref_src=twsrc%5Etfw"
                            class="twitter-mention-button"
                            data-size="xlarge"
                            :data-text="twitterDataText"
                            data-show-count="false"
                            >Tweet to @SteamSpace1</a
                        >
                        <!--<div class="btnTwitter">
                    <FontAwesomeIcon
                        :icon="['fab', 'twitter']"
                    ></FontAwesomeIcon
                    >&nbsp;Twitter
                </div> -->
                    </div>
                </div>
            </div>
        </div>
    </Overlay>
</template>

<script>
import Overlay from '@/components/Overlay'
import store from '@/store.js'
import { api, compositionToJson } from '@/store.js'

export default {
    components: {
        Overlay,
    },

    data() {
        return {
            shareUUID: '',
            exit: false,
        }
    },

    computed: {
        showShare() {
            return store.showShare
        },

        shareUrl() {
            return `${window.location.host}/${this.shareUUID}`
        },

        twitterDataText() {
            return `${this.$t('twitterDataText')} ${this.shareUrl}`
        },
    },

    watch: {
        showShare() {
            if (this.showShare) {
                const json = compositionToJson()
                console.log(JSON.stringify(json))

                api.post('/compositions', json)
                    .then(response => {
                        const { uuid } = response.data
                        this.shareUUID = uuid
                    })
                    .catch(error => {
                        console.error('Error saving composition to database')
                        console.log(error)
                    })
            }
        },
    },

    mounted() {
        this.exit = false
        setTimeout(() => {
            store.showShare = false // NOTE: Hack so that twitter button gets properly styled
        }, 1000)
    },

    methods: {
        facebook() {
            const baseFacebookUrl =
                'https://www.facebook.com/sharer/sharer.php?u='
            const url = `${baseFacebookUrl}http://neptune.nunoh.com`
            console.log({ url })
            window.open(url, 'pop', 'width=600, height=400, scrollbars=no')
        },

        click() {
            window.location.origin = this.shareUrl
        },
    },
}
</script>

<style lang="scss">
.shareOverlay {
    width: 50%;
}

#shareDiv {
    padding: 0 10px;
    // margin-top: 10px !important;
    // margin-bottom: 10px !important;
    margin: 10px 0 30px !important;
    background: white;
    border-radius: 20px;
    border: 10px solid var(--accent) !important;
    color: var(--accent);
    display: inline-block;
    line-height: 2;
    margin: 0 auto;
    font-size: 1em;
    &:hover {
        text-decoration: underline;
        cursor: pointer;
    }
}

.facebook,
.twitter {
    margin: 8px;
    align-self: center;
    justify-self: center;
    // border: 1px solid red;
}

.btnFacebook:hover {
    cursor: pointer !important;
    background: rgba(58, 87, 155, 1);
}

.btnFacebook {
    background: rgba(58, 87, 155, 0.9);
    border-radius: 5px;
    color: white;
    width: 100px;
    font-size: 0.9em;
    font-weight: bold;
    border: none;
}

.btnTwitter {
    margin-right: 10px;
}

.btnFacebook,
.btnTwitter {
    line-height: 2.5;
}

.clipboard {
    .clipboardIcon {
        fill: red;
    }
}

.overlayContent {
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
}
</style>
