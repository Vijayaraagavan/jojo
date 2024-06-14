<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { snackbar, snackMessage, snackColor, reset } from '@/composables/snackbar';
import { authorized } from '@/modules/auth/auth.js';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';
import { start } from '@/stores/init';
import Loader from '@/components/utils/Loader.vue';
import userflow from 'userflow.js';

const loaded = ref(false)
const router = useRouter();

const startUserFlow = (u) => {
  userflow.init('ct_lfxj6ux5xbg4hjeetltlsedo6i')
  userflow.identify(s.uid, {
    name: s.displayName,
    email: s.email,
    signed_up_at: s.metadata && s.metadata.createdAt
  })
}

authorized()
  .then((s) => {
    const user = useUserStore();
    user.setId(s.uid)
      .then(() => {
        startUserFlow(s)
        user.setName(s.displayName);
        start()
          .then(() => loaded.value = true)
      })
  })
  .catch((f) => {
    console.log("no saved", f);
    loaded.value = true;
    router.push({ name: 'login' })
  })
</script>

<template>
  <v-layout>

    <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->
    <Loader />
    <v-snackbar v-model="snackbar" :color="snackColor" tile location="top right">
      <span>{{ snackMessage }}</span>
      <template v-slot:actions>
        <v-btn fab x-small max-height="25" max-width="25" color="white" elevation="0" @click="reset()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <RouterView v-if="loaded" />
  </v-layout>

</template>
<style>
body {
  background-image: url("../src/assets/bg.jpg") !important;
  background-position: center;
  background-size: cover;
  background-repeat: repeat-y;
}

.firebase-emulator-warning {
  display: none;
}

/* header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
