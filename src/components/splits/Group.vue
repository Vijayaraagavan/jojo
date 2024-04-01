<template>
    <v-card v-if="group && group.name">
        <v-card-text>
            <v-row>
                <v-col class="d-flex justify-start align-center" cols="12">
                    <h4 class="pt-1">Ref ID</h4>
                    <h3 class="font-weight-medium ml-1">{{ group.joinId }}</h3>
                    <v-btn icon flat v-if="!copied" @click="copy()">
                        <v-icon size="small" class="pt-1 ml-1">mdi-note-outline</v-icon>
                        <v-tooltip activator="parent" location="end">Copy</v-tooltip>
                    </v-btn>
                    <v-icon color="success" class="ml-4" v-if="copied">mdi-check</v-icon>
                    <v-spacer></v-spacer>
                    <v-btn color="success" icon @click="newSplit()"><v-icon>mdi-plus</v-icon></v-btn>
                </v-col>
                <v-col xs="12" sm="12" md="6" lg="4" v-if="loading && reports.available && reports.settlement.length">
                    <SettleChart :data="reports.settlement" />
                </v-col>
                <v-col xs="12" sm="12" md="6" lg="4">
                    <Categories :uid="group.docId" v-if="group.docId" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Categories from '../settings/Categories.vue';
import { getGroupTransactions } from '@/modules/database/reports.js'
import SettleChart from '@/components/dashboard/SettleChart.vue'
import { ref } from 'vue';
import { onMounted } from 'vue';
import { watch } from 'vue';
const router = useRouter();
const group = defineModel('group');
const copied = ref(false);
const loading = ref(false);
const reports = ref({});
const copy = () => {
    copied.value = true;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(group.value.joinId);
    }
    setTimeout(() => copied.value = false, 2000)
}
const newSplit = () => {
    router.push({ name: 'split', params: { groupId: group.value.docId } });
}
const get = () => {
    const today = new Date()
    const tenDaysBefore = new Date(today);
    tenDaysBefore.setDate(today.getDate() - 7);
    getGroupTransactions(group.value.docId, { dateFrom: tenDaysBefore.getTime() })
        .then(resp => {
            console.log(resp)
            reports.value = resp;
            loading.value = true;
        })
}
onMounted(() => {
    get();
})
watch(group, get);
</script>