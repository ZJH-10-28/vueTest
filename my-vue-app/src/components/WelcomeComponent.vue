<template>
  <div>
    <h2>Welcome</h2>
  </div>
  <div>
    <router-link to="/parent">父组件</router-link> | 
    <router-link to="/child">子组件</router-link>
  </div>
  <router-view />
</template>