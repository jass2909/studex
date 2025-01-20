<template>
  <div class="container mx-auto p-4 flex justify-center">
    <div class="flex flex-col md:flex-row justify-between">
      <!-- Outgoing Offers -->
      <div v-if="outgoingOffers.length > 0" class="mb-8 mx-6">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">
          Outgoing Offers
        </h2>
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
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-2"
            @click="editOffer(offer.id)"
          >
            Edit
          </button>
          <p
            v-if="offer.status === 'Offer Declined by Seller'"
            class="text-red-500 mt-4"
          >
            The seller has declined your offer, you may edit or decline the
            offer.
          </p>
          <button
            v-if="offer.status === 'Offer Declined by Seller'"
            class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-2"
            @click="editOffer(offer.id)"
          >
            Edit Offer and Resend
          </button>
          <div v-if="offer.status === 'Proposal Accepted by Seller'">
            <p class="text-green-500 mt-4">
              The seller has accepted your proposal, please meetup with the
              seller at the designated location and time. <br />
              Meetup-name: {{ offer.meetupPlace.name }}, <br> Time:
              {{ formatMeetupDateTime(offer.meetUpDateAndTime) }}
            </p>
            <div class="flex">
              <button
                @click="openInMaps(offer.meetupPlace.coordinates)"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded mt-4"
              >
                View in Maps
              </button>
             
            </div>
          </div>

          <!-- Propose a Meetup if the offer is accepted -->
          <p v-if="offer.status === 'Accepted'" class="text-green-500 mt-4">
            <strong
              >The Seller has accepted your offer, you can now propose a
              Meetup</strong
            >
          </p>
          <p
            v-if="offer.status === 'Meetup Proposed'"
            class="text-yellow-500 mt-4'"
          >
            <strong
              >Meetup has been proposed, waiting for the seller to
              accept</strong
            >
          </p>
          <button
            class="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-2"
            @click="cancelOffer(offer.id, offer.sellerId)"
          >
            Cancel Offer
          </button>
          <button
            v-if="offer.status === 'Accepted'"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-2"
            @click="(MeetupId = offer.id), (showMeetupPlaceModal = true)"
          >
            Propose a Meetup
          </button>
        </div>
        <div
          v-if="showMeetupPlaceModal"
          class="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
          >
            <div
              class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              @click="showMeetupPlaceModal = false"
            ></div>

            <span
              class="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
              >&#8203;</span
            >

            <div
              class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div
                    class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10"
                  >
                    <svg
                      class="h-6 w-6 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      class="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Select a Meetup Place
                    </h3>
                    <div v-if="showDistrictModal">
                      <label for="districtPlace">Select your District </label>
                      <select v-model="selectedDistrict" id="districtPlace" class="w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option v-for="place in districtPlaces" :key="place" :value="place">
                          {{ place.name }}
                        </option>
                      </select>
                    </div>
                    <div class="mt-2">
                      <select
                        v-model="selectedMeetupPlace"
                        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option
                          v-for="place in meetupPlacesFinal"
                          :key="place.id"
                          :value="place"
                        >
                          {{ place }}
                        </option>
                      </select>
                    </div>
                    <div class="mt-2">
                      <input
                        type="datetime-local"
                        v-model="selectedMeetupDateTime"
                        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
              >
                <button
                  type="button"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="
                    updateOfferWithMeetupPlace(
                      MeetupId,
                      selectedMeetupPlace,
                      selectedMeetupDateTime
                    )
                  "
                >
                  Propose Meetup
                </button>
                <button v-if="showDistrictModal"
                    type="button"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    @click="confirmDistrict"
                >
                  Sort Meetup Places
                </button>
                <button
                  type="button"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="showMeetupPlaceModal = false"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Incoming Offers -->
      <div v-if="incomingOffers.length > 0" class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">
          Incoming Offers
        </h2>
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
              >You have accepted the offer, please wait for the seller to
              propose a Meetup
            </strong>
          </p>
          <p
            v-if="offer.status === 'Meetup Proposed'"
            class="text-yellow-500 mt-4"
          >
            <strong
              >The seller has proposed a Meetup, please review the details.
            </strong>
            <br />
            <strong>Meetup Place:</strong> {{ offer.meetupPlace.name }} <br />
            <strong>Meetup Date & Time:</strong>
            {{ formatMeetupDateTime(offer.meetUpDateAndTime) }} <br />
            <strong
              >If this Meet-Up proposal is not suitable for you, please decline
              the offer.</strong
            >
          </p>
          <div v-if="offer.status === 'Proposal Accepted by Seller'">
            <p class="text-green-500 mt-4">
              You have accepted the proposal, please meetup with the
              buyer at the designated location and time. <br />
              Meetup-name: {{ offer.meetupPlace.name }}, <br> Time:
              {{ formatMeetupDateTime(offer.meetUpDateAndTime) }}
            </p>
            <div class="flex">
              <button
                @click="openInMaps(offer.meetupPlace.coordinates)"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded mt-4"
              >
                View in Maps
              </button>
             
            </div>
          </div>
          <div class="flex justify-center items-center">
            <button
              v-if="offer.status === 'Meetup Proposed'"
              @click="openInMaps(offer.meetupPlace.coordinates)"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-4"
            >
              View in Maps
            </button>
            <button
              v-if="offer.status === 'Meetup Proposed'"
              @click="acceptProposal(offer.id, 'Proposal Accepted by Seller')"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-4"
            >
              Accept Porposal
            </button>
            <button
              v-if="offer.status === 'Meetup Proposed'"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
              @click="declineOffer(offer.id, 'Proposal Declined by Seller')"
            >
              Decline Porposal
            </button>
          </div>

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
            @click="declineOffer(offer.id, 'Offer Declined by Seller')"
          >
            Decline Offer
          </button>
        </div>
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
import meetupPlaces from "@/data/meetup-places.json";
import districtPlaces from "@/data/district-places.json";

