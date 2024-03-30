<template>
    <v-card flat width="300" class="pa-0 mb-2 d-flex justify-end">
        <v-autocomplete :items="selects" item-title="name" item-value="uid" v-model="selectedId"
            prepend-inner-icon="mdi-domain" class="mt-2" @update:model-value="select()" hide-details=""
            density="compact"></v-autocomplete>
    </v-card>
    <Private v-if="selectedId == userId && !loader" :uid="userId" />
    <Group v-if="selectedId != userId && !loader" :uid="selectedId" />
</template>

<script setup>
import { getUser } from '@/modules/database/users';
import { getUserGroups } from '@/modules/database/groups';
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';
import { ref } from 'vue';
import Private from './Private.vue';
import Group from './Group.vue';
const { id: userId } = useUserStore();
const selects = ref([]);
const selectedId = ref(null);
const loader = ref(true);
const get = () => {
    getUser(userId)
        .then(user => {
            selects.value.push({ uid: user.uid, name: 'Private' })
            getUserGroups(user.uid)
                .then(groups => {
                    groups.forEach(g => {
                        selects.value.push({ uid: g.docId, name: g.name })
                    })
                    if (selects.value.length > 1) {
                        selectedId.value = selects.value[1].uid;
                    } else {
                        selectedId.value = selects.value[0].uid;
                    }
                    loader.value = false;
                })
        })
}
const select = () => { }
onMounted(() => {
    get()
})
</script>