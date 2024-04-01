<script setup>
import { signOut } from '@/modules/auth/auth.js';
import { useRouter } from 'vue-router';
import { all } from '@/modules/database/main';
import SideNav from './SideNav.vue';
// import Info from './Info.vue';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { clearAll } from '@/composables/index';
import { vuetify } from '@/modules/vuetify';
import { useUserStore } from '@/stores/user';
import UserIcon from '../splits/UserIcon.vue';
const { user, displayName } = useUserStore()
const router = useRouter();
const logout = () => {
    clearAll();
    signOut(() => {
        router.push({ name: 'login' });
    });
}
const fetchDocs = () => {
    all();
}
const showNav = ref(false);
const mobileWid = {
    width: vuetify.display.xs ? 100 + 'vw' : 100 + 'vw',
    padding: '0px'
}
const showMenu = ref(false);
onMounted(fetchDocs)
</script>

<template>
    <v-container fluid :style="mobileWid">
        <v-app-bar color="indigo lighten-3" class="align-center" density="compact">
            <v-app-bar-nav-icon @click="showNav = !showNav"></v-app-bar-nav-icon>
            <v-row class="align-center justify-center">
                <v-spacer></v-spacer>
                <v-col xs="8" sm="6" cols="9" md="4" lg="3">
                    <v-text-field dark density="compact" name="search" id="search" outlined hide-details=""
                        placeholder="Search" clearable=""></v-text-field>
                </v-col>
                <v-spacer></v-spacer>
                <!-- <v-col xs="3" sm="3">
                    <div class="d-flex justify-end align-center" style="width: 100%;">
                        <h3 style="" class="text-nowrap">{{ displayName }}</h3>
                        <v-btn icon @click="logout"><v-icon>mdi-logout</v-icon></v-btn>
                    </div>
                </v-col> -->
                <v-col xs="2" sm="3" md="4" class="d-flex justify-end align-center mr-4">
                    <h3 class="text-nowrap mr-2" v-if="!$vuetify.display.xs">{{ displayName }}</h3>
                    <v-menu offset-y v-model="showMenu">
                        <template v-slot:activator="{ props }">
                            <UserIcon :user="user" @click="showMenu = !showMenu" style="cursor: pointer;"
                                v-bind="props" />
                        </template>
                        <v-list class="pa-0">
                            <v-list-item @click="logout">
                                <v-list-item-title>Logout <v-icon class="ml-3">mdi-logout</v-icon></v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
        </v-app-bar>
        <SideNav v-model:nav="showNav" @logout="logout" />

        <!-- v-layout doesn't occupy full-height unlike v-app. so use 100dvh in v-main -->
        <v-main class="mt-2" :style="{ width: $vuetify.display.mdAndUp ? '85%' : '100%' }" style="height: 100dvh;">
            <router-view></router-view>
        </v-main>
    </v-container>
</template>