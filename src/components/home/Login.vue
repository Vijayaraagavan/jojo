<template>
    <!-- <v-container fluid class="pa-6"> -->
    <div class="d-flex justify-end align-center pr-6">
        <v-card color="white" class="py-">
            <v-card-title primary-title class="text-center font-weight-bold">
                Login
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
                        <v-col>
                            <label for="password" class="slate--text">Password</label>
                            <v-text-field name="password" id="password" class="my-1" type="password"
                                placeholder="type your password" v-model="password" :rules="[validatePassword]">
                                <template v-slot:prepend-inner>
                                    <v-icon color="indigo darken-4">mdi-lock</v-icon>
                                </template>
                            </v-text-field>
                        </v-col>
                        <v-col cols="12" class="d-flex align-center py-0 pl-1">
                            <v-checkbox v-model="remember" hide-details color="indigo darken-4"></v-checkbox>
                            <label for="remember" class="slate--text">stay signed in</label>
                        </v-col>

                        <v-col cols="12">
                            <v-btn ref="logins" color="indigo darken-4" height="48" @click="login()"
                                :class="{ reduce: loader }" width="380px" v-if="btnVisibility" :disabled="!formValid">
                                <v-icon class="mr-4" v-if="!loader">mdi-login</v-icon><span v-if="!loader">Sign
                                    In</span></v-btn>
                            <v-row class="justify-center" v-else>
                                <v-col cols="2">
                                    <v-progress-circular color="indigo darken-4" indeterminate
                                        class="text-center"></v-progress-circular>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="3" class="text-center">
                            <h5>(Or)</h5>
                            <a href="signup">
                                <v-btn color="primary" variant="text">Sign up</v-btn>
                            </a>
                        </v-col>
                        <v-col cols="12" class="text-center">
                            <h4 class="mb-2">(Or sign in using)</h4>
                            <div class="d-flex justify-center row-2">
                                <v-btn color="indigo darken-4" icon class="mx-2" @click="providerLogin('google')">
                                    <v-icon>mdi-google</v-icon>
                                </v-btn>
                                <v-btn color="indigo darken-4" icon class="mx-2" @click="providerLogin('facebook')">
                                    <v-icon>mdi-facebook</v-icon>
                                </v-btn>
                                <v-btn color="indigo darken-4" icon class="mx-2" @click="providerLogin('twitter')">
                                    <v-icon>mdi-twitter</v-icon>
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>

    <!-- </v-container> -->
</template>

<script setup>
import { computed } from 'vue';
import { onMounted } from 'vue';
import { signInWithEmail, authorized, save as saveSession, signInWithProvider } from '@/modules/auth/auth.js';
import { ref } from 'vue';
import { showSnack } from '@/composables/snackbar';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { loader as loaderBtn } from '@/composables/loader';
import { insert as insertUser } from '@/modules/database/users.js';
import { verifySettings } from '@/modules/database/settings';
const loader = ref(false);
const logins = ref(null);
const btnVisibility = ref(true);
const email = ref('');
const password = ref('');
const formValid = ref(false);
const remember = ref(false);
const router = useRouter();

const login = () => {
    startLoader();
    showLoader()
    console.log(email.value, password.value)
    signInWithEmail(email.value, password.value)
        .then((user) => {
            proceedLogin(user)
        })
        .catch(() => {
            console.log("lalunche")
            showSnack("Authentication failed", "error");
            loaderBtn.stop();
        })
        .finally(() => {
            btnVisibility.value = true;
            loader.value = false;
        })
}
const providerLogin = (id) => {
    showLoader()
    signInWithProvider(id, (user) => {
        proceedLogin(user)
    }, () => loaderBtn.stop())
}
const proceedLogin = (user) => {
    showSnack("Login successfull");
    const { setId } = useUserStore();
    setId(user.uid);
    console.log(remember.value)
    if (remember.value) {
        saveSession();
    }
    insertUser(user);
    loaderBtn.stop();
    verifySettings(user.uid)
    router.push({ name: "dashboard" })
}
const showLoader = () => {
    loaderBtn.start('validating account. Please wait');
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
onMounted(() => {
    logins.value.$el.addEventListener('animationend', () => {
        console.log('ani  e');
        btnVisibility.value = false;
    })
    authorized()
        .then((s) => {
            console.log(s)
            router.push({ name: "dashboards" })
        })
        .catch((f) => {
            console.log("no saved", f)
        })
})
const startLoader = () => {
    console.log(logins.value)
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