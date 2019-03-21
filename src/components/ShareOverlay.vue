<template>
    <Overlay>
        Your NepTUNE composition is saved at this link:
        <input :value="shareUrl" />
        Copy link
        <div class="shareArea">
            Share it on
            <div class="btnFacebook">
                <FontAwesomeIcon
                    :icon="['fab', 'facebook-f']"
                ></FontAwesomeIcon>
                Facebook
            </div>
            <div class="btnTwitter">
                <FontAwesomeIcon :icon="['fab', 'twitter']"></FontAwesomeIcon>
                Twitter
            </div>
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

    watch: {
        exit() {
            console.log('exit change to', this.exit)
        },
    },

    mounted() {
        this.exit = false
    },

    methods: {
        getShareUrl() {
            console.log('posting to backend')
        },
    },
}
</script>

<style></style>
