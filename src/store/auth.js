import { auth, db } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default {
  namespaced: true,
  state: {
    user: null,
    fcmToken: null,
  },

  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = null;
    },
    setFCMToken(state, token) {
      state.fcmToken = token;
    },
  },
  actions: {
    async initializeAuth({ commit }) {
      // Listen for auth state changes
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              commit("setUser", {
                uid: user.uid,
                email: user.email,
                username: userData.username,
              });
            }
          } catch (error) {
            console.error("Failed to fetch user data:", error);
          }
        } else {
          commit("clearUser");
        }
      });
    },
    async register({ commit }, { email, password, username }) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
    
        await setDoc(doc(db, "users", user.uid), {
          name: username,
          email: user.email,
          createdAt: new Date().toISOString(),
          username: username,
        });
    
        commit("setUser", { uid: user.uid, email: user.email, username });
      } catch (error) {
        console.error("Registration failed:", error);
        throw new Error(error.message); // Re-throw the error to handle it in the component
      }
    },
    async login({ commit }, { email, password }) {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      commit("setUser", {
        uid: user.uid,
        email: user.email,
        username: userData.username,
      });
    },
    async logout({ commit }) {
      await signOut(auth);
      commit("clearUser");
      
    },
    setFCMToken({ commit }, token) {
      commit("setFCMToken", token);
    }
  }, 
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
    getUser(state) {
      return state.user;
    },
    getUserName(state) {
      return state.user ? state.user.username : null;
    },
    getFCMToken(state) {
      return state.fcmToken;
    },
  },
};
