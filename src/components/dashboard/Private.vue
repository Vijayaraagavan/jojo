<template>
    <v-row v-if="result.available">
        <v-col xs="12" sm="6" md="6" lg="5">
            <TransactionChart v-if="loading" :data="categoryWise" />
        </v-col>
        <v-col xs="12" sm="6" md="6" lg="5">
            <CategoryChart v-if="loading" :data="result.categoryWise" />
        </v-col>
    </v-row>
    <div v-if="!result.available" class="d-flex justify-center align-center" style="height: 70%;">
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
import { onMounted } from 'vue';
import { getAllTransaction } from '@/modules/database/reports';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
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
const goTo = () => {
    router.push({ name: 'newTransaction' })
}
onMounted(() => {
    get()
})
</script>