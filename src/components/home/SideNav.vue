<script setup>
import { signOut } from '@/modules/auth/auth.js';
import { useRouter } from 'vue-router';
import { all } from '@/modules/database/main';
import { onMounted } from 'vue';
const router = useRouter();

import { ref } from 'vue';
const nav = defineModel('nav');
const index = [
    {
        id: 'transactions',
        title: 'Transactions',
        routeName: 'transactions'
    },
    {
        id: 'settings',
        title: 'Settings',
        routeName: 'settings'
    }
]
const routeTo = (i) => {
    nav.value = false;
    router.push({ name: i.routeName })
}
</script>

<template>
    <v-list>
        <v-list-item v-for="i in index" :key="i.id" :title="i.title" color="transparent" class="text-center"
            @click="routeTo(i)">

        </v-list-item>
    </v-list>
</template>
