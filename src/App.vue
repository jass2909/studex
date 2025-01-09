<template>
<nav class="bg-gray-800 text-white p-4 flex items-center justify-between fixed top-5 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[800px] z-10 rounded-md shadow-lg">
  <div>
      <h1
        v-if="!$route.path.includes('product') && isAuthenticated"
        class="text-lg font-semibold"
      >
        Hey, {{ user.username }}
      </h1>
      <button
        v-else-if="$route.path.includes('product')"
        class="text-lg font-semibold bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        @click="$router.go(-1)"
      >
        Go back
      </button>
    </div>

    <!-- Mobile Hamburger Menu Icon -->
    <div class="lg:hidden flex items-center">
      <button  @click="toggleMenu" class="text-white focus:outline-none transition-transform duration-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          :class="isMenuOpen ? 'rotate-90' : 'rotate-0'"
          class="w-6 h-6 transition-transform duration-300"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- Navbar Links (Desktop) -->
    <div class="hidden lg:flex items-center space-x-4">
      <router-link to="/" class="text-gray-300 hover:text-white"
        >Home</router-link
      >
      <router-link to="/about" class="text-gray-300 hover:text-white"
        >About</router-link
      >
      <router-link to="/search" class="text-gray-300 hover:text-white"
        >Search</router-link
      >

      <!-- Conditionally show login/register links if user is not authenticated -->
      <router-link
        v-if="!isAuthenticated"
        to="/login"
        class="text-gray-300 hover:text-white"
        >Login</router-link
      >
      <router-link
        v-if="!isAuthenticated"
        to="/register"
        class="text-gray-300 hover:text-white"
        >Register</router-link
      >

      <!-- Conditionally show Profile and Sell links if authenticated -->
      <router-link
        v-if="isAuthenticated"
        to="/profile"
        class="text-gray-300 hover:text-white"
        >Profile</router-link
      >
      <router-link
        v-if="isAuthenticated"
        to="/sell"
        class="text-gray-300 hover:text-white"
        >Sell</router-link
      >

      <!-- Show logout link if user is authenticated -->
      <button
        v-if="isAuthenticated"
        @click="logout"
        class="text-gray-300 hover:text-white bg-transparent border-2 border-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>

    <!-- Mobile Navbar Links -->
    <div
      v-if="isMenuOpen"
      class="lg:hidden absolute top-16 left-0 right-0 bg-gray-800 p-4 space-y-4"
    >
      <button
        v-if="$route.path.startsWith('/product/')"
        @click="goBack, (isMenuOpen = false)"
        class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
      >
        Back
      </button>
      <router-link @click="isMenuOpen = false" to="/" class="text-gray-300 hover:text-white block"
        >Home</router-link
      >
      <router-link @click="isMenuOpen = false" to="/about" class="text-gray-300 hover:text-white block"
        >About</router-link
      >
      <router-link @click="isMenuOpen = false" to="/search" class="text-gray-300 hover:text-white block"
        >Search</router-link
      >

      <!-- Conditionally show login/register links if user is not authenticated -->
      <router-link @click="isMenuOpen = false"
        v-if="!isAuthenticated"
        to="/login"
        class="text-gray-300 hover:text-white block"
        >Login</router-link
      >
      <router-link @click="isMenuOpen = false"
        v-if="!isAuthenticated"
        to="/register"
        class="text-gray-300 hover:text-white block"
        >Register</router-link
      >

      <!-- Conditionally show Profile and Sell links if authenticated -->
      <router-link @click="isMenuOpen = false"
        v-if="isAuthenticated"
        to="/profile"
        class="text-gray-300 hover:text-white block"
        >Profile</router-link
      >
      <router-link @click="isMenuOpen = false"
        v-if="isAuthenticated"
        to="/sell"
        class="text-gray-300 hover:text-white block"
        >Sell</router-link
      >

      <!-- Show logout link if user is authenticated -->
      <button 
        v-if="isAuthenticated"
        @click="logout, (isMenuOpen = false)"
        class="text-gray-300 hover:text-white bg-transparent border-2 border-white px-4 py-2 rounded-lg w-full"
      >
        Logout
      </button>
    </div>
  </nav>

  <router-view  class="mt-24"/>
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
  data() {
    return {
      isMenuOpen: false,
    };
  },
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
    goBack() {
      this.$router.go(-1);
      this.isMenuOpen = false;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>
