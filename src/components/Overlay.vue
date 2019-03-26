<template>
    <div>
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
    top: calc(0.5 * var(--icon-size));
    right: calc(0.5 * var(--icon-size));
    border: 1px solid var(--grey);
    border-radius: 50%;
    width: var(--icon-size) !important;
    height: var(--icon-size);
    padding: var(--icon-padding);
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
</style>
