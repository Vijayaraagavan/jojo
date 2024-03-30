<template>
    <v-card>
        <v-card-title primary-title class="text-orange">
            Member spending
        </v-card-title>
        <apexchart v-if="loading" type="bar" :options="options" :series="series" :key="updateKey">
        </apexchart>
    </v-card>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
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
    plotOptions: {
        bar: {
            horizontal: true
        }
    },
}
const series = ref([{
    name: 'Paid',
    data: []
},
{
    name: 'Received',
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
        series.value[0].data.push(el.expense);
        series.value[1].data.push(el.consumed);
    })
    updateKey.value += 1;
    loading.value = true;
}
onMounted(() => {
    get();
})
watch(() => props.data, get)
</script>