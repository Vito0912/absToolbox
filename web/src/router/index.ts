import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/features/home/views/HomeView.vue"),
    },
    {
      path: "/tools",
      name: "tools",
      component: () => import("@/features/tools/views/SelectionView.vue"),
    },
    {
      path: "/tool/:id",
      name: "tool",
      component: () => import("@/features/tools/views/ToolsView.vue"),
    },
    {
      path: "/projects",
      name: "projects",
      component: () => import("@/features/projects/views/ProjectsView.vue"),
    },
    {
      path: "/clients",
      name: "clients",
      component: () => import("@/features/clients/views/ClientsView.vue"),
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("@/features/settings/views/SettingsView.vue"),
    },
    {
      path: "/stats",
      name: "stats",
      component: () => import("@/features/stats/views/StatsView.vue"),
    },
  ],
});

export default router;
