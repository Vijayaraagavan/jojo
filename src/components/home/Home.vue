<script setup>
// import { analytics } from '@/modules/firebase';
import Login from '@/components/home/Login.vue';
const name = 'Home'
const count = 0;
console.log(import.meta.env.MODE);
// creatUserWithEmail("vijay@ardhika.com", "123456");
// signInWithEmail("vijay@ardhika.com", "123456");
</script>

<template>
    <v-container fluid style="width: 90vw;">
        <v-row class="flex-nowrap">
            <v-col>
                <h1>slide show</h1>
            </v-col>
            <v-col md="4" sm="6" xs="12" lg="4" xl="4" min-width="450px">
                <router-view></router-view>
                <!-- <Login /> -->
            </v-col>
        </v-row>
    </v-container>
</template>