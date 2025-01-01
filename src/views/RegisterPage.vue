<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <input v-model="email" type="email" placeholder="Email" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
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
    ...mapActions(["register"]),
    async register() {
      try {
        await this.$store.dispatch("register", {
          email: this.email,
          password: this.password,
        });
        this.$router.push("/");
      } catch (error) {
        console.error("Register Error:", error.message);
      }
    },
  },
};
</script>
