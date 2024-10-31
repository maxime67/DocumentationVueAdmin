<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  documentId: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['saved', 'error']);

// Form data with simplified structure
const document = ref({
  title: '',
  description: '',
  url: '',
  category: 'apache',
  tags: [],
  status: 'draft',
});

const newTag = ref('');
const loading = ref(false);
const error = ref(null);

// Available options for dropdowns
const categories = ['apache', 'nodejs', 'mongodb', 'mysql'];
const statuses = ['draft', 'published', 'archived'];

// Load existing document if editing
async function loadDocument() {
  if (!props.documentId) return;

  try {
    loading.value = true;
    const response = await axios.get(`/api/documents/${props.documentId}`);
    document.value = response.data;
  } catch (err) {
    error.value = 'Failed to load document: ' + err.message;
    emit('error', error.value);
  } finally {
    loading.value = false;
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

    const payload = { ...document.value };

    let response;
    if (props.documentId) {
      response = await axios.put(`/api/documents/${props.documentId}`, payload);
    } else {
      response = await axios.post('/api/documents', payload);
    }

    emit('saved', response.data);
  } catch (err) {
    error.value = 'Failed to save document: ' + err.message;
    emit('error', error.value);
  } finally {
    loading.value = false;
  }
}

// Load document on mount if editing
onMounted(() => {
  if (props.documentId) {
    loadDocument();
  }
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8 max-w-3xl">
      <!-- Header -->
      <h2 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-8">
        {{ props.documentId ? 'Edit Document' : 'New Document' }}
      </h2>

      <!-- Error Alert -->
      <div
          v-if="error"
          class="bg-gray-50 border border-gray-200 text-gray-800 px-4 py-3 rounded-lg mb-6"
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
                required
                class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all bg-white"
            >
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
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

        <!-- Tags -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700">Tags</label>
          <div class="flex gap-2">
            <input
                v-model="newTag"
                type="text"
                class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
                placeholder="Add a tag"
                @keyup.enter.prevent="addTag"
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
            <span v-else>{{ props.documentId ? 'Update Document' : 'Create Document' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>