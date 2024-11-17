import { createRouter, createWebHistory } from 'vue-router'
import TestComponent from "@/components/TestComponent.vue";
import CreateComponent from "@/components/CreateComponent.vue";
import UpdateComponent from "@/components/UpdateComponent.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: TestComponent
    },
    {
      path: '/add/documentation',
      name: 'addDocumentation',
      component: CreateComponent
    },
    {
      path: '/update/documentation/:id',
      name: 'updateDocumentation',
      component: UpdateComponent
    }
  ]
})

export default router
