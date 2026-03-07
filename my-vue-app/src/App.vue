<script setup>
import LoginComponent from './components/LoginComponent.vue';
import ParentComponent from './components/ParentComponent.vue';
</script>

<template>
  <div>
    <a>
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <!-- <HelloWorld msg="Vue" />
  <MyVue msg1="MyVue" /> -->
  <LoginComponent/>
  <ParentComponent/>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #b87b42aa);
}
</style>
