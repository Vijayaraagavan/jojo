<template>
    <v-card v-if="group && group.name">
        <v-card-text>
            <v-row>
                <v-col class="d-flex justify-start align-center" cols="12">
                    <h4 class="pt-1">Ref ID</h4>
                    <h3 class="font-weight-medium ml-1">{{ group.joinId }}</h3>
                    <v-icon size="small" class="pt-1 ml-1" @click="copy()">mdi-note-outline</v-icon>
                    <v-spacer></v-spacer>
                    <v-btn color="success" icon @click="newSplit()"><v-icon>mdi-plus</v-icon></v-btn>
                </v-col>
                <v-col xs="12" sm="12" md="6" lg="4">
                    <Categories :uid="group.docId" v-if="group.docId" />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Categories from '../settings/Categories.vue';
const router = useRouter();
const group = defineModel('group');
const copy = () => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(group.value.joinId);
    }
}
const newSplit = () => {
    router.push({ name: 'split', params: { groupId: group.value.docId } });
}
</script>