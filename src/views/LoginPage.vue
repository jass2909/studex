<template>
  <div class="max-w-md mx-auto p-4 mt-10 bg-white rounded-lg shadow-md">
    <h1 class="text-3xl font-bold mb-4">Login</h1>
    <form @submit.prevent="handleLogin" class="space-y-4">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
        class="block w-full p-2 text-lg border border-gray-300 rounded-lg"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        class="block w-full p-2 text-lg border border-gray-300 rounded-lg"
      />
      <button
        type="submit"
        class="w-full p-2 text-lg font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700"
      >
        Login
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    ...mapActions("auth", ["login"]), // Correct namespace ('auth')
    async handleLogin() {
      try {
        await this.login({
          email: this.email,
          password: this.password,
        });
        this.$router.push("/");
      } catch (error) {
        console.error("Login Error:", error.message);
        alert("Login failed: " + error.message);
      }
    },
  },
};
</script>
