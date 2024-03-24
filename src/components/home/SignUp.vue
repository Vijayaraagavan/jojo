<template>
    <v-container fluid>
        <div class="flex justify-center align-center">
            <v-card color="white" class="py-2">
                <v-card-title primary-title class="text-center font-weight-bold">
                    Create an account
                </v-card-title>
                <v-card-text>
                    <v-form v-model="formValid">
                        <v-row class="justify-center">

                            <v-col cols="12">
                                <label for="email" class="slate--text">Email</label>
                                <v-text-field name="email" id="email" class="my-1" placeholder="xyz@gmail.com"
                                    v-model="email" :rules="[validateEmail]">
                                    <template v-slot:prepend-inner>
                                        <v-icon color="indigo darken-4">mdi-email</v-icon>
                                    </template></v-text-field>
                            </v-col>
                            <v-col xs="12" sm="12">
                                <label for="password" class="slate--text">Password</label>
                                <v-text-field name="password" id="password" class="my-1" type="password"
                                    placeholder="type your password" v-model="password" :rules="[validatePassword]">
                                    <template v-slot:prepend-inner>
                                        <v-icon color="indigo darken-4">mdi-lock</v-icon>
                                    </template>
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <label for="repassword" class="slate--text">Re-enter Password</label>
                                <v-text-field name="repassword" id="repassword" class="my-1" type="password"
                                    placeholder="type your password" v-model="repassword"
                                    :rules="[validatePassword, matchPassword]">
                                    <template v-slot:prepend-inner>
                                        <v-icon color="indigo darken-4">mdi-lock</v-icon>
                                    </template>
                                </v-text-field>
                            </v-col>

                            <v-col cols="12">
                                <v-btn ref="logins" color="indigo darken-4" height="48" @click="create()"
                                    :class="{ reduce: loader }" width="380px" v-if="btnVisibility"
                                    :disabled="!formValid">
                                    <v-icon class="mr-4" v-if="!loader">mdi-login</v-icon><span
                                        v-if="!loader">Register</span></v-btn>
                                <v-row class="justify-center" v-else>
                                    <v-col cols="2">
                                        <v-progress-circular color="indigo darken-4" indeterminate
                                            class="text-center"></v-progress-circular>
                                    </v-col>
                                </v-row>
                            </v-col>
                            <v-col cols="3" class="text-center">
                                <h5>(Or)</h5>
                                <!-- <a href="signup">
                                    <v-btn color="primary" variant="text">Sign up</v-btn>
                                </a> -->
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </div>
    </v-container>
</template>

<script setup>
import { computed } from 'vue';
import { onMounted } from 'vue';
import { creatUserWithEmail } from '@/modules/auth/auth.js';
import { ref } from 'vue';
import { showSnack } from '@/composables/snackbar';
import { useRouter } from 'vue-router';
const router = useRouter();
const loader = ref(false);
const logins = ref(null);
const btnVisibility = ref(true);
const email = ref('');
const password = ref('');
const repassword = ref('');
const formValid = ref(false);
const create = () => {
    startLoader();
    console.log(email.value, password.value)
    creatUserWithEmail(email.value, password.value)
        .then(() => {
            showSnack("User created");
            router.push({ name: 'login' })
        })
        .catch(() => {
            console.log("lalunche")
            showSnack("Error occured during registration", "error");

        })
        .finally(() => {
            btnVisibility.value = true;
            loader.value = false;
        })
}
const validateEmail = () => {
    const emailRegex = /\S+@\S+\.\S+/;

    // Check if email is empty
    if (!email.value) {
        return 'Email is required';
    } else if (!emailRegex.test(email.value)) { // Check if email is valid
        return 'Please enter a valid email';
    } else {
        return true; // Reset error message if email is valid
    }
}
const validatePassword = () => {
    return true;
}
const matchPassword = () => {
    if (password.value != repassword.value) {
        return 'password not matching'
    } else {
        return true;
    }
}
onMounted(() => {
    logins.value.$el.addEventListener('animationend', () => {
        btnVisibility.value = false;
    })
})
const startLoader = () => {
    loader.value = true;
}
</script>

<style scoped>
.reduce {
    animation: loose 0.5s;
    animation-direction: normal;
    animation-iteration-count: 1;
}

@keyframes loose {
    0% {
        transform: scaleX(1);
    }

    100% {
        transform: scaleX(0.1);
    }

}

.button-leave-from {
    transform: scaleX(1);
    opacity: 1;
}

.button-leave-active {
    transition: all 1s;
}

.button-leave-to {
    transform: scaleX(0.5);
    opacity: 0;

}

/* .button-enter-active,
.button-leave-active {
    transition: all 2s;
}

.button-enter,
.button-leave-to {
    opacity: 0;
    transform: scale(0);
} */
</style>