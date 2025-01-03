<template>
  <div class="container mx-auto p-4">
    <!-- Product Title -->
    <h1 class="text-4xl font-bold text-center text-gray-800 mb-6">
      Product Details
    </h1>

    <!-- Show product details once they are fetched -->
    <div v-if="product" class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <!-- Use a flex container for layout -->
      <div class="flex flex-col md:flex-row items-center md:items-start">
        <!-- Text section (left side) -->
        <div class="md:w-2/3">
          <h2 class="text-3xl font-semibold text-gray-900 mb-4">
            {{ product.name }}
          </h2>
          <p class="text-lg text-gray-700 mb-4">
            <strong>Description:</strong> {{ product.description }}
          </p>
          <p class="text-lg text-gray-700">
            <strong>Seller:</strong> {{ product.sellerId }}
          </p>
        </div>

        <!-- Image section (right side) -->
        <div v-if="product.imageUrl" class="md:w-1/3 mb-4 md:mb-0 md:ml-6">
          <img
            :src="product.imageUrl"
            alt="Product Image"
            class="w-full max-w-xs mx-auto rounded-lg"
          />
        </div>
      </div>
    </div>

    <!-- Display loading or error messages if necessary -->
    <p v-else-if="loading" class="text-center text-xl text-gray-500">
      Loading product details...
    </p>
    <p v-else-if="error" class="text-center text-xl text-red-500">
      Error: {{ error }}
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default {
  data() {
    return {
      product: null,
      loading: true,
      error: null,
      productId: this.$route.params.id, // Get product ID from route params
    };
  },
  computed: {
    ...mapGetters(["isAuthenticated", "getProductById"]),
    // Check if the current route is a product detail page
    isProductPage() {
      return this.$route.name === "product-detail"; // Adjust this name according to your route name
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1); // Go back to the previous page
    },
  },
  async created() {
    try {
      // Try to get the product from Vuex cache
      const cachedProduct = this.getProductById(this.productId);
      if (cachedProduct) {
        this.product = cachedProduct; // Use cached product if available
      } else {
        // If the product isn't in the cache, fetch it from Firestore
        const productRef = doc(db, "items", this.productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          this.product = productSnap.data();
          this.$store.commit("setProduct", {
            id: this.productId,
            ...this.product,
          }); // Update the cache
        } else {
          throw new Error("Product not found");
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
