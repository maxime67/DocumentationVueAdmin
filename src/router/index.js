import { createRouter, createWebHistory } from 'vue-router'
import TestComponent from "@/components/TestComponent.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TestComponent
    }
  ]
})

export default router
