<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="bg-white shadow dark:bg-gray-800 relative z-50">
    <!-- Mobile Menu Button -->
    <div class="lg:hidden flex justify-end p-4">
      <button
          @click="toggleMenu"
          class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none"
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
          <path
              v-if="!isMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
          />
          <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Desktop Menu -->
    <div class="hidden lg:flex container items-center justify-center p-6 mx-auto text-gray-600 capitalize dark:text-gray-300">
      <RouterLink
          v-for="(item, index) in ['home', 'apache', 'nodeJs', 'mongoDb', 'mysql']"
          :key="index"
          :to="`/${item}`"
          class="mx-1.5 sm:mx-6"
      >
        <button
            type="button"
            class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-20 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
        >
          {{ item === 'home' ? 'Home' : item }}
        </button>
      </RouterLink>
    </div>

    <!-- Mobile Menu (Sidebar) -->
    <div
        v-show="isMenuOpen"
        class="lg:hidden fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50"
        :class="isMenuOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex flex-col space-y-4 p-4">
        <RouterLink
            v-for="(item, index) in ['home', 'list', 'new', 'update']"
            :key="index"
            :to="`/${item}`"
            @click="toggleMenu"
        >
          <button
              type="button"
              class="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-6 py-2.5 mb-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            {{ item === 'home' ? 'Home' : item }}
          </button>
        </RouterLink>
      </div>
    </div>

    <!-- Overlay for mobile menu -->
    <div
        v-if="isMenuOpen"
        @click="toggleMenu"
        class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
    ></div>
  </nav>
</template>

<style scoped>
.router-link-active button {
  @apply bg-blue-600 dark:bg-blue-700;
}
</style>
