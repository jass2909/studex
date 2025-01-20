<template>
  <div class="search-page">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
      Search For Items
    </h1>
    <div class="input-container">
      <!-- Search Query -->
      <input
        type="text"
        v-model="searchQuery"
        @input="search"
        placeholder="Search for items..."
        class="search-input"
      />
      <!-- Price Range -->
      <div class="price-filter flex space-x-4 mt-4">
        <input
          type="number"
          v-model.number="priceMin"
          @input="search"
          placeholder="Min Price"
          class="price-input"
        />
        <input
          type="number"
          v-model.number="priceMax"
          @input="search"
          placeholder="Max Price"
          class="price-input"
        />
      </div>
      <!-- Category Filter -->
      <div class="category-filter mt-4">
        <select v-model="selectedCategory" @change="search" class="category-select">
          <option value="">All Categories</option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>
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
      <div v-else-if="searchQuery.trim() !== '' || priceMin || priceMax || selectedCategory" class="no-results-container">
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
      priceMin: null,
      priceMax: null,
      selectedCategory: "",
      searchResults: [],
      categories: ["Electronics", "Clothing", "Home", "Toys", "Books"],
    };
  },
  computed: {
    ...mapGetters(["allProducts", "categories"]),
  },
  methods: {
    search() {
      const query = this.searchQuery.toLowerCase();
      const min = this.priceMin;
      const max = this.priceMax;
      const category = this.selectedCategory;

      this.searchResults = this.allProducts.filter((product) => {
        const matchesQuery =
          query === "" || product.name.toLowerCase().includes(query);
        const matchesPrice =
          (!min || product.price >= min) && (!max || product.price <= max);
        const matchesCategory =
          !category || product.category === category;

        return matchesQuery && matchesPrice && matchesCategory;
      });
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
  flex-direction: column;
  align-items: center;
}
.search-input,
.price-input,
.category-select {
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
.price-filter {
  justify-content: center;
}
</style>