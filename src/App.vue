<template>
  <nav>
    <h1 v-if="isAuthenticated">Hey, {{ user }}</h1>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/search">Search</router-link> |

    <!-- Conditionally show login/register links if user is not authenticated -->
    <router-link v-if="!isAuthenticated" to="/login">Login |</router-link>
    <router-link v-if="!isAuthenticated" to="/register">Register |</router-link>

    <!-- Show logout link if user is authenticated -->
    <button v-if="isAuthenticated" @click="logout">Logout</button>
  </nav>
  <router-view />
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
<script>
export default {
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated; // This assumes you have the `isAuthenticated` getter in your Vuex store
    },
    user() {
      return this.$store.getters.getUserName; // This assumes you have the `user` getter in your Vuex store
    },
  },
  methods: {
    logout() {
      // Dispatch the logout action from your Vuex store
      this.$store.dispatch("logout");
      this.$router.push("/"); // Redirect to home page after logout
    },
  },
};
</script>
