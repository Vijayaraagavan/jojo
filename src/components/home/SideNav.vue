<script setup>
import { signOut } from '@/modules/auth/auth.js';
import { useRouter } from 'vue-router';
import { all } from '@/modules/database/main';
import { onMounted } from 'vue';
const router = useRouter();

import { ref, defineProps } from 'vue';
const props = defineProps(['showNav']);
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
const nav = ref(props.showNav);
const routeTo = (i) => {
    router.push({ name: i.routeName })
}
console.log(nav.value)
</script>

<template>
    <v-list>
        <v-list-item v-for="i in index" :key="i.id" :title="i.title" color="transparent" class="text-center"
            @click="routeTo(i)">

        </v-list-item>
    </v-list>
</template>
