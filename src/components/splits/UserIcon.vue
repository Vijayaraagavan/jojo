<template>
    <div class="icon text-capitalize"
        :style="{ backgroundColor: `#${props.user.color}`, fontSize: `${props.size}px`, width: `${props.size * 2}px`, height: `${props.size * 2}px` }">
        {{ first }}
    </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps({
    user: Object,
    size: {
        default: 20
    }
});
const first = computed(() => {
    if (props.user.displayName) {
        return props.user.displayName.slice(0, 1);
    } else {
        return 'X'
    }
})
</script>

<style scoped>
.icon {
    /* width: 40px;
    height: 40px; */
    text-align: center;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    /* font-size: 20px; */
    font-weight: 500;
}
</style>