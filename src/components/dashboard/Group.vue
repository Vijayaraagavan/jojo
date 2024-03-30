<template>
    <v-row>
        <v-col xs="12" sm="12" md="6" lg="4">
            <TransactionChart v-if="loading" :data="categoryWise" />
        </v-col>
        <v-col xs="12" sm="12" md="6" lg="4">
            <CategoryChart v-if="loading" :data="reports.categoryWise" />
        </v-col>
        <v-col xs="12" sm="12" md="6" lg="4">
            <SpentChart v-if="loading" :data="reports.spentWise" />
        </v-col>
    </v-row>
</template>

<script setup>
import TransactionChart from './TransactionChart.vue'
import CategoryChart from './CategoryChart.vue'
import SpentChart from './SpentChart.vue'
import { onMounted } from 'vue';
import { ref } from 'vue';
const props = defineProps(['uid']);
import { getGroupTransactions } from '@/modules/database/reports.js'
import { watch } from 'vue';
const categoryWise = ref(null);
const reports = ref({});
const loading = ref(false);
const get = () => {
    const today = new Date()
    const tenDaysBefore = new Date(today);
    tenDaysBefore.setDate(today.getDate() - 7);
    getGroupTransactions(props.uid, { dateFrom: tenDaysBefore.getTime() })
        .then(resp => {
            categoryWise.value = resp.transactionWise;
            reports.value = resp;
            loading.value = true;
        })
}
onMounted(() => {
    get()
})
watch(() => props.uid, get)
</script>