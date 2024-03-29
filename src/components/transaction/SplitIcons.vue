<template>
    <div class="d-flex">
        <UserIcon v-for="(item, index) in members.slice(0, 1)" :user="item" :key="index" size="16" />
        <UserIcon v-for="(item, index) in members.slice(1)" :user="item" :key="index" size="16" class="side" />
    </div>
</template>
<script setup>
import UserIcon from '@/components/splits/UserIcon.vue';
import { computed } from 'vue';
const props = defineProps(['members'])
const members = computed(() => props.members && props.members.filter(i => i.amount > 0));

</script>
<style scoped>
.side {
    position: relative;
    margin-left: -4px;
}
</style>