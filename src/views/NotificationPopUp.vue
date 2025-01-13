<template>
    <transition name="fade">
      <div v-if="visible" class="z-[999] fixed top-4 left-1/2 transform -translate-x-1/2 w-96 bg-blue-500 text-white p-4 rounded-lg shadow-lg">
        <div class="flex justify-between items-center">
          <div class="font-semibold">{{ title }}</div>
          <button @click="closeNotification" class="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
              <path fill-rule="evenodd" d="M10 9.293l4.707-4.707a1 1 0 011.414 1.414L11.414 10l4.707 4.707a1 1 0 01-1.414 1.414L10 11.414l-4.707 4.707a1 1 0 01-1.414-1.414L8.586 10 3.879 5.293a1 1 0 111.414-1.414L10 9.293z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <div class="mt-2 text-sm">{{ body }}</div>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    data() {
      return {
        visible: false,
        title: '',
        body: '',
        timer: null,
      };
    },
    methods: {
      showNotification(title, body) {
        this.title = title;
        this.body = body;
        this.visible = true;
  
        // Auto-hide after 5 seconds
        this.timer = setTimeout(() => {
          this.visible = false;
        }, 5000);
      },
      closeNotification() {
        this.visible = false;
        clearTimeout(this.timer);
      },
    },
  };
  </script>
  
  <style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }
  </style>