<template>
    <div class="d-flex">
        <UserIcon v-for="(item, index) in props.members.slice(0, 1)" :user="item" :key="index" size="16" />
        <UserIcon v-for="(item, index) in props.members.slice(1)" :user="item" :key="index" size="16" class="side" />
    </div>
</template>
<script setup>
import UserIcon from '@/components/splits/UserIcon.vue';
const props = defineProps(['members'])
</script>
<style scoped>
.side {
    position: relative;
    margin-left: -4px;
}
</style>