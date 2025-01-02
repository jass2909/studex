<template>
  <div>
    <h1>Marketplace</h1>

    <!-- Login Button (conditionally show if not authenticated) -->
    <div v-if="!isAuthenticated">Please login</div>
    <div v-for="product in products" :key="product.id">
      <router-link :to="`/product/${product.id}`">
        {{ product.name }} - €{{ product.price }}
      </router-link>
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
