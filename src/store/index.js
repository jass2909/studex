import { createStore } from "vuex";
import auth from "./auth";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export default createStore({
  modules: {
    auth, // Authentication module
  },
  state: {
    products: [],
    productsFetched: false, // Flag to track if products are already fetched
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    setProductsFetched(state, status) {
      state.productsFetched = status;
    },
    setProductsByUserName(state, { username, products }) {
      state.productsByUserName = state.productsByUserName || {};
      state.productsByUserName[username] = products;
    },
    removeProduct(state, productId) {
      state.products = state.products.filter(product => product.id !== productId);
      for (const username in state.productsByUserName) {
        state.productsByUserName[username] = state.productsByUserName[username].filter(product => product.id !== productId);
      }
      state.productsFetched = false; // Set productsFetched to false after deleting a product
    },
  },
  actions: {
    async fetchProducts({ state, commit }) {
      // If products are already fetched, don't fetch again
      if (state.productsFetched) {
        console.log("Using cached products");
        return;
      }

      try {
        const productsCollection = collection(db, "items");
        const snapshot = await getDocs(productsCollection);
        const productsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched products:", productsList);

        // Cache the products in Vuex state
        commit("setProducts", productsList);
        commit("setProductsFetched", true); // Mark products as fetched
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
  },
  getters: {
    allProducts: (state) => state.products,
    getProductById: (state) => (id) =>
      state.products.find((product) => product.id === id),
    getProductsByUserName: (state) => (username) =>
      state.productsByUserName?.[username] || [],
  },
});