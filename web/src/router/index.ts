import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'tools',
      component: () => import('@/views/SelectionView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue')
    },
    {
      path: '/tool/:id',
      name: 'tool',
      component: () => import('@/views/ToolsView.vue'),
    }
  ]
})

export default router