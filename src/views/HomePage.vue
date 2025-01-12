<template>
  <div class="container mt-10 p-4">
    <div v-if="products.length === 0" class="text-center text-xl text-gray-500 flex justify-center items-center h-screen">
      <button
  disabled=""
  class="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center transition duration-300 transform hover:scale-105 active:scale-95"
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="animate-spin h-5 w-5 mr-3 text-white"
  >
    <circle
      stroke-width="4"
      stroke="currentColor"
      r="10"
      cy="12"
      cx="12"
      class="opacity-25"
    ></circle>
    <path
      d="M4 12a8 8 0 018-8v8H4z"
      fill="currentColor"
      class="opacity-75"
    ></path>
  </svg>
  Loading...
</button>

    </div>
    <!-- Authentication Message -->
    <div v-if="!isAuthenticated" class="text-center text-red-500 text-lg mb-4">
      You must be logged in to view this page.
      <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link>

    </div>

    <!-- Product List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
      >
        <router-link
          :to="`/product/${product.id}`"
          class="text-lg font-medium text-gray-700 hover:text-blue-500"
        >
          <div class="mb-4">
            <img
              :src="product.imageUrl"
              alt="Product Image"
              class="w-full h-64 object-contain rounded-mg"
            />
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-gray-800">{{ product.name }}</span>
            <span class="text-gray-600">€{{ product.price }}</span>
            <span class="text-gray-600">Location: {{ product.location }}</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      products: [],

    };
  },
  computed: {
    // Map products from the main store
    ...mapGetters(["allProducts"]),

    products() {
      return this.allProducts;
    },

    // Explicitly access the namespaced isAuthenticated getter
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    // Map fetchProducts action
    ...mapActions(["fetchProducts"]),

    goToLogin() {
      this.$router.push("/login");
    },

    goToRegister() {
      this.$router.push("/register");
    },
  },
};
</script>
