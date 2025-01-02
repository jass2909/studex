<template>
  <nav>
    <!-- Display greeting with username if authenticated -->
    <h1 v-if="isAuthenticated">Hey, {{ user.username }}</h1>

    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/search">Search</router-link> |

    <!-- Conditionally show login/register links if user is not authenticated -->
    <router-link v-if="!isAuthenticated" to="/login">Login</router-link> |
    <router-link v-if="!isAuthenticated" to="/register">Register</router-link> |

    <!-- Conditionally show Profile and Sell links if authenticated -->
    <router-link v-if="isAuthenticated" to="/profile">Profile</router-link> |
    <router-link v-if="isAuthenticated" to="/sell">Sell</router-link> |

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
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
      getUser: "auth/getUser",
    }),
    user() {
      return this.getUser || {};
    },
  },
  methods: {
    ...mapActions({
      logout: "auth/logout",
    }),
  },
};
</script>
