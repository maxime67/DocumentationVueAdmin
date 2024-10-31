import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from "@/components/HomeComponent.vue";
import UpdateComponent from "@/components/UpdateComponent.vue";
import ListComponent from "@/components/ListComponent.vue";
import CreateComponent from "@/components/CreateComponent.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeComponent
    },
    {
      path: '/new',
      name: 'new',
      component: CreateComponent
    },
    {
      path: '/update',
      name: 'update',
      component: UpdateComponent
    },
    {
      path: '/list',
      name: 'list',
      component: ListComponent
    },
  ]
})

export default router
