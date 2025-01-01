import { createStore } from "vuex";

export default createStore({
  state: {
    products: [],
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
  },
  actions: {
    fetchProducts({ commit }) {
      // Mock API call
      const sampleProducts = [
        { id: 1, name: "Bicycle", price: 50 },
        { id: 2, name: "Laptop", price: 500 },
      ];
      commit("setProducts", sampleProducts);
    },
  },
  getters: {
    allProducts: (state) => state.products,
  },
});
