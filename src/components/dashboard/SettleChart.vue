<template>
    <v-card>
        <v-card-text class="pa-0">
            <v-card v-for="(i, idx) in data" :key="idx" class="elevation-10">
                <v-card-text class="d-flex justify-space-between align-center">
                    <v-row>
                        <v-col class="d-flex" cols="5">
                            <UserIcon :user="i.give" class="mr-4" size="18" />
                            <div class="d-flex flex-column">
                                <h4>{{ i.give.displayName }}</h4>
                                <h3 class="font-weight-bold success--text text-success" color="success">{{
                Number(i.net).toFixed(2) }}</h3>
                            </div>
                        </v-col>
                        <v-col cols="2">
                            <v-icon large size="40" color="teal">mdi-arrow-right-thin</v-icon>
                        </v-col>
                        <v-col class="d-flex justify-space-between align-center" cols="5">
                            <h4>{{ i.take.displayName }}</h4>
                            <UserIcon :user="i.take" class="mr-2" size="18" />
                        </v-col>
                    </v-row>
                </v-card-text>
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