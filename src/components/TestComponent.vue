<template>
  <NavbarView></NavbarView>
  <div class="flex min-h-screen bg-gray-100">
    <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity sm:hidden"
        @click="closeSidebar"
    ></div>
    <aside
        :class="[
        'fixed sm:relative w-64 h-screen transition-transform duration-300',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
      ]"
        aria-label="Sidebar"
    >
      <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50">
        <div v-for="category in categories" :key="category.name" class="mb-2">
          <button
              @click="toggleCategory(category.name)"
              class="w-full flex items-center justify-between p-2 text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <span class="font-medium">{{ category.name }}</span>
            <svg
                class="w-4 h-4"
                :class="{ 'transform rotate-180': openCategory === category.name }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <div
              v-show="openCategory === category.name"
              class="ml-4 mt-1 space-y-1"
          >
            <a
                v-for="subcategory in category.subcategories"
                :key="subcategory"
                class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <label
                  class="relative flex cursor-pointer items-center rounded-full p-3"
                  :for="subcategory"
                  data-ripple-dark="true"
              >
                <input
                    type="checkbox"
                    :id="subcategory"
                    :checked="selectedSubcategories.includes(subcategory.toLowerCase())"
                    @change="toggleSubcategory(subcategory)"
                    class="peer relative h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow hover:shadow-md transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-slate-400 before:opacity-0 before:transition-opacity checked:border-slate-800 checked:bg-slate-800 checked:before:bg-slate-400 hover:before:opacity-10"
                    :disabled="loading"
                />
                <span
                    class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                >
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
                  :for="subcategory"
              >
                {{ subcategory }}
              </label>
            </a>
          </div>
        </div>
      </div>
    </aside>

    <div class="flex-1 p-4 sm:ml-0">
      <div class="max-w-6xl mx-auto">
        <button
            class="sm:hidden mb-4 p-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            @click="toggleSidebar"
        >
          <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <div class="text-sm mb-2">Total Documents</div>
            <div class="text-lg font-medium">{{ totalDocuments }}</div>
          </div>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div class="text-gray-500">Loading results...</div>
        </div>
        <div v-else>
          <div
              v-for="item in results"
              :key="item.id"
              class="mb-6 bg-white rounded-lg p-4 shadow-sm"
          >
            <a :href="item.url">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-sm mb-2">{{ item.title || 'Untitled' }}</div>
                <div class="text-xs text-gray-500">
                  {{ item.description || 'No description' }}
                </div>
                <div class="flex justify-items-center p-2.5 gap-2">
                  <div v-for="tag in item.tags" :key="tag">
                    <img class="w-16 rounded-md" :src="`../logo/${tag}.png`"/>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import NavbarView from "@/views/NavbarView.vue";
import {fetchData, fetchCategories} from "@/components/utils/ApiService.vue"

const openCategory = ref(null);
const isSidebarOpen = ref(false);
const loading = ref(false);

const results = ref({});
const totalDocuments = ref(0);

const categories = ref([]);
const selectedSubcategories = ref([]);

const toggleCategory = (category) => {
  openCategory.value = openCategory.value === category ? null : category;
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const toggleSubcategory = async (subcategory) => {
  const lowercaseSubcat = subcategory.toLowerCase();
  const index = selectedSubcategories.value.indexOf(lowercaseSubcat);

  if (index === -1) {
    selectedSubcategories.value.push(lowercaseSubcat);
  } else {
    selectedSubcategories.value.splice(index, 1);
  }
  await fetchData(loading, results, totalDocuments, selectedSubcategories);
};

onMounted(async () => {
  await fetchCategories(categories);
  await fetchData(loading, results, totalDocuments, selectedSubcategories);
});
</script>
