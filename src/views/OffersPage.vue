<template>
  <div class="container mx-auto p-4">
    <h1 class="text-4xl font-bold text-center text-gray-800 mb-6">My Offers</h1>

    <!-- Loading indicator -->
    <div
      v-if="outgoingOffers.length === 0 && incomingOffers.length === 0"
      class="text-center text-xl text-gray-500 flex justify-center items-center h-screen"
    >
      <div
        class="loader border-t-2 rounded-full border-green-500 bg-black animate-spin aspect-square w-20 flex justify-center items-center text-white"
      >
        Studex
      </div>
    </div>

    <!-- Outgoing Offers -->
    <div v-if="outgoingOffers.length > 0" class="mb-8 animate-fade">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Outgoing Offers</h2>
      <div
        v-for="offer in outgoingOffers"
        :key="offer.id"
        class="bg-white rounded-lg shadow-lg p-4 mb-4"
      >
        <p><strong>Product:</strong> {{ offer.productName }}</p>
        <p><strong>Offer Amount:</strong> {{ offer.offerAmount }} €</p>
        <p><strong>Seller:</strong> {{ offer.sellerId }}</p>
        <p
          :class="{
            'text-red-500': offer.status === 'Declined',
            'text-green-500': offer.status === 'Accepted',
          }"
        >
          <strong>Status:</strong> {{ offer.status || "Pending" }}
        </p>
        <button
          v-if="offer.status === 'Pending'"
          class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-2"
          @click="cancelOffer(offer.id)"
        >
          Cancel Offer
        </button>
        <button
          v-if="offer.status === 'Pending'"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-2"
          @click="editOffer(offer.id)"
        >
          Edit
        </button>
        <button
          v-if="offer.status === 'Declined'"
          class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-2"
          @click="editOffer(offer.id)"
        >
          Edit Offer and Resend
        </button>
        <!-- Propose a Meetup if the offer is accepted -->
        <p v-if="offer.status === 'Accepted'" class="text-green-500 mt-4">
          <strong
            >The Seller has accepted your offer, you can now propose a
            Meetup</strong
          >
        </p>
        <button
          v-if="offer.status === 'Accepted'"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-2"
          @click="proposeMeetup(offer.id)"
        >
          Propose a Meetup
        </button>
      </div>
    </div>

    <!-- Incoming Offers -->
    <div v-if="incomingOffers.length > 0" class="mb-8 animate-fadeIn">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">Incoming Offers</h2>
      <div
        v-for="offer in incomingOffers"
        :key="offer.id"
        class="bg-white rounded-lg shadow-lg p-4 mb-4"
      >
        <p><strong>Product:</strong> {{ offer.productName }}</p>
        <p><strong>Offer Amount:</strong> ${{ offer.offerAmount }} €</p>
        <p><strong>Buyer:</strong> {{ offer.buyerId }}</p>
        <p><strong>Status:</strong> {{ offer.status || "Pending" }}</p>
        <p v-if="offer.status === 'Accepted'" class="text-green-500 mt-4">
          <strong
            >You have accepted the offer, please wait for the seller to propose
            a Meetup
          </strong>
        </p>

        <button
          v-if="offer.status === 'Pending'"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          @click="acceptOffer(offer.id)"
        >
          Accept Offer
        </button>
        <button
          v-if="offer.status === 'Pending'"
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 ml-2"
          @click="declineOffer(offer.id)"
        >
          Decline Offer
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

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
      getUser: "auth/getUser", // Assuming this provides the current user
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
        this.outgoingOffers = outgoingQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch incoming offers (where current user is the seller)
        const incomingOffersQuery = query(
          collection(db, "offers"),
          where("sellerId", "==", this.getUser.username)
        );
        const incomingQuerySnapshot = await getDocs(incomingOffersQuery);
        this.incomingOffers = incomingQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching offers:", error);
        alert("Error fetching offers. Please try again later.");
      } finally {
        this.loading = false;
      }
    },
    async acceptOffer(offerId) {
      try {
        const offerRef = doc(db, "offers", offerId);
        await updateDoc(offerRef, { status: "Accepted" });
        this.fetchOffers();
      } catch (error) {
        console.error("Error accepting offer:", error);
        alert("Error accepting offer. Please try again later.");
      }
    },
    async declineOffer(offerId) {
      try {
        const offerRef = doc(db, "offers", offerId);
        await updateDoc(offerRef, { status: "Declined" });
        this.fetchOffers();
      } catch (error) {
        console.error("Error declining offer:", error);
        alert("Error declining offer. Please try again later.");
      }
    },
    async cancelOffer(offerId) {
      try {
        const offerRef = doc(db, "offers", offerId);
        await deleteDoc(offerRef);
        this.fetchOffers();
      } catch (error) {
        console.error("Error cancelling offer:", error);
        alert("Error cancelling offer. Please try again later.");
      }
    },
    async editOffer(offerId) {
      const newOfferAmount = prompt("Enter the new offer amount:");
      if (
        !newOfferAmount ||
        isNaN(newOfferAmount) ||
        parseFloat(newOfferAmount) <= 0
      ) {
        alert("Invalid offer amount. Please enter a Valid number.");
        return;
      }
      try {
        const offerRef = doc(db, "offers", offerId);
        await updateDoc(offerRef, {
          status: "Pending",
          offerAmount: parseFloat(newOfferAmount),
        });
        alert("Offer edited successfully.");
        this.fetchOffers();
      } catch (error) {
        console.error("Error editing offer:", error);
        alert("Error editing offer. Please try again later.");
      }
    },
    async proposeMeetup(offerId) {
      try {
        const offerRef = doc(db, "offers", offerId);
        await updateDoc(offerRef, { status: "Accepted" });
        this.fetchOffers();
      } catch (error) {
        console.error("Error accepting offer:", error);
        alert("Error accepting offer. Please try again later.");
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
