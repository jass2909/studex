<template>

<nav
    class="bg-gray-800 text-white p-4 flex items-center justify-between fixed top-5 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[800px] z-10 rounded-md shadow-lg hidden lg:flex">
    <div>
      <h1 v-if="!$route.path.includes('product') && isAuthenticated" class="text-lg font-semibold">
        Hey, {{ user.username }}
      </h1>
      <button v-else-if="$route.path.includes('product')"
        class="text-lg font-semibold bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        @click="$router.go(-1)">
        Go back
      </button>
    </div>

    <!-- Navbar Links (Desktop) -->
    <div class="flex items-center space-x-4">
      <router-link to="/" class="text-gray-300 hover:text-white">Home</router-link>
      <router-link to="/search" class="text-gray-300 hover:text-white">Search</router-link>

      <!-- Conditionally show login/register links if user is not authenticated -->
      <router-link v-if="!isAuthenticated" to="/login" class="text-gray-300 hover:text-white">Login</router-link>
      <router-link v-if="!isAuthenticated" to="/register" class="text-gray-300 hover:text-white">Register</router-link>

      <!-- Conditionally show Profile and Sell links if authenticated -->

      <router-link v-if="isAuthenticated" to="/sell" class="text-gray-300 hover:text-white">Sell</router-link>
      
      <div>
        <router-link v-if="isAuthenticated" :to="{ name: 'profile', params: { uid: user.uid } }"
          class="text-gray-300 hover:text-white">My Profile</router-link>
      </div>

      <!-- Show logout link if user is authenticated -->
      <button v-if="isAuthenticated" @click="logout"
        class="text-gray-300 hover:text-white bg-transparent border-2 border-white px-4 py-2 rounded-lg">
        Logout
      </button>

    </div>
</nav>
  <!-- Mobile navbar at the bottom -->
  <nav class="bg-gray-800 text-white p-4 flex items-center justify-around fixed bottom-0 left-0 right-0 z-10 lg:hidden">
    <router-link to="/" class="text-gray-300 hover:text-white">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
      
    </router-link>

    <router-link to="/search" class="text-gray-300 hover:text-white">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      
    </router-link>

    <router-link v-if="isAuthenticated" to="/sell" class="text-gray-300 hover:text-white">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      
    </router-link>

    <router-link v-if="isAuthenticated" :to="{ name: 'profile', params: { uid: user.uid } }"
      class="text-gray-300 hover:text-white">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      
    </router-link>
  </nav>
  <NotificationPopUp ref="notificationPopUp" />
  <div class="container mx-auto p-4">
    <RouterView class="mt-0 md:mt-24" />
</div>

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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

<script>
import { RouterView } from "vue-router";
import { mapGetters, mapActions } from "vuex";
import NotificationPopUp from "./views/NotificationPopUp.vue";
import { messaging } from "./firebase";
import { onMessage } from "./firebase";

export default {
  data() {
    return {
      isMenuOpen: false,
    };
  },
  components: {
    RouterView,
    NotificationPopUp,
  },
  mounted() {
    this.initializeFCM();
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
    async logout() {
      try {
        await this.$store.dispatch("auth/logout");
        this.$router.push("/login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    },
    initializeFCM() {
      // Listen for foreground messages
      onMessage(messaging, (payload) => {
        console.log("Message received:", payload);
        console.log("Complete payload:", payload);

        // Access the Notification component and show the notification
        this.$refs.notificationPopUp.showNotification(
          payload.notification.title,
          payload.notification.body
        );
      });
    },
  },
};
</script>
