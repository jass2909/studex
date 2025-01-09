<template>
  <div class="container mx-auto p-4">

    <!-- Authentication Message -->
    <div v-if="!isAuthenticated" class="text-center text-red-500 text-lg mb-4">
      You must be logged in to view the marketplace.
    </div>

    <!-- Product List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              class="w-full h-64 object-cover rounded-lg"
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
