<script setup>
import {RouterLink, RouterView} from 'vue-router'
import HomeComponent from "@/components/HomeComponent.vue";
import NavbarView from "@/views/NavbarView.vue";
</script>

<template>
  <NavbarView></NavbarView>
<!--  <HomeComponent></HomeComponent>-->
<RouterView></RouterView>
</template>

<style scoped>
</style>
