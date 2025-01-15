<template>
  <div class="container mx-auto p-4">
    <!-- Product Title -->
    <h1 class="text-4xl font-bold text-center text-gray-800 mb-6">
      Product Details
    </h1>
    <!-- Message Container -->
    <div
      v-if="showMessage"
      class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-4 rounded-lg shadow-lg"
      :class="{
        'bg-green-500': messageType === 'success',
        'bg-red-500': messageType === 'error',
      }"
    >
      {{ message }}
    </div>

    <!-- Show product details once they are fetched -->
    <div v-if="product" class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <!-- Use a flex container for layout -->
      <div class="flex flex-col md:flex-row items-center md:items-start">
        <!-- Text section (left side) -->
        <div class="md:w-2/3">
          <h2 class="text-3xl font-semibold text-gray-900 mb-4">
            {{ product.name }}
          </h2>
          <p class="text-lg text-gray-700 mb-4">
            <strong>Description:</strong> {{ product.description }}
          </p>
          <p class="text-lg text-gray-700">
            <strong>Seller:</strong> {{ product.sellerId }}
          </p>
          <p class="text-lg text-gray-700">
            <strong>Price:</strong> {{ product.price }} €
          </p>
          <!-- Make an offer button only if user is logged in and not the seller -->
          <button
            v-if="getUser && getUser.username !== product.sellerId"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            @click="openOfferModal"
          >
            Make an Offer
          </button>
        </div>

        <!-- Image section (right side) -->
        <div v-if="product.imageUrl" class="md:w-1/3 mb-4 md:mb-0 md:ml-6">
          <img
            :src="product.imageUrl"
            alt="Product Image"
            class="w-full max-w-xs mx-auto rounded-lg"
          />
        </div>
      </div>
    </div>
    <!-- Modal for entering offer amount -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
    >
      <div
        class="bg-white p-6 rounded-lg w-full max-w-xs md:max-w-md lg:max-w-lg mx-4"
      >
        <h2 class="text-2xl mb-4 text-center md:text-left">
          Enter Your Offer Amount
        </h2>
        <input
          v-model="offerAmount"
          type="number"
          min="1"
          step="0.01"
          placeholder="Enter amount"
          class="border border-gray-300 rounded-lg w-full p-2 mb-4"
        />
        <div class="flex justify-between">
          <button
            class="bg-gray-500 text-white py-2 px-4 rounded-lg w-full md:w-auto md:mr-2"
            @click="closeModal"
          >
            Cancel
          </button>
          <button
            class="bg-blue-500 text-white py-2 px-4 rounded-lg w-full md:w-auto md:ml-2"
            @click="makeOffer"
          >
            <p v-if="loadingOffer">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 animate-spin"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M12 1V5"
                    stroke="#33495d"
                    stroke-width="1.7"
                    stroke-linecap="round"
                  ></path>
                  <path
                    d="M19.4246 18.9246L16.5961 16.0962"
                    stroke="#1C1C1C"
                    stroke-width="1.7"
                    stroke-linecap="round"
                  ></path>
                  <path
                    d="M22.5 11.5L18.5 11.5"
                    stroke="#1C1C1C"
                    stroke-width="1.7"
                    stroke-linecap="round"
                  ></path>
                  <path
                    d="M12 18V22"
                    stroke="#1C1C1C"
                    stroke-width="1.7"
                    stroke-linecap="round"
                  ></path>
                  <path
                    d="M7.40381 6.90381L4.57538 4.07538"
                    stroke="#1C1C1C"
                    stroke-width="1.7"
                    stroke-linecap="round"
                  ></path>
                  <path
                    d="M5.5 11.5L1.5 11.5"
                    stroke="#1C1C1C"
                    stroke-width="1.7"
                    stroke-linecap="round"
                  ></path>
                  <path
                    d="M7.40381 16.0962L4.57538 18.9246"
                    stroke="#1C1C1C"
                    stroke-width="1.7"
                    stroke-linecap="round"
                  ></path>
                </g>
              </svg>
            </p>
            <p v-else>Make Offer</p>
          </button>
        </div>
 
      </div>
    </div>
    <button
      v-if="$route.path.includes('product')"
      class="text-lg font-semibold bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 fixed bottom-20 right-4 md:hidden"
      @click="$router.go(-1)"
    >
      Go back
    </button>

    <!-- Display loading or error messages if necessary -->
    <p v-else-if="loading" class="text-center text-xl text-gray-500">
      Loading product details...
    </p>
    <p v-else-if="error" class="text-center text-xl text-red-500">
      Error: {{ error }}
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { sendPushNotification } from "@/notify";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { getSellerFCMToken } from "@/utils/firebaseUtils";

