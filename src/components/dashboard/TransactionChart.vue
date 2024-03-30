<template>
    <v-card>
        <v-card-title primary-title class="text-orange">
            Last 10 days total transactions
        </v-card-title>
        <apexchart v-if="loading" type="bar" :options="options" :series="series" :key="updateKey">
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
    // plotOptions: {
    //     bar: {
    //         horizontal: true
    //     }
    // },
    // title: {
    //     display: false,
    //     text: 'Last 10 days total transactions',
    //     fontSize: 18,
    // }
}
const series = ref([{
    name: 'Amount',
    data: []
},
{
    name: 'Maximum single transaction',
    data: []
}
])
const get = () => {
    if (!props.data) {
        return;
    }
    const keys = Object.keys(props.data);
    keys.sort();
    options.xaxis.categories = [];
    series.value[0].data = [];
    series.value[1].data = [];
    keys.forEach(k => {
        const el = props.data[k];
        options.xaxis.categories.push(k);
        series.value[0].data.push(el.amount);
        series.value[1].data.push(el.maximum);
    })
    updateKey.value += 1;
    loading.value = true;
}
onMounted(() => {
    get();
})
watch(() => props.data, get)
</script>