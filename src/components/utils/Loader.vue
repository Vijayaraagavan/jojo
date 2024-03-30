<template>
    <v-dialog v-model="dialog" persistent :overlay="true" max-width="370px" transition="dialog-transition">
        <v-card color="teal">
            <v-card-text class="pa-0">
                <h4 class="mb-2 pa-2 px-4 pt-4">{{ msg }}</h4>
                <v-progress-linear :indeterminate="true"></v-progress-linear>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { useLoader } from '@/composables/loader.js';
const { dialog, msg } = useLoader();
</script>