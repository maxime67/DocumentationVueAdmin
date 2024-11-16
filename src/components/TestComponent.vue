<template>
  <NavbarView></NavbarView>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Backdrop overlay -->
    <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity sm:hidden"
        @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
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
                  class="peer relative h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow hover:shadow-md transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-slate-400 before:opacity-0 before:transition-opacity checked:border-slate-800 checked:bg-slate-800 checked:before:bg-slate-400 hover:before:opacity-10"
                  :disabled="loading"
              />
              <span class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
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

    <!-- Main Content -->
    <div class="flex-1 p-4 sm:ml-0">
      <div class="max-w-6xl mx-auto">
        <!-- Toggle Sidebar Button (Mobile Only) -->
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

        <!-- Stats -->
        <div class="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <div class="text-sm mb-2">Total Documents</div>
            <div class="text-lg font-medium">{{ totalDocuments }}</div>
          </div>
        </div>

        <!-- Results Grid -->
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
                    <img class="w-16 rounded-md" :src="`../logo/${tag}.png`" />
                  </div>
                </div>
              </div>
            </a>
              <ul class="flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
                <li class="flex items-center p-1 text-sm gap-x-2 text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-slate-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                  </svg>
                  <a href="#" class="flex items-center">Update</a>
                </li>
                <li class="flex items-center p-1 text-sm gap-x-2 text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 text-slate-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                  </svg>
                  <a href="#" class="flex items-center">unpublish</a>
                </li>
              </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import axios from 'axios';
import NavbarView from "@/views/NavbarView.vue";

// State
const isSidebarOpen = ref(false);
const loading = ref(false);
const results = ref({});
const totalDocuments = ref(0);
const selectedCategories = ref([]);

// Flat categories array
const categories = [
  'Jenkins', 'Docker', 'Kubernetes', 'GitLab',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'NodeJS', 'Python', 'Java', 'PHP',
  'Symfony', 'VueJS',
  'Nginx', 'Apache', 'Tomcat'
];

// Methods
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const toggleCategory = async (category) => {
  const index = selectedCategories.value.indexOf(category);
  if (index === -1) {
    selectedCategories.value.push(category);
  } else {
    selectedCategories.value.splice(index, 1);
  }
  await fetchData();
};

const fetchData = async () => {
  loading.value = true;
  try {
    const selectedCats = selectedCategories.value.map(cat => cat.toLowerCase());
    const response = await axios.get(
        import.meta.env.VITE_APIURL + `/category${
            selectedCats.length ? `?categories=${selectedCats.join(',')}` : ''
        }`
    );
    results.value = response.data.results;
    totalDocuments.value = response.data.totalDocuments;
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    loading.value = false;
  }
};

// Lifecycle hooks
onMounted(async () => {
  await fetchData();
});
</script>