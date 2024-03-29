<template>
    <Split :updateSplit="split" />
</template>

<script setup>
import { useSplitStore } from '@/stores/split';
import Split from '@/components/splits/Split.vue';
const { split } = useSplitStore();
</script>