<template>
  <div>
    <h1>Marketplace</h1>
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
    ...mapGetters(["allProducts"]),
    products() {
      return this.allProducts;
    },
  },
  created() {
    this.fetchProducts();
  },
  methods: {
    ...mapActions(["fetchProducts"]),
  },
};
</script>
