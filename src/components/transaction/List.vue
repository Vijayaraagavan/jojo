<template>
    <v-data-table :headers="headers" :items="transactions" :loading="loading">
        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
                <template v-for="column in columns" :key="column.key">
                    <td>
                        <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{ column.title }}</span>
                        <template v-if="isSorted(column)">
                            <v-icon :icon="getSortIcon(column)"></v-icon>
                        </template>
                        <v-icon v-if="column.removable" icon="$close" @click="() => remove(column.key)"></v-icon>
                    </td>
                </template>
            </tr>
        </template>
    </v-data-table>
</template>

<script setup>
import { getExpenses } from '@/modules/database/main';
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';
const user = useUserStore();
const transactions = ref([]);
const loading = ref(true);
const headers = ref([
    { title: 'Id', key: 'id', removable: false, align: 'start' },
    { title: 'Comment', key: 'title', removable: true, align: 'start' },
    { title: 'Amount', key: 'amountStr', removable: false, align: 'end' },
    { title: 'DateTime', key: 'dateTime', removable: false, align: 'start' }
])
const remove = (key) => {
    headers.value = headers.value.filter(header => header.key !== key)
}
onMounted(() => {
    getExpenses(user.id)
        .then(v => {
            transactions.value = v;
            loading.value = false;
        })
})
</script>