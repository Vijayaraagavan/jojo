<template>
    <v-row>
        <v-col>
            <v-card flat max-width="400" color="transparent">
                <Create reactive="true" @split-input="getSplitInput" :total-amount="totalAmount" />
                <v-btn color="success" block class="mt-2" @click="createSplit()">Add</v-btn>
            </v-card>
        </v-col>
        <v-col>
            <v-card max-width="400" color="transparent">
                <v-toolbar class="px-2">
                    <div class="d-flex align-center" style="width: 80%;">
                        <h3 class="mr-3">Who Paid</h3>
                        <v-autocomplete v-model="payer" class="flex-grow-1" :items="users" item-title="displayName"
                            variant="solo" hide-details item-value="uid" density="compact"
                            auto-select-first></v-autocomplete>
                        <!-- <div class="d-flex flex-column ml-4">
                            <h4>Total</h4>
                            <h3>300</h3>
                        </div> -->
                    </div>
                </v-toolbar>
                <v-divider></v-divider>
                <v-toolbar density="compact">
                    <div class="d-flex align-center justify-space-between ml-4" style="width: 90%;">
                        <h4>Total</h4>
                        <h3 class="font-weight-bold success--text text-success" color="success">{{ totalAmount }}</h3>
                    </div>
                </v-toolbar>
                <v-card-text class="pa-0">
                    <v-expansion-panels color="error">
                        <v-expansion-panel expand focusable bg-color="transparent">
                            <v-expansion-panel-title class="d-block mb-0 pa-0 pt-2">
                                <template v-slot:actions>
                                    <!-- <v-icon>mdi-close</v-icon> -->
                                </template>
                                <template v-slot:default="actionsProps" style="display: block;">
                                    <div class="d-flex justify-space-between">
                                        <v-btn color="success" variant="outlined" @click.stop="openCalc()">Edit</v-btn>
                                        <v-btn icon flat density="compact"><v-icon>mdi-chevron-down</v-icon></v-btn>
                                    </div>
                                    <v-card v-for="u in users.slice(0, 2)" class="my-2 align-center">
                                        <v-card-text>
                                            <v-row align-center class="align-center">
                                                <v-col cols="3">
                                                    <UserIcon :user="u" />
                                                </v-col>
                                                <v-col cols="7">
                                                    <div class="d-flex flex-column align-end ml-4">
                                                        <h3 class="">{{ u.displayName }}</h3>
                                                        <h3 class="font-weight-bold success--text text-success"
                                                            color="success">
                                                            {{
                    u.amount }}</h3>
                                                    </div>
                                                </v-col>
                                                <v-col cols="2">
                                                    <v-checkbox hide-details="" density="compact" @click.stop=""
                                                        color="indigo darken-4" v-model="u.selected"
                                                        @change="calculateBox()"></v-checkbox>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </template>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text style="position: relative; top: -30px;" class="pa-0">
                                <v-card v-for="u in users.slice(2)" class="my-2 align-center">
                                    <v-card-text>
                                        <v-row align-center class="align-center">
                                            <v-col cols="3">
                                                <!-- <div class="d-flex flex-column align-start">
                                                    <h3 class="mb-1">{{ u.displayName }}</h3> -->
                                                <UserIcon :user="u" />
                                                <!-- </div> -->
                                            </v-col>
                                            <v-col cols="7">
                                                <div class="d-flex flex-column align-end ml-4">
                                                    <h3 class="">{{ u.displayName }}</h3>
                                                    <h3 class="font-weight-bold success--text text-success"
                                                        color="success">
                                                        {{
                    u.amount }}</h3>
                                                </div>
                                            </v-col>
                                            <v-col cols="2">
                                                <v-checkbox hide-details="" density="compact" color="indigo darken-4"
                                                    v-model="u.selected" @change="calculateBox()"></v-checkbox>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
    <v-dialog v-model="dialog" scrollable persistent :overlay="false" max-width="400px" transition="dialog-transition">
        <v-card color="black" height="90vh">
            <v-toolbar class="px-2">
                <div class="d-flex align-center" style="width: 100%;">
                    <h3 class="mr-3">Who Paid</h3>
                    <v-autocomplete v-model="payer" class="flex-grow-1" :items="users" item-title="displayName"
                        variant="solo" hide-details item-value="uid" density="compact"
                        auto-select-first></v-autocomplete>
                    <v-spacer></v-spacer>
                    <v-btn color="error" flat icon @click="close()"><v-icon>mdi-close</v-icon></v-btn>
                </div>
            </v-toolbar>
            <v-toolbar density="compact">
                <div class="d-flex align-center justify-space-between ml-4" style="width: 100%;">
                    <h4 style="width: 90%;">Total</h4>
                    <v-spacer></v-spacer>
                    <v-text-field name="name" :id="`id-total`" hide-details="" class="custom-text-field text-success"
                        v-model="totalAmount"></v-text-field>
                </div>
            </v-toolbar>
            <v-card-text>
                <h4 class="text-error" v-if="!valid">!Enter valid amount</h4>
                <v-card v-for="(u, idx) in users" class="my-2 align-center">
                    <v-card-text>
                        <v-row align-center class="align-center">
                            <v-col cols="2">
                                <!-- <div class="d-flex flex-column align-start">
                                        <h3 class="mb-1">{{ u.displayName }}</h3> -->
                                <UserIcon :user="u" />
                                <!-- <div class="d-flex flex-column align-end ml-4"> -->
                                <!-- </div> -->
                                <!-- </div> -->
                            </v-col>
                            <v-col cols="4">
                                <h3 class="">{{ u.displayName }}</h3>

                            </v-col>
                            <v-col cols="4">
                                <v-form v-model="valid">

                                    <!-- <h3 class="font-weight-bold success--text text-success" color="success">100</h3> -->
                                    <v-text-field name="name" :id="`id-${idx}`" v-model="u.amount" hide-details=""
                                        class="custom-text-field text-success" @input="calculateText(u)"
                                        :rules="amountRule"></v-text-field>
                                </v-form>
                            </v-col>
                            <v-col cols="2">
                                <v-checkbox hide-details="" density="compact" color="indigo darken-4"
                                    v-model="u.selected" @change="calculateBox()"></v-checkbox>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script setup>
