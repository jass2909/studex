import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export default {
  state: {
    user: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  actions: {
    async register({ commit }, { email, password }) {
      await createUserWithEmailAndPassword(auth, email, password);
      commit("setUser", auth.currentUser);
    },
    async login({ commit }, { email, password }) {
      await signInWithEmailAndPassword(auth, email, password);
      commit("setUser", auth.currentUser);
    },
    async logout({ commit }) {
      await signOut(auth);
      commit("clearUser");
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
    getUser(state) {
      return state.user;
    },
    getUserName(state) {
      return state.user ? state.user.email : null;
    },
  },
};
