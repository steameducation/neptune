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

<style lang="scss">
.btnOverlayClose {
    position: absolute;
    top: 50px;
    right: 50px;
    border: 1px solid var(--grey);
    border-radius: 50%;
    width: 40px !important;
    height: 40px;
    padding: 10px;
    color: white;
    &:hover {
        border: 1px solid var(--active);
        color: var(--active);
    }
}

.btnOverlayClose {
    &:hover {
        cursor: pointer;
    }
}

.overlay {
    height: 100%;
    display: flex;
    flex-direction: column;
    margin: 0;
}
</style>
