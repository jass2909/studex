<template>
  <div class="search-page">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
      Search For Items
    </h1>
    <div class="input-container">
      <input type="text" v-model="searchQuery" @input="search" placeholder="Search for items..." class="search-input" />
    </div>
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
      <div v-else-if="searchQuery.trim() !== ''" class="no-results-container">
        <p>No results found</p>
      </div>
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
.search-page {
  margin-top: 40px;
}
.input-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
.search-input {
  width: 100%;
  max-width: 200px;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.no-results-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}
</style>
