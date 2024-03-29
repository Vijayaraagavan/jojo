<template>
    <v-card color="">
        <v-card-text>
            <div class="d-flex">
                <v-text-field name="search" label="search" id="search" clearable
                    prepend-inner-icon="mdi-magnify"></v-text-field>
                <v-btn icon flat @click="dialog = true"><v-icon color="success">mdi-plus</v-icon></v-btn>
            </div>
            <v-data-table :headers="headers" :items="setting.categories" hide-actions class="elevation-1"
                :loading="loading" items-per-page="5" :page="page">
                <template #item.active="{ item }">
                    <v-btn icon flat @click="toggleActive(item)">
                        <v-icon color="error" v-if="item.active">mdi-close</v-icon>
                        <v-icon color="success" v-else>mdi-check</v-icon>
                    </v-btn>
                </template>
                <template #bottom="{ pageCount }">
                    <v-pagination color="indigo darken-4" v-model="page" :length="pageCount" class="my-4"
                        @click=""></v-pagination>
                </template>
            </v-data-table>
        </v-card-text>
    </v-card>
    <v-dialog v-model="dialog" :overlay="false" max-width="400px" transition="dialog-transition">
        <v-card>
            <v-card-text>
                <v-text-field name="category_new" label="Category name" id="category_new" clearable
                    prepend-inner-icon="mdi-magnify" v-model="newCategory" :rules="rules"></v-text-field>
                <div class="d-flex justify-end">
                    <v-btn color="success" @click="addCategory()">Add</v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { getSettings, saveSettings } from '@/modules/database/settings'
import { onMounted } from 'vue';
import { showSnack } from '@/composables/snackbar';
import { useUserStore } from '@/stores/user';
import { useSettingsStore } from '@/stores/settings';
const store = useUserStore();
const { setCategories } = useSettingsStore();
const dialog = ref(false);
const headers = [
    { title: 'Category', key: 'name', align: 'start' },
    { title: 'Active', key: 'active', align: 'end' },
]
const loading = ref(true);
const setting = ref({
    categories: []
});
const page = ref(1);
const newCategory = ref('');
const rules = [
    (v) => !!v || 'category name cannot be empty'
]
const get = () => {
    getSettings(store.id)
        .then((s) => {
            loading.value = false;
            if (!setting.value.categories) {
                setting.value.categories = [];
            }
            setting.value = s;
        })
}
const update = () => {
    saveSettings(setting.value.id, setting.value)
        .then(msg => {
            showSnack(msg)
            dialog.value = false;
            setCategories(setting.value.categories);
        });
}
const addCategory = () => {
    setting.value.categories.push({ name: newCategory.value, active: true, uid: setting.value.pkey });
    setting.value.pkey += 1;
    update();
}
const toggleActive = (i) => {
    i.active = !i.active;
    update();
}
onMounted(() => {
    get();
})
</script>