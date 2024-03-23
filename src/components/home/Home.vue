<script setup>
// import { analytics } from '@/modules/firebase';
import { creatUserWithEmail, signInWithEmail } from '@/modules/auth';
const name = 'Home'
const count = 0;
console.log(import.meta.env.MODE);
// creatUserWithEmail("vijay@ardhika.com", "123456");
signInWithEmail("vijay@ardhika.com", "123456");
</script>

<template>
    <div>
        <h1>Welcome to {{ name }}</h1>
    </div>
</template>