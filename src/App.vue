<template>
  <nav
    class="bg-gray-800 text-white p-4 flex items-center justify-between fixed top-5 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[800px] z-10 rounded-2xl shadow-lg hidden md:flex">
    <div>
      <h1 v-if="!$route.path.includes('product') && isAuthenticated" class="text-lg font-semibold">
        Hey, {{ user.username }}
      </h1>
      <button v-else-if="$route.path.includes('product')"
        class="text-lg font-semibold bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600"
        @click="$router.go(-1)">
        Go back
      </button>
    </div>


    <div class="flex items-center space-x-4">
      <NotificationPopUp ref="notificationPopUp" />

      <router-link to="/" class="text-gray-300 hover:text-white">Home</router-link>
      <router-link to="/search" class="text-gray-300 hover:text-white">Search</router-link>

      <router-link v-if="!isAuthenticated" to="/login" class="text-gray-300 hover:text-white">Login</router-link>
      <router-link v-if="!isAuthenticated" to="/register" class="text-gray-300 hover:text-white">Register</router-link>


      <router-link v-if="isAuthenticated" to="/sell" class="text-gray-300 hover:text-white">Sell</router-link>

      <div>
        <router-link v-if="isAuthenticated" :to="{ name: 'profile', params: { uid: user.uid } }"
          class="text-gray-300 hover:text-white">My Profile</router-link>
      </div>

      <button v-if="isAuthenticated" @click="logout"
        class="text-gray-300 hover:text-white bg-transparent border-2 border-white px-4 py-2 rounded-lg">
        Logout
      </button>
    </div>
  </nav>

  <nav class="bg-gray-800 text-white p-4 flex items-center justify-around fixed bottom-0 left-0 right-0 z-10 md:hidden">
    <router-link to="/" class="text-gray-300 hover:text-white">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    </router-link>

    <router-link to="/search" class="text-gray-300 hover:text-white">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
        <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
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

  <div class="container mx-auto p-4 flex justify-center  md:mt-20 ">

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <KeepAlive>
          <component :is="Component" :key="$route.path" />
        </KeepAlive>
      </transition>
    </router-view>
  </div>
</template>

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
    triggerNotification() {
      this.$refs.notificationPopUp.showNotification(
        "Hello!",
        "This is a test notification."
      );
    },
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
<style lang="scss" scoped>
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


    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  /* .fade-leave-active in <2.1.8 */
  opacity: 0;
}

</style>
