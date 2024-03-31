<template>
    <v-row v-if="reports.available">
        <v-col xs="12" sm="12" md="6" lg="4">
            <TransactionChart v-if="loading" :data="categoryWise" />
        </v-col>
        <v-col xs="12" sm="12" md="6" lg="4">
            <CategoryChart v-if="loading" :data="reports.categoryWise" />
        </v-col>
        <v-col xs="12" sm="12" md="6" lg="4">
            <SpentChart v-if="loading" :data="reports.spentWise" />
        </v-col>
        <v-col xs="12" sm="12" md="6" lg="4">
            <SettleChart v-if="loading" :data="reports.settlement" />
        </v-col>
    </v-row>
    <div v-if="!reports.available" class="d-flex justify-center align-center" style="height: 70%;">
        <v-card width="350" class="elevation-10">
            <v-card-text class="py-6">
                <v-row class=" text-center justify-center">
                    <v-col cols="12">
                        <h3 class="text-purple">Welcome. Make your first transaction!</h3>
                    </v-col>
                    <v-col cols="12" class="d-flex justify-center">
                        <v-btn color="success" variant="text" class="elevation-3 d-flex flex-column"
                            style="border: 1px solid; flex-direction: column; display: flex;" height="55"
                            @click="goTo()">
                            <span>New</span>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import TransactionChart from './TransactionChart.vue'
import CategoryChart from './CategoryChart.vue'
import SpentChart from './SpentChart.vue'
import SettleChart from './SettleChart.vue'
import { onMounted } from 'vue';
import { ref } from 'vue';
const props = defineProps(['uid']);
import { getGroupTransactions } from '@/modules/database/reports.js'
import { watch } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

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
const goTo = () => {
    router.push({ name: 'split', params: { groupId: props.uid } })
}
onMounted(() => {
    get()
})
watch(() => props.uid, get)
</script>