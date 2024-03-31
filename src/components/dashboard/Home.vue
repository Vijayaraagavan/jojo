<template>
    <v-card flat :width="$vuetify.display.xs ? 260 : 300" class="pa-0 mb-2 d-flex justify-end">
        <v-autocomplete :items="selects" item-title="name" item-value="uid" v-model="selectedId"
            prepend-inner-icon="mdi-domain" class="mt-2" @update:model-value="select()" hide-details=""
            density="compact"></v-autocomplete>
    </v-card>
    <v-menu offset-y location="start" v-if="selects.length > 1">
        <template v-slot:activator="{ props }">
            <v-btn color="success" v-bind="props" icon
                style="position: absolute; right: 40px; top: 87px;"><v-icon>mdi-plus</v-icon></v-btn>
        </template>

        <v-list>
            <v-list-item v-for="item in selects" :key="item.id" @click="routeTo(item)">
                <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
    <v-btn color="success" v-if="selects.length == 1" icon style="position: absolute; right: 40px; top: 87px;"
        @click="routeTo(selects[0])"><v-icon>mdi-plus</v-icon></v-btn>
    <Private v-if="selectedId == userId && !loader" :uid="userId" />
    <Group v-if="selectedId != userId && !loader" :uid="selectedId" />
</template>

<script setup>
import { getUser } from '@/modules/database/users';
import { getUserGroups } from '@/modules/database/groups';
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Private from './Private.vue';
import Group from './Group.vue';
const { id: userId } = useUserStore();
const selects = ref([]);
const selectedId = ref(null);
const loader = ref(true);
const router = useRouter();
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
const routeTo = (r) => {
    if (r.name.includes('Private')) {
        router.push({ name: 'newTransaction' })
    } else {
        router.push({ name: 'split', params: { groupId: r.uid } })
    }
}
onMounted(() => {
    get()
})
</script>