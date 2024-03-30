<template>
    <v-row>
        <v-col xs="12" sm="6" md="6" lg="5">
            <TransactionChart v-if="loading" :data="categoryWise" />
        </v-col>
        <v-col xs="12" sm="6" md="6" lg="5">
            <CategoryChart v-if="loading" :data="result.categoryWise" />
        </v-col>
    </v-row>
</template>

<script setup>
import TransactionChart from './TransactionChart.vue'
import CategoryChart from './CategoryChart.vue'
import { onMounted } from 'vue';
import { getAllTransaction } from '@/modules/database/reports';
import { ref } from 'vue';
const props = defineProps(['uid']);
const loading = ref(false);
const categoryWise = ref(null);
const result = ref({})
const get = () => {
    const today = new Date()
    const tenDaysBefore = new Date(today);
    tenDaysBefore.setDate(today.getDate() - 7);
    getAllTransaction([props.uid], { dateFrom: tenDaysBefore.getTime() })
        .then(resp => {
            categoryWise.value = resp.transactionWise;
            result.value = resp;
            loading.value = true;
            console.log(resp)
        })
}
onMounted(() => {
    get()
})
</script>