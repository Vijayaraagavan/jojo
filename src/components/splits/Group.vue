<template>
    <v-card v-if="group && group.name">
        <v-card-text>
            <v-row>
                <v-col class="d-flex justify-end align-center">
                    <h4 class="pt-1">Ref ID</h4>
                    <h3 class="font-weight-medium ml-1">{{ group.joinId }}</h3>
                    <v-icon size="small" class="pt-1 ml-1" @click="copy()">mdi-note-outline</v-icon>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup>
const group = defineModel('group');
const copy = () => {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(group.value.joinId);
    }
}
</script>