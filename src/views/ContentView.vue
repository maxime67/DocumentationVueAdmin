<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: null
  },
  loading: {
    type: Boolean,
    default: null
  },
  error: {
    type: String,
    default: null
  }
})
</script>
<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Documentation Card -->
        <div v-for="item in props.data" :key="item.id" class="w-full max-w-sm transform hover:scale-105 transition-all duration-300 rounded-lg overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600">
          <a :href="item.url">
            <div class="p-6">
              <div class="flex items-center justify-between pb-2">
                <h2 class="text-xl font-bold text-white">{{ item.title }}</h2>
              </div>
              <p class="text-white/90">{{ item.description }}</p>
            </div>
            <div class="flex justify-items-center p-2.5 gap-2">
              <div v-for="tag in item.tags" :key="tag.id">
                <img class="w-16 rounded-md" :src="`../logo/${tag}.png`">
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
