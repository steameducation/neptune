<template>
    <div class="overlay">
        <FontAwesomeIcon
            class="btnOverlayClose"
            icon="times"
            @click="dismiss"
        ></FontAwesomeIcon>
        <slot />
    </div>
</template>

<script>
import store from '@/store.js'

export default {
    mounted() {
        document.addEventListener('keyup', evt => {
            console.log('pressing a key')
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
<script>
export default {}
</script>

<style lang="scss">
.btnOverlayClose {
    position: absolute;
    top: 50px;
    right: 50px;
    border: 1px solid var(--grey);
    border-radius: 50%;
    width: 30px !important;
    height: 30px;
    padding: 5px;
    color: white;
}

.overlay {
    display: flex;
    flex-direction: column;
}
</style>
