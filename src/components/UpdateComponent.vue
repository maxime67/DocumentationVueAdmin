<script setup>
import {ref, onMounted, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const emit = defineEmits(['saved', 'error']);

// Form data
const document = ref({
  title: '',
  description: '',
  url: '',
  category: '',
  subcategories: [],
  tags: [],
  status: 'draft',
});

const newTag = ref('');
const loading = ref(false);
const error = ref(null);
const categories = ref([]);
const selectedCategory = ref(null);

// Available statuses
const statuses = ['draft', 'published', 'archived'];

// Fetch categories and subcategories
async function fetchCategories() {
  try {
    const response = await axios.get(import.meta.env.VITE_APIURL + '/categories');
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    error.value = 'Failed to load categories: ' + error.message;
  }
}

// Load existing document if editing
async function loadDocument() {
  const documentId = route.params.id;
  if (!documentId) return;

  try {
    loading.value = true;
    const response = await fetch(import.meta.env.VITE_APIURL + `/documentation/${documentId}`);
    if (!response.ok) throw new Error('Failed to load document');
    const loadedDocument = await response.json();
    document.value = loadedDocument;

    // Set selected category based on loaded document
    if (document.value.category) {
      selectedCategory.value = categories.value.find(cat => cat.name === document.value.category);
    }
  } catch (err) {
    error.value = 'Failed to load document: ' + err.message;
    emit('error', error.value);
  } finally {
    loading.value = false;
  }
}

// Watch for changes in categories and document to ensure proper initialization
watch(
    [categories, document],
    ([newCategories, newDocument]) => {
      if (newCategories.length && newDocument.category) {
        selectedCategory.value = categories.value.find(cat => cat.name === document.value.category);
      }
    },
    { immediate: true }
);

// Handle category change
function handleCategoryChange(categoryName) {
  document.value.category = categoryName;
  selectedCategory.value = categories.value.find(cat => cat.name === categoryName);
  // Don't reset subcategories when changing category if editing existing document
  if (!route.params.id) {
    document.value.subcategories = [];
  }
}

// Toggle subcategory selection
function toggleSubcategory(subcategory) {
  const index = document.value.subcategories.indexOf(subcategory);
  if (index === -1) {
    document.value.subcategories.push(subcategory);
  } else {
    document.value.subcategories.splice(index, 1);
  }
}

// Add tag to the list
function addTag() {
  if (newTag.value && !document.value.tags.includes(newTag.value)) {
    document.value.tags.push(newTag.value);
    newTag.value = '';
  }
}

// Remove tag from the list
function removeTag(index) {
  document.value.tags.splice(index, 1);
}

// Save document
async function saveDocument() {
  try {
    loading.value = true;
    error.value = null;

    const documentId = route.params.id;
    const url = documentId
        ? `${import.meta.env.VITE_APIURL}/documentation/${documentId}`
        : `${import.meta.env.VITE_APIURL}/documentation`;
    const method = documentId ? 'PUT' : 'POST';

    const response = await axios({
      method,
      url,
      data: document.value
    });

    emit('saved', response.data);
    router.push('/');
  } catch (err) {
    error.value = 'Failed to save document: ' + err.message;
    emit('error', error.value);
  } finally {
    loading.value = false;
  }
}

// Handle enter key on tag input
function handleTagKeydown(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    addTag();
  }
}

// Load categories and document on mount
onMounted(async () => {
  await fetchCategories();
  await loadDocument();
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <!-- Header -->
      <h2 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
        {{ route.params.id ? 'Edit Document' : 'New Document' }}
      </h2>

      <!-- Error Alert -->
      <div
          v-if="error"
          class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6"
      >
        {{ error }}
      </div>

      <form @submit.prevent="saveDocument" class="space-y-6">
        <!-- Title -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Title</label>
          <input
              v-model="document.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
              placeholder="Enter document title"
          />
        </div>

        <!-- Description -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
              v-model="document.description"
              required
              rows="4"
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
              placeholder="Enter document description"
          ></textarea>
        </div>

        <!-- URL -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">URL</label>
          <input
              v-model="document.url"
              type="url"
              required
              class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
              placeholder="https://example.com"
          />
        </div>

        <!-- Category and Status -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Category</label>
            <select
                v-model="document.category"
                @change="handleCategoryChange($event.target.value)"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all bg-white"
            >
              <option value="">Select a category</option>
              <option
                  v-for="category in categories"
                  :key="category.name"
                  :value="category.name"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select
                v-model="document.status"
                required
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all bg-white"
            >
              <option v-for="status in statuses" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </div>
        </div>

        <!-- Subcategories -->
        <div v-if="selectedCategory" class="space-y-3">
          <label class="block text-sm font-medium text-gray-700">Subcategories</label>
          <div class="space-y-2">
            <div
                v-for="subcategory in selectedCategory.subcategories"
                :key="subcategory"
                class="flex items-center"
            >
              <input
                  type="checkbox"
                  :id="subcategory"
                  :value="subcategory"
                  :checked="document.subcategories.includes(subcategory)"
                  @change="toggleSubcategory(subcategory)"
                  class="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500"
              />
              <label :for="subcategory" class="ml-2 text-sm text-gray-700">
                {{ subcategory }}
              </label>
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700">Tags</label>
          <div class="flex gap-2">
            <input
                v-model="newTag"
                type="text"
                class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
                placeholder="Add a tag"
                @keydown="handleTagKeydown"
            />
            <button
                type="button"
                @click="addTag"
                class="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Add
            </button>
          </div>

          <!-- Tags List -->
          <div class="flex flex-wrap gap-2">
            <span
                v-for="(tag, index) in document.tags"
                :key="index"
                class="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800"
            >
              {{ tag }}
              <button
                  type="button"
                  @click="removeTag(index)"
                  class="ml-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="pt-6">
          <button
              type="submit"
              :disabled="loading"
              class="w-full md:w-auto px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading">Saving...</span>
            <span v-else>{{ route.params.id ? 'Update Document' : 'Create Document' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>