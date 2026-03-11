<template>
  <div>
    <h2>Welcome</h2>
  </div>
  <nav>
    <router-link to="/welcome/parent">父组件</router-link> | 
    <router-link to="/welcome/child">子组件</router-link>
  </nav>
  <router-view />
</template>