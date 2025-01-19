import { createRouter, createWebHistory } from "vue-router";
import store from "@/store"; // Adjust the path to your Vuex store file

import ProductDetail from "@/views/ProductDetail.vue";

import HomePage from "@/views/HomePage.vue";
import LoginPage from "@/views/LoginPage.vue"; // Example of another page, adjust as needed
import { name } from "dayjs/locale/en";



const routes = [
  { path: "/", name: "Home", component: HomePage
    
  },
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
  {
    path: "/sell",
    name: "sell",
    meta: { requiresAuth: true },
    component: () => import("@/views/SellPage.vue"),
  },
  {
    path: "/profile/:uid",
    name: "profile",
    component: () => import("@/views/ProfilePage.vue"),
  },
  {
    path: "/seller/:uid",
    name: "SellerProfile",
    component: () => import("@/views/SellerProfile.vue"),

  },
  {
    path: "/offers",
    name: "offers",
    meta: { requiresAuth: true },
    component: () => import("@/views/OffersPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;
