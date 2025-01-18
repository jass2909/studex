<template>
  <div class="w-full ">
  <div v-if="isAuthenticated">
    <h1 class="text-4xl font-bold text-center text-gray-800 mb-6 lg:hidden">
      Welcome to Studex, {{ user.username }}
    </h1>
  </div>
  <div class="container mt-14 p-4">
    <div
      v-if="loading"
      class="text-center text-xl text-gray-500 flex justify-center items-center h-screen"
    >
      <div
        class="loader border-t-2 rounded-full border-green-500 bg-black animate-spin aspect-square w-20 flex justify-center items-center text-white"
      >
        Studex
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="border rounded-2xl shadow-md p-4 hover:shadow-lg  mt-4 bg-white"
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

          <div class="flex flex-col ">
            <span class="font-semibold text-gray-800">{{ product.name }}</span>
            <span class="text-gray-600"><strong>Price: </strong>€{{ product.price }}</span>
            <span class="text-gray-600">Condition: {{ product?.condition || "N/A" }}</span>
            <span class="text-gray-600">Location: {{ product.city }}</span>
          </div>
          <button class="mt-4">
            <router-link
              :to="`/product/${product.id}`"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-4"
            >
              View Details
            </router-link>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      products: [],
      loading: true,
    };
  },
  computed: {
    // Map products from the main store
    ...mapGetters(["allProducts"]),
    ...mapGetters({
      getUser: "auth/getUser",
    }),
    user() {
      return this.getUser || {};
    },

    products() {
      return this.allProducts;
    },

    // Explicitly access the namespaced isAuthenticated getter
    isAuthenticated() {
      return this.$store.getters["auth/isAuthenticated"];
    },
  },
  created() {
    this.fetchProducts()
      .then(() => {
        this.loading = false; // Set loading to false once products are fetched
        console.log(this.loading);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        this.loading = false; // Ensure loading is false in case of an error
      });
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

</style>
