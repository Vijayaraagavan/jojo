<template>
    <v-card width="500" color="transparent">
        <v-card-text>
            <v-btn color="success" icon large @click="newTransaction()"><v-icon>mdi-plus</v-icon></v-btn>
        </v-card-text>
    </v-card>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const newTransaction = () => {
    router.push({ name: 'newTransaction' });
}
</script>