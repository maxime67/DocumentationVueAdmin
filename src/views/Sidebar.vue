<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  selectedCategories: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  isSidebarOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:selectedCategories', 'closeSidebar']);

const toggleCategory = (category) => {
  const newSelectedCategories = [...props.selectedCategories];
  const index = newSelectedCategories.indexOf(category);
  if (index === -1) {
    newSelectedCategories.push(category);
  } else {
    newSelectedCategories.splice(index, 1);
  }
  emit('update:selectedCategories', newSelectedCategories);
};
</script>

<template>
  <div>
    <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity sm:hidden"
        @click="$emit('closeSidebar')"
    ></div>

    <aside
        :class="[
        'fixed sm:relative w-64 h-screen transition-transform duration-300',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
      ]"
        aria-label="Sidebar"
    >
      <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50">
        <div class="space-y-1">
          <div v-for="category in categories" :key="category" class="flex items-center p-2">
            <label
                class="relative flex cursor-pointer items-center rounded-full p-3"
                :for="category"
                data-ripple-dark="true"
            >
              <input
                  type="checkbox"
                  :id="category"
                  :checked="selectedCategories.includes(category)"
                  @change="toggleCategory(category)"
                  class="checkbox-input"
                  :disabled="loading"
              />
              <span class="checkbox-checkmark">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="1"
                >
                  <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                  ></path>
                </svg>
              </span>
            </label>
            <label
                class="cursor-pointer text-slate-600 text-sm"
                :for="category"
            >
              {{ category }}
            </label>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.checkbox-input {
  @apply relative h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow hover:shadow-md transition-all;
  @apply before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12;
  @apply before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-slate-400;
  @apply before:opacity-0 before:transition-opacity checked:border-slate-800 checked:bg-slate-800;
  @apply checked:before:bg-slate-400 hover:before:opacity-10;
}

.checkbox-checkmark {
  @apply pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4;
  @apply text-white opacity-0 transition-opacity peer-checked:opacity-100;
}
</style>