export default {
  data() {
    return {
      product: null,
      loading: true,
      error: null,
      productId: this.$route.params.id, // Get product ID from route params
      showMessage: false,
      messageType: "success",
      message: "",
      showModal: false,
      offerAmount: null,
      sellerFCMToken: null,
      loadingOffer: false,
    };
  },
  mounted() {},
  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
      getUser: "auth/getUser",
      getProductById: "getProductById",
    }),
    // Check if the current route is a product detail page
    isProductPage() {
      return this.$route.name === "product-detail"; // Adjust this name according to your route name
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1); // Go back to the previous page
    },
    openOfferModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.offerAmount = null;
    },
    triggerMessage(type, message) {
      this.showMessage = true;
      this.messageType = type;
      this.message = message;
      setTimeout(() => {
        this.showMessage = false;
      }, 3000);
    },
    async fetchSellerToken() {
      const sellerId = this.product.sellerId; // Replace with your actual sellerId
      this.sellerFCMToken = await getSellerFCMToken(sellerId);
      if (this.sellerFCMToken) {
        console.log("Seller FCM Token:", this.sellerFCMToken);
      } else {
        console.warn("Seller FCM Token not found.");
      }
    },
    async makeOffer() {
      this.loading = true;
      this.loadingOffer = true;
      if (!this.isAuthenticated) {
        this.triggerMessage("error", "You must be logged in to make an offer.");
        this.closeModal();
        return;
      } // Check if user has already made an Offer

      try {
        const offerRef = query(
          collection(db, "offers"),
          where("productId", "==", this.productId),
          where("buyerId", "==", this.getUser.username)
        );
        const offerSnap = await getDocs(offerRef);
        if (!offerSnap.empty) {
          this.triggerMessage(
            "error",
            "You have already made an offer, please go to the offers page to edit or cancel it."
          );
          this.closeModal();
          this.loadingOffer = false;
          this.loading = false;
          return;
        }
      } catch (error) {
        console.error("Error checking if offer exists:", error);
        this.triggerMessage(
          "error",
          "Error checking if offer exists. Please try again later."
        );
        this.closeModal();
        this.loading = false;
        this.loadingOffer = false;
        return;
      }

      const offerDetails = this.offerAmount;
      if (
        !offerDetails ||
        isNaN(offerDetails) ||
        parseFloat(offerDetails) <= 0
      ) {
        this.triggerMessage("error", "Invalid offer amount. Please try again.");
        return;
      }
      if (!this.getUser) {
        this.triggerMessage("error", "You must be logged in to make an offer.");
        return;
      }

      try {
        const userId = this.getUser.username;
        const offerData = {
          productId: this.productId,
          productName: this.product.name,
          offerAmount: parseFloat(offerDetails),
          sellerId: this.product.sellerId,
          buyerId: userId,
          createdAt: new Date(),
          status: "Pending",
        };
  
        await addDoc(collection(db, "offers"), offerData);
        this.loading = false;
        this.loadingOffer = false;
        this.triggerMessage("success", "Offer placed successfully!");
        this.closeModal();
        this.sellerFCMToken = await getSellerFCMToken(this.product.sellerId);
        await sendPushNotification(
          this.sellerFCMToken,
          `You have a new offer for your product!`,
          `${this.getUser.username} has made an offer for your product "${this.product.name}".`
        );
      } catch (error) {
        console.error("Error placing offer:", error);
        this.triggerMessage(
          "error",
          "Error placing offer. Please try again later."
        );
      } finally {
        this.closeModal();
      }
    },
  },
  async created() {
    try {
      // Try to get the product from Vuex cache
      const cachedProduct = this.getProductById(this.productId);
      if (cachedProduct) {
        this.product = cachedProduct; // Use cached product if available
      } else {
        // If the product isn't in the cache, fetch it from Firestore
        const productRef = doc(db, "items", this.productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          this.product = productSnap.data();
          this.$store.commit("setProduct", {
            id: this.productId,
            ...this.product,
          }); // Update the cache
        } else {
          throw new Error("Product not found");
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