import Create from '@/components/transaction/Create.vue';
import { getGroupUsers, getGroup, addSplit } from '@/modules/database/groups';
import { useUserStore } from '@/stores/user';
import { onMounted, ref } from 'vue';
import UserIcon from './UserIcon.vue';
import { useRoute } from 'vue-router';
import { showSnack } from '@/composables/snackbar';
const route = useRoute();
const group = ref({});
const users = ref([]);
const payer = ref('');
const { id: currentUser } = useUserStore();
const dialog = ref(false);
const totalAmount = ref(45);
const valid = ref(false);
const childData = {
    title: '',
    date: null
}
const getSplitInput = (v) => {
    totalAmount.value = v.amount;
    childData.title = v.title;
    childData.date = v.date;
    calculateBox();
}
const close = () => {
    dialog.value = false;
}
const openCalc = () => {
    dialog.value = true;
}
const amountRule = [
    (v) => {
        if (!(/^[\d\.]+$/.test(v))) {
            return false;
        }
        if (Number(v) < 0) {
            return false;
        }
        return true;
    }
]
const getUsers = (members) => {
    getGroupUsers(members)
        .then(u => {
            const share = Number((totalAmount.value / u.length).toFixed(2));
            u.forEach(e => {
                e.color = getColor();
                e.selected = true;
                e.alr = false;
                e.amount = share;
                users.value.push(e);
            });
            payer.value = users.value[0].uid;
            if (currentUser) {
                payer.value = currentUser;
            }
        })
}
const getColor = () => {
    const c = Math.floor(Math.random() * 16777215).toString(16);
    if (c == '000000' || c == 'ffffff') {
        getColor();
    }
    return c;
}
onMounted(() => {
    getGroup(route.params.groupId)
        .then(g => {
            group.value = g;
            getUsers(g.members);
        })
})

const calculateText = (user) => {
    user.alr = true;
    calculateBox();
}
const calculateBox = () => {
    users.value.forEach(u => {
        if (!u.selected) {
            u.amount = 0;
        }
    })
    const filtered = users.value.filter(u => u.alr == false && u.selected);
    const unalter = users.value.filter(u => u.alr == true && u.selected);
    const unalterTotal = unalter.reduce((c, i) => c + Number(i.amount), 0);
    // const select = users.value.filter(u => u.selected);
    // const selectTotal = select.reduce((c, i) => c + Number(i.amount), 0);
    const diff = totalAmount.value - unalterTotal;
    if (filtered.length == 0 || unalterTotal > totalAmount.value) {
        // alter total value;
        totalAmount.value -= diff;
        return;
    }
    const share = Number((diff / filtered.length).toFixed(2));
    filtered.forEach(item => {
        item.amount = share;
    })
}
const createSplit = () => {
    let numStr = totalAmount.value.toFixed(2);
    const groups = [];
    users.value.forEach(u => {
        groups.push({
            uid: u.uid,
            amount: u.amount
        })
    })
    let payload = {
        userId: payer.value,
        title: childData.title == '' ? 'expense' : childData.title,
        amount: totalAmount.value,
        amountStr: numStr,
        dateTime: childData.date,
        createdAt: Date.now(),
        group: groups,
        groupId: group.value.id
    }
    addSplit(payload)
        .then(() => showSnack("split check created"))
}
</script>
<style scoped>
.custom-text-field :deep(.v-input__control input) {
    color: var(--v-theme-success);
    font-size: 20px;
    font-weight: 500;
}

.v-expansion-panel-text :deep(.v-expansion-panel-text__wrapper) {
    padding: 8px 0 0;
}
</style>