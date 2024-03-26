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
    width: vuetify.display.xs ? 100 + 'vw' : 90 + 'vw',
    padding: '0px'
}
onMounted(fetchDocs)
</script>

<template>
    <v-container fluid :style="mobileWid">
        <v-app-bar color="indigo lighten-3" class="align-center" density="compact">
            <v-app-bar-nav-icon @click="showNav = !showNav"></v-app-bar-nav-icon>
            <v-row class="align-center justify-center">
                <v-spacer></v-spacer>
                <v-col xs="8" cols="8" md="4" lg="3">
                    <v-text-field dark density="compact" name="search" id="search" outlined hide-details=""
                        placeholder="Search" clearable=""></v-text-field>
                </v-col>
                <v-spacer></v-spacer>
                <v-col xs="1" sm="1">
                    <div class="d-flex justify-end">

                        <v-btn icon color="grey lighten-5" @click="logout"><v-icon>mdi-logout</v-icon></v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-app-bar>
        <v-navigation-drawer v-model="showNav" absolute temporary class="bg-indigo bg-lighten-3" theme="dark"
            style="top: 15px;">
            <SideNav class="mt-4" v-model:nav="showNav" />
            <template v-slot:append>
                <div class="pa-2 d-flex justify-center ml-4">
                    <v-btn block>
                        Logout
                    </v-btn>
                </div>
            </template>
        </v-navigation-drawer>
        <v-main class="ma-2 mr-6" style="width: 85%;">
            <router-view></router-view>
        </v-main>
    </v-container>
</template>