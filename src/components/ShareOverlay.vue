<template>
    <Overlay>
        Your NepTune composition is saved at this link:
        <input :value="shareUrl" />
        Copy link
        <div class="shareArea">
            Share it on
            <div class="btnFacebook">
                <FontAwesomeIcon
                    :icon="['fab', 'facebook-f']"
                    @click="shareFacebook"
                ></FontAwesomeIcon>
                Facebook
            </div>
            <div class="btnTwitter">
                <FontAwesomeIcon :icon="['fab', 'twitter']"></FontAwesomeIcon>
                Twitter
            </div>
            <!-- <a
                href="https://twitter.com/intent/tweet?screen_name=SteamSpace1&ref_src=twsrc%5Etfw"
                class="twitter-mention-button"
                data-size="large"
                data-text="Just tried the Neptune app. "
                data-show-count="false"
                >Tweet to @SteamSpace1</a
            > -->
        </div>
    </Overlay>
</template>

<script>
import Overlay from '@/components/Overlay'

export default {
    components: {
        Overlay,
    },

    data() {
        return {
            shareUrl: 'https://neptune.com/cwypcvB',
            exit: false,
        }
    },

    mounted() {
        this.exit = false
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
    },
}
</script>

<style></style>
