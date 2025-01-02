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
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
  },
  actions: {
    async fetchProducts({ commit }) {
      try {
        const productsCollection = collection(db, "items");
        const snapshot = await getDocs(productsCollection);
        const productsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched products:", productsList);
        commit("setProducts", productsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
  },
  getters: {
    allProducts: (state) => state.products,
  },
});
