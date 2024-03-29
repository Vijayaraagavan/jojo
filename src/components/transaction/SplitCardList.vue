<template>
    <v-card class="ma-2">
        <Info v-model:dialog="infoDialog" :split="transaction" />
        <v-card-text>
            <v-row @click="showInfo()">
                <v-toolbar density="compact">
                    <v-col cols="7" class="font-weight-medium">
                        {{ transaction.title }}
                    </v-col>
                    <v-col class="d-flex justify-end">
                        <SplitIcons :members="transaction.group" />
                    </v-col>

                </v-toolbar>
                <v-col cols="5" class="text-success font-weight-medium">
                    {{ transaction.amountStr }}
                </v-col>
                <v-col cols="7">
                    {{ transaction.dateTime }}
                </v-col>

            </v-row>
        </v-card-text>
    </v-card>
</template>
<script setup>
import { ref } from 'vue';
import SplitIcons from './SplitIcons.vue'
import Info from '@/components/splits/Info.vue';
const { transaction } = defineProps(['transaction'])
const infoDialog = ref(false);
const showInfo = () => {
    infoDialog.value = true;
} 
</script>