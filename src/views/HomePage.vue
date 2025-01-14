<template>
  <div class="container mt-10 p-4">
    <div v-if="products.length < 0"
      class="text-center text-xl text-gray-500 flex justify-center items-center h-screen">
      <div
        class="loader border-t-2 rounded-full border-green-500 bg-black animate-spin aspect-square w-20 flex justify-center items-center text-white">
        Studex
      </div>
    </div>
    <p v-if="products.length === 0">No products yet</p>
    <!-- Authentication Message -->
    <div v-if="!isAuthenticated" class="text-center text-red-500 text-lg mb-4">
      You must be logged in to view this page.
      <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link>
    </div>

    <!-- Product List -->
    <transition-group name="fade" tag="div" appear>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="product in products" :key="product.id"
          class="border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
          <router-link :to="`/product/${product.id}`" class="text-lg font-medium text-gray-700 hover:text-blue-500">
            <div class="mb-4">
              <img :src="product.imageUrl" alt="Product Image" class="w-full h-64 object-contain rounded-mg"
                 />
            </div>
           
            <div class="flex flex-col">
              <span class="font-semibold text-gray-800">{{ product.name }}</span>
              <span class="text-gray-600">€{{ product.price }}</span>
              <span class="text-gray-600">Location: {{ product.city }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </transition-group>

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
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
