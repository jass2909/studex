<template>
  <div class="search-page">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
      Search for Items
    </h1>
    <input type="text" v-model="searchQuery" @input="search" placeholder="Search for items..." class="search-input" />
    <div class="container mt-14 p-4">
      <div v-if="searchResults.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
            v-for="product in searchResults"
            :key="product.id"
            class="border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow mt-4 bg-white"
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
              <span class="text-gray-600">Location: {{ product.city }}</span>
            </div>
          </router-link>
        </div>
      </div>
      <p v-else-if="searchQuery.trim() !== ''">No results found</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchQuery: "",
      searchResults: [],
    };
  },
  computed: {
    ...mapGetters(["allProducts"]),
  },
  methods: {
    search() {
      if (this.searchQuery.trim() === "") {
        this.searchResults = [];
        return;
      }
      const query = this.searchQuery.toLowerCase();
      this.searchResults = this.allProducts.filter((product) =>
          product.name.toLowerCase().includes(query)
      );
    },
  },
};
</script>

<style scoped>
.search-input {
  width: 50%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
