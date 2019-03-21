<template>
    <div>
        <FontAwesomeIcon icon="times" @click="dismiss"></FontAwesomeIcon>
        <slot />
    </div>
</template>

<script>
import store from '@/store.js'

export default {
    mounted() {
        document.addEventListener('keyup', evt => {
            if (evt.key === 'Escape') this.dismiss()
        })
    },

    methods: {
        dismiss() {
            store.showInfo = false
            store.showShare = false
        },
    },
}
</script>

<style lang="scss"></style>
