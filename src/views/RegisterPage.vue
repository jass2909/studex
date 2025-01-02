<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="handleRegister">
      <input type="email" v-model="email" placeholder="Email" required />
      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <input type="text" v-model="username" placeholder="Username" required />
      <button type="submit">Register</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
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
      error: "",
    };
  },
  methods: {
    ...mapActions(["register"]),
    async handleRegister() {
      try {
        await this.register({
          email: this.email,
          password: this.password,
          username: this.username,
        });
        this.$router.push("/login"); // Redirect to login after successful registration
      } catch (error) {
        this.error = error.message;
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
