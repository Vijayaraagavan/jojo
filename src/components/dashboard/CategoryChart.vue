<template>
    <v-card>
        <v-card-title primary-title class="text-orange">
            Category wise expense
        </v-card-title>
        <apexchart v-if="loading" type="pie" :options="options" :series="series" :key="updateKey">
        </apexchart>
    </v-card>
</template>
<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { watch } from 'vue';
import { reactive } from 'vue';
const props = defineProps(['data']);
const loading = ref(false);
const updateKey = ref(1);
const options = {
    chart: {
        id: 'vuechart-example'
    },
    xaxis: {
        categories: reactive([])
    },
    colors: ['#F06292', '#546E7A'],
    labels: []
}
const series = ref([])
const get = () => {
    if (!props.data) {
        return;
    }
    const keys = Object.keys(props.data);
    keys.sort();
    options.labels = [];
    series.value = [];
    keys.forEach(k => {
        const el = props.data[k];
        options.labels.push(k);
        series.value.push(el.amount);
    })
    updateKey.value += 1;
    loading.value = true;
}
onMounted(() => {
    get();
})
watch(() => props.data, get)
</script>