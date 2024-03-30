<template>
    <div class="d-flex justify-end mb-2">
        <v-btn v-if="!props.first" color="success" @click="openJoin()"
            class="mr-2"><v-icon>mdi-plus</v-icon>join</v-btn>
        <v-btn v-if="!props.first" color="success" @click="open()"><v-icon>mdi-plus</v-icon>group</v-btn>
        <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="500px"
            transition="dialog-transition">
            <v-card>
                <v-toolbar class="pr-0" density="compact" elevation-10>
                    <v-toolbar-title>
                        New Group
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialog = false"><v-icon color="error">mdi-close</v-icon></v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-form v-model="valid">
                        <v-text-field v-model="groupName" :rules="nameRules" name="groupName" label="Group name"
                            id="group-name" variant="outlined"></v-text-field>
                    </v-form>
                    <div class="d-flex justify-end">
                        <v-spacer></v-spacer>
                        <v-btn color="success" :disabled="!valid" @click="create()">create</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="joinDialog" scrollable persistent :overlay="false" max-width="500px"
            transition="dialog-transition">
            <v-card>
                <v-toolbar class="pr-0" density="compact" elevation-10>
                    <v-toolbar-title>
                        Join Group
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="joinDialog = false"><v-icon color="error">mdi-close</v-icon></v-btn>
                </v-toolbar>
                <v-card-text>
                    <v-form v-model="valid">
                        <v-text-field v-model="groupName" :rules="nameRules" name="groupName" label="Group name"
                            id="group-name" variant="outlined"></v-text-field>
                        <v-text-field v-model="joinRefId" :rules="joinRules" name="refId" label="Reference ID"
                            id="refId" variant="outlined"></v-text-field>
                    </v-form>
                    <div class="d-flex justify-end">
                        <v-spacer></v-spacer>
                        <v-btn color="success" :disabled="!valid" @click="joinGroup()">join</v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
    <div class="d-flex justify-center align-center">
        <v-card v-if="props.first" width="350" class="elevation-10">
            <v-card-text class="py-6">
                <v-row class=" text-center justify-center">
                    <v-col cols="12">
                        <h3>You are not in any group!</h3>
                    </v-col>
                    <v-col cols="6" class="d-flex justify-center">
                        <v-btn color="success" variant="text" class="elevation-3 d-flex flex-column"
                            style="border: 1px solid; flex-direction: column; display: flex;" height="55"
                            @click="open()">
                            <span>new</span>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col cols="6" class="d-flex justify-center">
                        <v-btn color="success" variant="text" class="elevation-3 d-flex flex-column"
                            style="border: 1px solid; flex-direction: column; display: flex;" height="55"
                            @click="openJoin()">
                            <span>Join</span>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { newGroup, joinGroupByRef } from '@/modules/database/groups';
import { showSnack } from '@/composables/snackbar';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const dialog = ref(false);
const joinDialog = ref(false);
const groupName = ref('');
const joinRefId = ref('')
const valid = ref(false);
const props = defineProps(['first']);
const nameRules = [
    (v) => v && !!v || 'Group name should not be empty',
    (v) => v && v.length >= 3 || 'Name must be atleast 3 letters'
]
const joinRules = [
    (v) => v && !!v || 'ref should not be empty',
    (v) => v && v.length >= 3 || 'code must be atleast 6 letters'
]
const open = () => {
    dialog.value = true;
}
const openJoin = () => {
    joinDialog.value = true;
}
const create = () => {
    const data = {
        name: groupName.value,
        joinId: getRandomNumber(6),
        createdBy: userStore.id,
        createdAt: Date.now(),
        members: [userStore.id]
    }
    newGroup(data)
        .then((msg) => {
            showSnack(msg)
            location.reload();
        })
        .catch((msg) => showSnack(msg, 'error'));
    dialog.value = false;
}
const getRandomNumber = (digit) => {
    return Math.random().toFixed(digit).split('.')[1];
}
const joinGroup = () => {
    joinGroupByRef(userStore.id, joinRefId.value, groupName.value)
        .then(() => {
            showSnack('Joined new group')
            joinDialog.value = false;
            location.reload();
        })
        .catch((msg) => showSnack(msg, 'error'));

}
</script>