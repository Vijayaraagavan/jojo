<template>
    <div>
        <div class="d-flex justify-end my-2">
            <v-btn color="success mr-3" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
            <v-btn color="success" @click="newSale()"><v-icon>mdi-plus</v-icon></v-btn>
        </div>
        <v-data-table :headers="headers" :items="transactions" :loading="loading" v-if="$vuetify.display.smAndUp">
            <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                <tr>
                    <template v-for="column in columns" :key="column.key">
                        <td>
                            <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.title
                                }}</span>
                            <template v-if="isSorted(column)">
                                <v-icon :icon="getSortIcon(column)"></v-icon>
                            </template>
                            <v-icon v-if="column.removable" icon="$close" @click="() => remove(column.key)"></v-icon>
                        </td>
                    </template>
                </tr>
            </template>
        </v-data-table>
        <v-card color="transparent" v-if="$vuetify.display.xs">
            <v-card-text class="scroll-it pa-0">
                <CardList v-for="t in transactions" :transaction="t" />
            </v-card-text>
        </v-card>
        <!-- <v-list class="scroll-it" color="orange">
            <v-list-item-group color="transparent">
                <v-list-item v-for="(t) in transactions" :key="n" color="transparent">
                    <v-list-item-content color="transparent">
                        <v-list-item-title>
                            <CardList :transaction="t" />
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list> -->
    </div>
</template>

<script setup>
import { getExpenses } from '@/modules/database/main';
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import CardList from './CardList.vue';
const user = useUserStore();
const router = useRouter();
const transactions = ref([]);
const loading = ref(true);
const headers = ref([
    { title: 'Id', key: 'id', removable: false, align: 'start' },
    { title: 'Comment', key: 'title', removable: false, align: 'start' },
    { title: 'Amount', key: 'amountStr', removable: false, align: 'start' },
    { title: 'DateTime', key: 'dateTime', removable: false, align: 'start' }
])
const remove = (key) => {
    headers.value = headers.value.filter(header => header.key !== key)
}
const refresh = () => {
    getAll();
}
const newSale = () => {
    router.push({ name: 'newTransaction' })
}
const getAll = () => {
    getExpenses(user.id)
        .then(v => {
            transactions.value = v;
            console.log(v);
            loading.value = false;
        })
}
onMounted(() => {
    getAll();
})
</script>

<style scoped>
.scroll-it {
    height: calc(100vh - 200px);
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
    overflow-y: auto;
}

.scroll-it::-webkit-scrollbar {
    display: none;
}
</style>