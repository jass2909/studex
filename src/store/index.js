import { createStore } from "vuex";
import auth from "./auth";
import { db } from "@/firebase"; // Import Firestore from your firebase.js file
import { collection, getDocs } from "firebase/firestore";

export default createStore({
  state: {
    products: [],
  },
  modules: {
    auth,
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
  },
  actions: {
    async fetchProducts({ commit }) {
      try {
        const productsCollection = collection(db, "items"); // Reference to the 'products' collection in Firestore
        const snapshot = await getDocs(productsCollection); // Get all documents in the 'products' collection
        const productsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })); // Map documents to an array of product objects
        console.log("Fetched products:", productsList);
        commit("setProducts", productsList); // Commit the products to the state
      } catch (error) {
        console.error("Error fetching products:", error); // Handle any errors
      }
    },
  },
  getters: {
    allProducts: (state) => state.products,
  },
});
