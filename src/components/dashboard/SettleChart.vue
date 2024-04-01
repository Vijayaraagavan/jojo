<template>
    <v-card>
        <v-card-title primary-title class="text-orange">
            Setttlement
        </v-card-title>
        <v-card-text class="pa-0">
            <v-card v-for="(i, idx) in data" :key="idx" class="elevation-3">
                <v-card-text class="d-flex">
                    <v-row class="align-center justify-center">
                        <div class="mr-2 d-inline-block">
                            <UserIcon :user="i.give" size="18" />
                        </div>
                        <v-col class="d-flex align-center pa-1" cols="3">
                            <div class="d-flex flex-column" style="overflow-x: hidden;">
                                <h4 class="d-inline-block text-truncate">{{ i.give.displayName }}</h4>
                                <h3 class="font-weight-bold success--text text-success" color="success">{{
                Number(i.net).toFixed(2) }}</h3>
                            </div>
                        </v-col>
                        <v-col cols="2" class="pa-0">
                            <v-icon large size="40" color="teal">mdi-arrow-right-thin</v-icon>
                        </v-col>
                        <v-col class="d-flex justify-space-between align-center pa-0" style="overflow-x: hidden;"
                            cols="3">
                            <h4 class="d-inline-block text-truncate">vijayaraagavan sadayappan</h4>
                        </v-col>
                        <div class="ml-2 d-inline-block">
                            <UserIcon :user="i.take" size="18" />
                        </div>
                    </v-row>
                </v-card-text>
                <v-divider></v-divider>
            </v-card>
        </v-card-text>
    </v-card>

</template>

<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import { watch } from 'vue';
import UserIcon from '../splits/UserIcon.vue';
const props = defineProps(['data'])
const data = ref([]);
const get = () => {
    data.value = props.data;
}

onMounted(() => {
    get();
})
watch(() => props.data, get)
</script>