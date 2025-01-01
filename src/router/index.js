import { createRouter, createWebHistory } from "vue-router";

import ProductDetail from "@/views/ProductDetail.vue";

import HomePage from "@/views/HomePage.vue";
import LoginPage from "@/views/LoginPage.vue"; // Example of another page, adjust as needed

const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/product/:id", name: "ProductDetail", component: ProductDetail },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/RegisterPage.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/AboutView.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("@/views/SearchPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
