<template>
    <v-card class="ma-2">
        <v-card-text>
            <v-row>
                <v-toolbar density="compact">
                    <v-col cols="7" class="font-weight-medium">
                        {{ transaction.title }}
                    </v-col>
                    <v-col cols="5">
                        {{ transaction.dateTime.slice(0, 6) }}
                    </v-col>

                </v-toolbar>
                <v-col cols="7" class="text-success font-weight-medium">
                    {{ transaction.amountStr }}
                </v-col>
                <v-col cols="5">
                    {{ transaction.dateTime.slice(6) }}
                </v-col>

            </v-row>
        </v-card-text>
    </v-card>
</template>
<script setup>
const { transaction } = defineProps(['transaction'])
</script>