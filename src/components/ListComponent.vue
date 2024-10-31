<script setup>
import * as api from "./utils/ApiService.vue"
import {ref, onMounted} from 'vue';
import ContentView from '@/views/ContentView.vue'

const data = ref(null)
const error = ref(null)
const loading = ref(null)

onMounted(async () => {
  await api.fetchData(error, loading, data, "")
})
</script>

<template>
  <ContentView :data="data" :loading="loading" :error="error" ></ContentView>
</template>

<style scoped></style>
