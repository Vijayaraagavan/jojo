<template>
    <v-card class="py-">
        <v-toolbar class="pr-0" density="compact" elevation-10>
            <v-toolbar-title>
                Amount
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="send()"><v-icon color="error">mdi-close</v-icon></v-btn>
        </v-toolbar>
        <v-card-text class="pa-0 py-3">
            <v-row>
                <v-col cols="4" v-for="i in num" :key="i.value" class="cell text-center">
                    <v-btn variant="text" @click="add(i)">
                        <h3 class="font-weight-medium">{{ i.label }}</h3>
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup>
const emit = defineEmits(['numvalue']);
const num = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: '6', value: 6 },
    { label: '7', value: 7 },
    { label: '8', value: 8 },
    { label: '9', value: 9 },
    { label: '.', value: -1 },
    { label: '0', value: 0 },
    { label: 'Ok', value: -2 },
]
let total = '';
const add = (n) => {
    if (n.value == -2) {
        send();
        return;
    }
    total += n.label;
}
const send = () => {
    emit('numvalue', Number(total));
    total = '';
}
// const str = () => {
//     let v = total.split('.');
// }
</script>

<style scoped>
.cell {
    border: 1px solid grey;
}
</style>