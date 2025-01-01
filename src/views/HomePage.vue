<template>
  <div>
    <h1>Marketplace</h1>

    <!-- Login Button (conditionally show if not authenticated) -->

    <div v-for="product in products" :key="product.id">
      <router-link :to="`/product/${product.id}`">
        {{ product.itemName }} - €{{ product.price }}
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters(["allProducts"]),
    products() {
      return this.allProducts;
    },
    // Check if user is authenticated from Vuex store
    isAuthenticated() {
      return this.$store.getters.isAuthenticated; // assuming this getter exists in Vuex store
    },
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    ...mapActions(["fetchProducts"]),
    goToLogin() {
      this.$router.push("/login"); // Navigates to login page
    },
    goToRegister() {
      this.$router.push("/register"); // Navigates to register page
    },
  },
};
</script>
