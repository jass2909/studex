<template>
    <div class="container mx-auto p-4">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-6">
        My Offers
      </h1>
  
      <!-- Loading indicator -->
      <div v-if="outgoingOffers.length === 0 && incomingOffers.length === 0" class="text-center text-xl text-gray-500 flex justify-center items-center h-screen">
<button
  disabled=""
  class="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center transition duration-300 transform hover:scale-105 active:scale-95"
>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="animate-spin h-5 w-5 mr-3 text-white"
  >
    <circle
      stroke-width="4"
      stroke="currentColor"
      r="10"
      cy="12"
      cx="12"
      class="opacity-25"
    ></circle>
    <path
      d="M4 12a8 8 0 018-8v8H4z"
      fill="currentColor"
      class="opacity-75"
    ></path>
  </svg>
  Loading...
</button>

      </div>
  
      <!-- Outgoing Offers -->
      <div v-if="outgoingOffers.length > 0" class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Outgoing Offers</h2>
        <div v-for="offer in outgoingOffers" :key="offer.id" class="bg-white rounded-lg shadow-lg p-4 mb-4">
          <p><strong>Product:</strong> {{ offer.productName }}</p>
          <p><strong>Offer Amount:</strong>  {{ offer.offerAmount }} €</p>
          <p><strong>Seller:</strong> {{ offer.sellerId }}</p>
          <p><strong>Status:</strong> {{ offer.status || "Pending" }}</p>
        </div>
      </div>
  
      <!-- Incoming Offers -->
      <div v-if="incomingOffers.length > 0" class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Incoming Offers</h2>
        <div v-for="offer in incomingOffers" :key="offer.id" class="bg-white rounded-lg shadow-lg p-4 mb-4">
          <p><strong>Product:</strong> {{ offer.productName }}</p>
          <p><strong>Offer Amount:</strong> ${{ offer.offerAmount }} €</p>
          <p><strong>Buyer:</strong> {{ offer.buyerId }}</p>
          <p><strong>Status:</strong> {{ offer.status || "Pending" }}</p>
          <button v-if="offer.status === 'Pending'" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" @click="acceptOffer(offer.id)">Accept Offer</button>
          <button v-if="offer.status === 'Pending'" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 ml-2" @click="declineOffer(offer.id)">Decline Offer</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from "vuex";
  import { db } from "../firebase";
  import { collection, query, where, getDocs } from "firebase/firestore";
  
  export default {
    data() {
      return {
        outgoingOffers: [],
        incomingOffers: [],
        loading: true,
      };
    },
    computed: {
      ...mapGetters({
        getUser: "auth/getUser",  // Assuming this provides the current user
      }),
    },
    watch: {
      // Watch for changes in user data
      getUser: "fetchOffers",
    },
    methods: {
      async fetchOffers() {
        // If user is not logged in, exit early
        if (!this.getUser) {
          this.loading = false;
          return;
        }
  
        try {
          // Fetch outgoing offers (where current user is the buyer)
          const outgoingOffersQuery = query(
            collection(db, "offers"),
            where("buyerId", "==", this.getUser.username)
          );
          const outgoingQuerySnapshot = await getDocs(outgoingOffersQuery);
          this.outgoingOffers = outgoingQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
          // Fetch incoming offers (where current user is the seller)
          const incomingOffersQuery = query(
            collection(db, "offers"),
            where("sellerId", "==", this.getUser.username)
          );
          const incomingQuerySnapshot = await getDocs(incomingOffersQuery);
          this.incomingOffers = incomingQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
        } catch (error) {
          console.error("Error fetching offers:", error);
          alert("Error fetching offers. Please try again later.");
        } finally {
          this.loading = false;
        }
      },
    },
    async created() {
      // Call fetchOffers method initially to check if the user is already available
      this.fetchOffers();
    },
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  </style>