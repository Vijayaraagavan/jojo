<template>
    <v-row>
        <v-col cols="12" class="d-flex justify-end">
            <v-btn color="success">save</v-btn>
        </v-col>
        <v-col xs="12" sm="12" md="6" lg="4">
            <h3 class="text-white mb-2">Category Settings</h3>
            <Categories v-if="store.id" :uid="store.id" />
        </v-col>
    </v-row>
</template>

<script setup>
import { ref } from 'vue';
import Categories from './Categories.vue';
import { useUserStore } from '@/stores/user';
const store = useUserStore();
const setting = ref(null);
</script>