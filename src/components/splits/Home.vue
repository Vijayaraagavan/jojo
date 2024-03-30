<template>
    <v-container fluid class="pa-0" width="90vw">
        <NewGroup :first="!groups.length" />
        <v-card v-if="groups.length">
            <v-tabs v-model="tab" bg-color="primary" @update:modelValue="changeTab()">
                <v-tab :value="t.docId" v-for="t in groups">{{ t.name }}</v-tab>
            </v-tabs>

            <v-card-text>
                <Group v-model:group="currentGroup" />
            </v-card-text>
        </v-card>
    </v-container>
</template>
<script setup>
import { ref } from 'vue';
import NewGroup from './NewGroup.vue';
import { getUserGroups } from '@/modules/database/groups';
// import { onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import Group from './Group.vue';
import { watchEffect } from 'vue';
const tab = ref('');
const groups = ref([]);
const currentGroup = ref(null);
const changeTab = () => {
    currentGroup.value = groups.value.find((g) => g.docId == tab.value);
}
const init = () => {
    const { id } = useUserStore();
    getUserGroups(id)
        .then(groupDocs => {
            groupDocs.forEach(i => groups.value.push(i));
            tab.value = groups.value && groups.value.length > 0 && groups.value[0].docId;
            changeTab();
        })
}
watchEffect(() => {
    init();
})
</script>