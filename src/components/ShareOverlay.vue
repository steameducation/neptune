<template>
    <Overlay class="shareOverlay">
        <p>{{ $t('shareHeader') }}</p>
        <div id="shareDiv">
            <span id="shareUrl" @click="click">{{ shareUrl }}</span>
        </div>
        <br />

        <div class="clipboard">
            Copy link
            <FontAwesomeIcon
                icon="clipboard"
                class="clipboardIcon"
                data-clipboard-target="#shareUrl"
                data-clipboard-action="copy"
            ></FontAwesomeIcon>
        </div>

        <div class="shareArea">
            Share it on
            <div class="shareButtons">
                <a
                    href="https://www.facebook.com/sharer/sharer.php?u="
                    target="_blank"
                >
                    Facebook
                </a>

                <a
                    href="https://twitter.com/intent/tweet?screen_name=SteamSpace1&ref_src=twsrc%5Etfw"
                    class="twitter-mention-button"
                    data-size="large"
                    :data-text="twitterDataText"
                    data-show-count="false"
                    >Tweet to @SteamSpace1</a
                >

                <!-- <div class="btnFacebook">
                    <FontAwesomeIcon
                        :icon="['fab', 'facebook-f']"
                        @click="shareFacebook"
                    ></FontAwesomeIcon
                    >&nbsp;Facebook
                </div>

                <div class="btnTwitter">
                    <FontAwesomeIcon
                        :icon="['fab', 'twitter']"
                    ></FontAwesomeIcon
                    >&nbsp;Twitter
                </div> -->
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
            shareUUID: '34acfac9-4c50-4454-9f77-45c7478b4000',
            exit: false,
        }
    },

    computed: {
        showShare() {
            return store.showShare
        },

        shareUrl() {
            return `${window.location.origin}/${this.shareUUID}`
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

                api.post('compositions', json)
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
        // new window.Clipboard('.clipboardIcon')
    },

    methods: {
        getShareUrl() {},

        shareFacebook() {
            window.open(
                'https://www.facebook.com/sharer/sharer.php?u=http://stackoverflow.com',
                'pop',
                'width=600, height=400, scrollbars=no'
            )
        },

        click() {
            window.location.href = this.shareUrl
        },

        copyToClipboard() {
            document.querySelector('#shareUrl').select()
            document.execCommand('copy')
        },
    },
}
</script>

<style lang="scss">
.shareOverlay {
    width: 50%;
}

#shareDiv {
    margin-top: 10px !important;
    background: white;
    border-radius: 20px;
    border: 10px solid var(--accent) !important;
    // background: red;
    color: var(--accent);
    width: 600px;
    line-height: 2;
    margin: 0 auto;
    font-size: 16px;
    #shareUrl:hover {
        text-decoration: underline;
        cursor: pointer;
    }
}

.shareButtons {
    display: inline;
}

.btnFacebook,
.btnTwitter {
    border: 1px solid red;
    width: 300px;
    line-height: 2.5;
    border-radius: 30px;
}

.clipboard {
    .clipboardIcon {
        fill: red;
    }
}
</style>
