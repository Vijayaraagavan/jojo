<template>
    <div>
        <div class="d-flex my-2 ">
            <v-spacer></v-spacer>
            <v-btn color="success mr-3" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
            <!-- <v-btn color="success" @click="newSale()"><v-icon>mdi-plus</v-icon></v-btn> -->
        </div>
        <!-- <v-card width="288" height="40" class="ml-2 mb-2">
            <v-text-field v-model="searchText" name="name" placeholder="search" clearable="" id="id" density="compact"
                prepend-inner-icon="mdi-magnify" solo @click:clear="getAll">
                <template v-slot:append-inner>
                    <v-menu offset-y>
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" icon flat x-small>
                                <v-icon small>mdi-filter</v-icon>
                            </v-btn>
                        </template>
<v-list>
    <v-list-item v-for="item in filterOptions" :key="item.id" @click="setFilter(item)">
        <v-list-item-title>{{ item.name }}</v-list-item-title>
    </v-list-item>
</v-list>
</v-menu>

</template>
</v-text-field>
</v-card> -->
        <Info v-model:dialog="infoDialog" :split="selectedSplit" />
        <v-data-table :headers="headers" :items="transactions" :loading="loading" v-if="$vuetify.display.smAndUp">
            <!-- <template #item.splits="splitItem">
            </template> -->
            <template #item="{ item }">
                <tr @click="showInfo(item)" style="cursor: pointer;">
                    <td>{{ item.id }}</td>
                    <td>{{ item.title }}</td>
                    <td>
                        <SplitIcons :members="item.group" class="" />
                    </td>
                    <td>{{ item.category }}</td>
                    <td>{{ item.amount }}</td>
                    <td>{{ item.dateTime }}</td>
                </tr>
            </template>
            <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
                <tr style="background-color: gray; font-weight: bold; color: white;">
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
                <SplitCardList v-for="t in transactions" :transaction="t" />
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { groupTransactions, getGroups, getGroupUsers } from '@/modules/database/groups';
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';
import SplitIcons from './SplitIcons.vue'
import Info from '@/components/splits/Info.vue';
import SplitCardList from './SplitCardList.vue';
import { useSettingsStore } from '@/stores/settings';

import { watch } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const user = useUserStore();
const settingsStore = useSettingsStore();
const transactions = ref([]);
const loading = ref(true);
const infoDialog = ref(false);
const selectedSplit = ref(null);
const headers = ref([
    { title: 'Id', key: 'id', removable: false, align: 'start' },
    { title: 'Comment', key: 'title', removable: false, align: 'start' },
    { title: 'Splits', key: 'splits', removable: false, align: 'start' },
    { title: 'Category', key: 'category', removable: false, align: 'start' },
    { title: 'Amount', key: 'amountStr', removable: false, align: 'start' },
    { title: 'DateTime', key: 'dateTime', removable: false, align: 'start' }
]);
const filterOptions = [
    { name: 'Comment', id: 'title' },
    { name: 'Amount', id: 'amount' },
    { name: 'date', id: 'dateTime' },
]
const selectedFilter = ref(filterOptions[0]);
const setFilter = (f) => {
    selectedFilter.value = f;
}
const searchText = ref('');
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
    groupTransactions(user.id, {
        search: searchText.value,
        filter: selectedFilter.value
    }).then((v) => {
        // console.log(v)
        transactions.value = v.resp;
        if (v.groups.length) {
            getReportUsers(v.groups)
        } else {
            loading.value = false;
        }
        // loading.value = false;
    })
        .catch(msg => {
            if (msg.includes('no group')) {
                loading.value = false;
                router.push({ name: 'teams' })
            }
        })
}
const getReportUsers = (groupIds) => {
    getGroups(groupIds)
        .then(groups => {
            const userIds = new Set();
            groups.forEach(g => {
                g.members.forEach(i => userIds.add(i))

            })
            getGroupUsers([...userIds])
                .then(u => saveUsers(u))
        })
}
const saveUsers = (users) => {
    const g = [];
    transactions.value.forEach(t => {
        const group = [];
        t.group.forEach(m => {
            const user = users.find(i => i.uid == m.uid);
            m.displayName = user.displayName
            m.color = user.color;
            group.push(m);
        });
        t.group = group;
        const c = settingsStore.categories.find(i => i.uid == t.categoryId);
        t.category = 'General'
        if (c) {
            t.category = c.name;
        }
        g.push(t)
    })
    transactions.value = g;
    loading.value = false;

}
watch(searchText, (v, o) => {
    if (v && v.length > 2) {
        getAll();
    }
    // refresh if user clears input to 0
    if ((v && v.length == 0 && o.length > 0) || (o && o.length > 0 && !v)) {
        getAll();
    }
})
onMounted(() => {
    getAll();
})
const showInfo = (split) => {
    selectedSplit.value = split;
    infoDialog.value = true
}
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