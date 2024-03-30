<template>
    <v-dialog v-model="dialog" scrollable :overlay="false" max-width="400px" transition="dialog-transition">
        <v-card flat>
            <v-toolbar color="indigo darken-4" class="pr-2 pa-2" density="compact" elevation-2>
                <v-row>
                    <v-col cols="10">
                        <v-toolbar-title class="text-capitalize pt-2 pl-2">
                            {{ props.split.title }}
                        </v-toolbar-title>
                    </v-col>
                    <v-col cols="2">
                        <v-btn icon flat @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-toolbar>
            <v-card-text>
                <v-row class="mb-4 mt-2">
                    <v-col class="d-flex justify-space-between box-wrap">
                        <h3>Total</h3>
                        <h3 class="font-weight-bold success--text text-success" color="success">{{ props.split.amountStr
                            }}
                        </h3>
                    </v-col>
                    <v-col cols="12">
                        <v-expansion-panels color="error" flat>
                            <v-expansion-panel expand focusable bg-color="transparent">
                                <v-expansion-panel-title class="d-block mb-0 pa-0 pt-2">
                                    <template v-slot:actions>
                                        <!-- <v-icon>mdi-close</v-icon> -->
                                    </template>
                                    <template v-slot:default="actionsProps" style="display: block;">
                                        <div class="d-flex justify-space-between">
                                            <!-- <v-btn color="success" variant="outlined" @click.stop="openCalc()">Edit</v-btn> -->
                                            <v-btn icon flat density="compact"><v-icon>mdi-chevron-down</v-icon></v-btn>
                                        </div>
                                        <v-card v-for="u in props.split.group.slice(0, 2)" class="my-2 align-center">
                                            <v-card-text>
                                                <v-row align-center class="align-center">
                                                    <v-col cols="2">
                                                        <UserIcon :user="u" />
                                                    </v-col>
                                                    <v-col cols="7">
                                                        <h3 class="">{{ u.displayName }}</h3>
                                                    </v-col>
                                                    <v-col cols="3">
                                                        <h3 class="font-weight-bold success--text text-success"
                                                            color="success">
                                                            {{
        u.amount }}</h3>
                                                    </v-col>
                                                </v-row>
                                            </v-card-text>
                                        </v-card>
                                    </template>
                                </v-expansion-panel-title>
                                <v-expansion-panel-text style="position: relative; top: -30px;" class="pa-0">
                                    <v-card v-for="u in props.split.group.slice(2)" class="my-2 align-center">
                                        <v-card-text>
                                            <v-row align-center class="align-center">
                                                <v-col cols="2">
                                                    <UserIcon :user="u" />
                                                </v-col>
                                                <v-col cols="7">
                                                    <h3 class="">{{ u.displayName }}</h3>
                                                </v-col>
                                                <v-col cols="3">
                                                    <h3 class="font-weight-bold success--text text-success"
                                                        color="success">
                                                        {{
        u.amount }}</h3>
                                                </v-col>
                                            </v-row>
                                        </v-card-text>
                                    </v-card>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-col>
                    <v-col cols="4" class="subtitle">
                        <h3>DateTime</h3>
                    </v-col>
                    <v-col class="d-flex justify-end">
                        <h3>{{ props.split.dateTime }}</h3>
                    </v-col>
                    <v-col cols="12" class="d-flex justify-end">
                        <v-btn color="indigo darken-4" @click="editSplit()"><v-icon class="mr-1">mdi-pencil</v-icon>
                            Edit</v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { useSplitStore } from '@/stores/split';
import UserIcon from './UserIcon.vue';
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps(['split'])
const dialog = defineModel('dialog');
const { setSplit } = useSplitStore();

const editSplit = () => {
    setSplit(props.split);
    router.push({ name: 'splitUpdate', params: { tId: props.split.uid } });
}
</script>
<style scoped>
.box-wrap {
    border: 0.5px solid gray;
}

.custom-text-field :deep(.v-input__control input) {
    color: var(--v-theme-success);
    font-size: 20px;
    font-weight: 500;
}

.v-expansion-panel-text :deep(.v-expansion-panel-text__wrapper) {
    padding: 8px 0 0;
}

.subtitle {
    color: gray;
    font-weight: 300;
}
</style>