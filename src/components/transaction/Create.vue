<template>
    <v-card max-width="400">
        <v-card-text>
            <v-form>
                <v-row>
                    <v-col cols="12">
                        <label for="expense_name">Expense Type</label>
                        <v-text-field name="expense_name" id="expense_name" class="mt-2" v-model="expenseTitle"
                            @change="emitter()" placeholder="purpose of expense">
                        </v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <label for="expense_name">Category</label>
                        <v-autocomplete :items="categories" item-title="name" item-value="uid" v-model="categoryId"
                            prepend-inner-icon="mdi-domain" class="mt-2"
                            @update:model-value="emitter()"></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <label for="numpad">Amount</label>
                        <div class="d-flex justify-end align-center">
                            <v-dialog v-model="numpad" persistent :overlay="false" max-width="250px"
                                transition="dialog-transition">
                                <Numpad @numvalue="getNumValue" />
                            </v-dialog>
                            <v-btn @click="numpad = true" icon flat>
                                <v-icon color="success" id="numpad">mdi-dialpad</v-icon>
                            </v-btn>
                            <h2 class="font-weight-bold success--text text-success" color="success">{{ numStr }}</h2>
                        </div>
                    </v-col>
                    <v-col cols="12">
                        <label for="numpad">Date and Time</label>
                        <div class="d-flex justify-end align-center">
                            <v-dialog v-model="datePicker" persistent :overlay="false" max-width="500px"
                                transition="dialog-transition">
                                <v-date-picker :landscape="true" :reactive="true" v-model="date">
                                    <template v-slot:actions>
                                        <v-btn color="success" variant="tonal" @click="showTimer()">ok</v-btn>
                                    </template>
                                </v-date-picker>
                            </v-dialog>
                            <v-dialog v-model="timePicker" persistent :overlay="false" max-width="300px"
                                transition="dialog-transition">
                                <v-card height="300px">
                                    <v-toolbar class="pr-0">
                                        <v-toolbar-title>
                                            Pick a time
                                        </v-toolbar-title>
                                        <v-spacer></v-spacer>
                                        <v-btn icon @click="setDateTime()"><v-icon
                                                color="error">mdi-close</v-icon></v-btn>
                                    </v-toolbar>
                                    <v-card-text>
                                        <VueTimepicker v-model="time" format="hh:mm A" />
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="success" @click="setDateTime()">Ok</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                            <v-btn icon @click="datePicker = true" flat>
                                <v-icon color="success" id="numpad">mdi-calendar</v-icon>
                            </v-btn>
                            {{ dateTime }}
                        </div>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
        <v-col cols="12" v-if="!props.reactive">
            <v-btn color="success" block @click="create()">Add</v-btn>
        </v-col>
    </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { ref } from 'vue';
import VueTimepicker from 'vue3-timepicker'
import 'vue3-timepicker/dist/VueTimepicker.css'
import Numpad from '@/components/transaction/Numpad.vue';
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';
import { showSnack } from '@/composables/snackbar';
import { addExpense } from '@/modules/database/main'
import { tToStr } from '@/modules/dateTime';
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useSettingsStore } from '@/stores/settings';
import { getCategories } from '@/modules/database/settings';
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps(['reactive', 'totalAmount', 'oldTitle', 'oldDate', 'oldCategory']);
const { params } = useRoute();
const emit = defineEmits(['splitInput'])
const datePicker = ref(false);
const timePicker = ref(false);
const date = ref(new Date())
const time = ref('7:28 PM')
const numpad = ref(false);
const amount = ref(0);
const expenseTitle = ref('');
const user = useUserStore();
const settingsStore = useSettingsStore();
const categories = ref([]);
const categoryId = ref(categories.value && categories.value[0] && categories.value[0].uid);
const showTimer = () => {
    datePicker.value = false;
    timePicker.value = true;
}
const setDateTime = () => {
    console.log(date.value, time.value);
    timePicker.value = false;
    emitter();
}
const initTime = () => {
    // const d = new Date();
    // const h = d.getHours();
    // const m = d.getMinutes();
    // let r = '';
    // if (h > 12) {
    //     r += (h - 12);
    // } else {
    //     r += h;
    // }
    // r += `:${m} `
    // r += h > 12 ? 'PM' : 'AM'
    // time.value = r;
    time.value = tToStr(Date.now());
}
onMounted(() => {
    let uid = user.id;
    if (params.groupId) {
        uid = params.groupId;
    }
    getCategories(uid)
        .then((v) => {
            categories.value = v.filter(i => i.active == true);
            categoryId.value = categories.value[0].uid;
            emitter();

        })
    initTime();
    if (props.oldDate) {
        date.value = props.oldDate;
        expenseTitle.value = props.oldTitle;
        categoryId.value = props.oldCategory;
    }
    if (!props.oldDate) {
        emitter();
    }
});

const dateTime = computed(() => {
    const monthStr = date.value.toLocaleString('en-US', { month: 'short' });
    const day = `${date.value.getDate()}`.padStart(2, 0);
    return `${day} ${monthStr} ${date.value.getFullYear()} ${time.value}`
})
const getNumValue = (v) => {
    amount.value = v;
    numpad.value = false;
    emitter();
}
const numStr = computed(() => amount.value.toFixed(2));
const extractTime = () => {
    const [hourStr, m] = time.value.split(':');
    const [minStr, tf] = m.split(' ');
    return {
        m: Number(minStr),
        h: tf.includes('PM') ? Number(hourStr) + 12 : Number(hourStr)
    }
}
const finalTime = computed(() => {
    const { h: hh, m: mm } = extractTime();
    date.value.setHours(hh);
    date.value.setMinutes(mm);
    return date.value.getTime();
})
const create = () => {

    let payload = {
        userId: user.id,
        title: expenseTitle.value == '' ? 'expense' : expenseTitle.value,
        amount: amount.value,
        amountStr: numStr.value,
        dateTime: finalTime.value,
        createdAt: Date.now(),
        categoryId: categoryId.value
    }
    addExpense(payload)
        .then(msg => {
            showSnack(msg);
            resetForm();
            router.push({ name: 'transactions' })
        })
        .catch(msg => showSnack(msg, 'error'))
}
const resetForm = () => {
    expenseTitle.value = '';
    amount.value = 0;
    date.value = new Date();
    initTime();
}
const emitter = () => {
    const data = {
        title: expenseTitle.value,
        amount: amount.value,
        date: finalTime.value,
        amountStr: numStr.value,
        categoryId: categoryId.value
    }
    emit('splitInput', data);
}
emitter();
watch(() => props.totalAmount, (v) => {
    if (v) {
        amount.value = Number(v);
    }
}, { immediate: true })
</script>