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
        title: 'Reports',
        children: [
            {
                id: 'transactions',
                title: 'Transactions',
                routeName: 'transactions',
            },
            {
                id: 'group_transactions',
                title: 'Split Transactions',
                routeName: 'splitTransactions',
            }
        ]
    },
    {
        id: 'teams',
        title: 'Groups',
        routeName: 'teams'
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
        <template v-for="i in index">
            <v-list-item v-if="!i.children" :key="i.id" :title="i.title" color="transparent" class="text-start pl-7"
                @click="routeTo(i)">
            </v-list-item>
            <v-list-group v-if="i.children" :value="i.title" class="text-start px-3">
                <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" :title="i.title"></v-list-item>
                </template>
                <v-list-item v-for="c in i.children" :title="c.title" color="transparent" class="text-start px-3"
                    @click="routeTo(c)">
                </v-list-item>
            </v-list-group>
        </template>
    </v-list>
</template>
