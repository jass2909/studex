<template>
  <div class="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">Register</h1>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div>
        <input
          type="email"
          v-model="email"
          placeholder="Email"
          required
          class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          required
          class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <input
          type="text"
          v-model="username"
          placeholder="Username"
          required
          class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>

        <input
          type="text"
          v-model="city"
          placeholder="City"
          required
          class="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <button
          type="submit"
          class="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Register
        </button>
      </div>
    </form>

    <p v-if="error" class="text-red-500 text-center mt-4">{{ error }}</p>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      email: "",
      password: "",
      username: "",
      city: "",
      error: "",
    };
  },
  methods: {
    async handleRegister() {
    try {
      await this.$store.dispatch("auth/register", {
        email: this.email,
        password: this.password,
        username: this.username,
      });
      this.$router.push("/login");
    } catch (error) {
      this.error = error.message; // Display error in the component
      console.error("Registration failed:", error);
    }
  },
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