import { sendPushNotification } from "../notify";
import { getSellerFCMToken } from "../utils/firebaseUtils";
import dayjs from "dayjs";
import "dayjs/locale/en";
import Swal from "sweetalert2";
import {getOptimalMeetupPlace} from "@/utils/places";
export default {
  data() {
    return {
      outgoingOffers: [],
      incomingOffers: [],
      loading: true,
      sellerFCMToken: null,
      showMeetupPlaceModal: false,
      selectedMeetupPlace: null,
      selectedMeetupDateTime: null,
      meetupPlaces: meetupPlaces,
      meetupPlacesFinal: [],
      districtPlaces: districtPlaces,
      selectedDistrict: null,
      showDistrictModal: true,
      MeetupId: null,
      productPostalCode: null,
    };
  },
  mounted() {},
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
    confirmDistrict() {
      // Logic to handle the selected meetup place
      this.showDistrictModal = false;
      if (!this.showDistrictModal) {
        this.getSortedMeetupPlaces();
      }
    },
    getSortedMeetupPlaces() {
      // Logic to sort the meetup places based on the selected district
      console.log("Offers", this.incomingOffers);
      this.meetupPlacesFinal = getOptimalMeetupPlace(this.selectedDistrict.name);

    },
    formatMeetupDateTime(dateTimeString) {
      const dateTime = dayjs(dateTimeString);
      return `${dateTime.locale("en").format("dddd, MMMM D, YYYY - h:mm A")}`;
    },
    async fetchSellerToken(sellerId) {
      this.sellerFCMToken = await getSellerFCMToken(sellerId);
      if (this.sellerFCMToken) {
        console.log("Seller FCM Token:", this.sellerFCMToken);
      } else {
        console.warn("Seller FCM Token not found.");
      }
    },
    openInMaps(coordinates) {
      const { lat, lng } = coordinates;
      // Construct a Google Maps URL
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
      // Open the URL in a new tab or window
      window.open(googleMapsUrl, "_blank");
    },

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
        if (this.incomingOffers.length === 0) {
          this.loading = false;
        }
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
    async declineOffer(offerId, status) {
      try {
        const offerRef = doc(db, "offers", offerId);
        await updateDoc(offerRef, { status: status });
        this.fetchOffers();
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Offer declined successfully",
          showConfirmButton: true,
          timer: 2000,
        });
      } catch (error) {
        console.error("Error declining offer:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error declining offer. Please try again later.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
    async cancelOffer(offerId, sellerId) {
      try {
        const offerRef = doc(db, "offers", offerId);
        await deleteDoc(offerRef);
        this.sellerFCMToken = await getSellerFCMToken(sellerId);
        sendPushNotification(
            this.sellerFCMToken,
            "Offer Cancelled",
            "The Buyer has cancelled the offer"
        );
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Offer cancelled successfully",
          showConfirmButton: true,
          timer: 2000,
        });
        this.fetchOffers();
      } catch (error) {
        console.error("Error cancelling offer:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error cancelling offer. Please try again later.",
          showConfirmButton: false,
          timer: 1500,
        });
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
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Offer updated successfully",
          showConfirmButton: true,
          timer: 2000,
        });
        this.fetchOffers();
      } catch (error) {
        console.error("Error editing offer:", error);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error updating offer. Please try again later.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
    
    async proposeMeetup(offerId) {
      try {
        // Show the meetup place selection modal
        await this.showMeetupPlaceSelector(offerId);
      } catch (error) {
        console.error("Error proposing meetup:", error);
        alert("Error proposing meetup. Please try again later.");
      }
    },

    async updateOfferWithMeetupPlace(
      offerId,
      meetupPlace,
      selectedMeetupDateTime
    ) {
      try {
        const offerRef = doc(db, "offers", offerId);
        await updateDoc(offerRef, {
          status: "Meetup Proposed",
          meetupPlace: meetupPlace,
          meetUpDateAndTime: selectedMeetupDateTime,
        });
        console.log("Offer with meetup place updated successfully.");
        this.showMeetupPlaceModal = false;
        this.fetchOffers();
      } catch (error) {
        console.error("Error updating offer with meetup place:", error);
        alert("Error updating offer. Please try again later.");
      }
    },
    async acceptProposal(offerId, status) {
      try {
        const offerRef = doc(db, "offers", offerId);
        await updateDoc(offerRef, { status: status });
        this.fetchOffers();
      } catch (error) {
        console.error("Error accepting proposal:", error);
        alert("Error accepting proposal. Please try again later.");
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
