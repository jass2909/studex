<template>
  <div>
    <h1>Product Details</h1>

    <!-- Show product details once they are fetched -->
    <div v-if="product">
      <h2>{{ product.name }}</h2>
      <p><strong>Description:</strong> {{ product.description }}</p>
      <img
        :src="product.imageUrl"
        alt="Product Image"
        v-if="product.imageUrl"
        :style="{
          width: '300px',
          height: 'auto',
        }"
      />
      <p><strong>Seller: </strong> {{ product.sellerId }}</p>
    </div>

    <!-- Display loading or error messages if necessary -->
    <p v-else-if="loading">Loading product details...</p>
    <p v-else-if="error" class="error">Error: {{ error }}</p>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { mapGetters } from "vuex";

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
    ...mapGetters(["isAuthenticated"]),
  },
  async created() {
    try {
      // Fetch product data from Firestore based on productId
      const productRef = doc(db, "items", this.productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        // Set the product data in the component state
        this.product = productSnap.data();
      } else {
        throw new Error("Product not found");
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
