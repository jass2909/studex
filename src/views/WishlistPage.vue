<template>
  <div>
    <div class="text-4xl font-bold text-center text-gray-800 mb-6">
      <h1>My Wishlist</h1>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="product in wishlist" :key="product.id" class="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between">
        <router-link :to="`/product/${product.id}`" class="flex-grow">
          <div class="mb-4">
            <img :src="product.imageUrl" alt="Product Image" class="w-full h-64 object-contain rounded-md" />
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-gray-800 mb-2">{{ product.name }}</span>
            <span class="text-gray-600 mb-2">€{{ product.price }}</span>
            <span class="text-gray-600">Location: {{ product.city }}, {{ product.postalCode }}</span>
          </div>
        </router-link>
        <button class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 mt-4" @click="removeFromWishlist(product.id)">
          Remove from Wishlist
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import { collection, getDocs, query, where, writeBatch } from "firebase/firestore";

export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      wishlist: [],
    };
  },
  async created() {
    await this.fetchWishlist();
  },
  methods: {
    async fetchWishlist() {
      try {
        const q = query(collection(db, "wishlist"), where("userId", "==", this.user.username));
        const snapshot = await getDocs(q);
        this.wishlist = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    },
    async removeFromWishlist(productId) {
      try {
        const q = query(collection(db, "wishlist"), where("id", "==", productId), where("userId", "==", this.user.username));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        await this.fetchWishlist();
      } catch (error) {
        console.error("Error removing from wishlist:", error);
      }
    },
  },
};
</script>