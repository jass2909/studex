import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";

const app = createApp(App);

// Ensure this action is correctly dispatched
store
  .dispatch("auth/initializeAuth")
  .then(() => {
    app.use(store).use(router).mount("#app");
  })
  .catch((error) => {
    console.error("Failed to initialize authentication:", error);
  });
