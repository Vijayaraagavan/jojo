<template>
    <div class="icon" :style="{ backgroundColor: `#${props.user.color}` }">
        {{ first }}
    </div>
</template>
<script setup>
import { computed } from 'vue';

const props = defineProps(['user']);
const first = computed(() => {
    return props.user.displayName.slice(0, 1);
})
</script>

<style scoped>
.icon {
    width: 40px;
    height: 40px;
    text-align: center;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 20px;
    font-weight: 700;
}
</style>