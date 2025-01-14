<template>
  <div class="container mx-auto py-8">
    <!-- Profile Header -->
     <div v-if="!user">Loading</div>
    <div v-else="user" class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-semibold text-gray-900 mb-2">
            {{ user.username }}
          </h2>
          <p class="text-lg text-gray-700">
            <strong>City:</strong> {{ user.city }}
          </p>
          <p class="text-lg text-gray-700">
            <strong>Bio:</strong> {{ user.bio }}
          </p>
        </div>
        <div>
          <button
            class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex justify-center mb-6 mx-4">
      <div class="bg-white rounded-lg shadow-lg p-2">
        <button
          class="px-4 py-2 rounded-lg transition-colors duration-300"
          :class="{
            'bg-blue-500 text-white': activeTab === 'items',
            'hover:bg-gray-200': activeTab !== 'items',
          }"
          @click="activeTab = 'items'"
        >
          Items
        </button>
        <button
          class="px-4 py-2 rounded-lg transition-colors duration-300"
          :class="{
            'bg-blue-500 text-white': activeTab === 'offers',
            'hover:bg-gray-200': activeTab !== 'offers',
          }"
          @click="activeTab = 'offers'"
        >
          Offers
        </button>
        <button
          class="px-4 py-2 rounded-lg transition-colors duration-300"
          :class="{
            'bg-blue-500 text-white': activeTab === 'reviews',
            'hover:bg-gray-200': activeTab !== 'reviews',
          }"
          @click="activeTab = 'reviews'"
        >
          Reviews
        </button>
      </div>
    </div>

    <!-- Items -->
    <div v-if="activeTab === 'items'">
      <div class="text-4xl font-bold text-center text-gray-800 mb-6">
        <h1>My Items</h1>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between"
        >
          <!-- Product card content -->
          <router-link :to="`/product/${product.id}`" class="flex-grow">
          <div class="mb-4">
            <img :src="product.imageUrl" alt="Product Image" class="w-full h-64 object-contain rounded-md" />
          </div>
          <div class="flex flex-col">
            <span class="font-semibold text-gray-800 mb-2">
              {{ product.name }}
            </span>
            <span class="text-gray-600 mb-2">€{{ product.price }}</span>
            <span class="text-gray-600">Location: {{ product.city }}, {{ product.postalCode }}</span>
          </div>
        </router-link>
        <button
          class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 mt-4"
          @click="showDeleteModal = true; itemToDelete = product">
          Delete
        </button>

        </div>
      </div>
    </div>

    <!-- Offers -->
    <div v-if="activeTab === 'offers'">
      <div class="text-4xl font-bold text-center text-gray-800 mb-6">
        <h1>My Offers</h1>
      </div>
        <OffersPage></OffersPage>
      <!-- Offer content goes here -->
    </div>

    <!-- Reviews -->
    <div v-if="activeTab === 'reviews'">
      <div class="text-4xl font-bold text-center text-gray-800 mb-6">
        <h1>My Reviews</h1>
      </div>

      <!-- Review content goes here -->
    </div>
     <!-- Confirmation Modal -->
     <div v-if="showDeleteModal" class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Delete Item
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete this item? This action cannot
                    be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="deleteItem">
              Delete
            </button>
            <button type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="showDeleteModal = false">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { db } from "@/firebase";
import OffersPage from "./OffersPage.vue";
import { collection, getDocs, doc, getDoc, where, query, deleteDoc, writeBatch } from "firebase/firestore";

export default {
  data() {
    return {
      user: null,
      products: [],
      itemToDelete: null,
      showDeleteModal: false,
      activeTab: "items",
      
    };

  },
  components: {
    OffersPage
  },
  computed: {
    ...mapGetters(["getProductsByUserName"]

    )
  },
  async created() {
    const uid = this.$route.params.uid;
    if (uid) {
      await this.fetchUser(uid);
      await this.fetchProducts();
    } else {
      console.error("No UID provided in route parameters.");
    }
  },
  name: "Profile",
  methods: {
    async fetchUser(uid) {
      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          this.user = userDoc.data();
          console.log(this.user);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    },
    async fetchProducts() {
      try {
        const q = query(collection(db, "items"), where("sellerId", "==", this.user.username));
        const snapshot = await getDocs(q);
        this.products = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.$store.commit("setProductsByUserName", {
          username: this.user.username,
          products: this.products,
        });
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    async deleteItem() {
      try {
        // Get the reference to the document
        const itemDocRef = doc(db, "items", this.itemToDelete.id);
        // Delete the offers associated with the item
        const offersQuery = query(collection(db, "offers"), where("productId", "==", this.itemToDelete.id));
        const offersSnapshot = await getDocs(offersQuery);
        const offerBatch = writeBatch(db);
        offersSnapshot.docs.forEach((offerDoc) => {
          offerBatch.delete(offerDoc.ref);
        });
        await offerBatch.commit();

        // Delete the item from Firestore
        await deleteDoc(itemDocRef);


        // Remove the item from the Vuex store
        this.$store.commit("removeProduct", this.itemToDelete.id);

        // Fetch the updated list of products
        await this.fetchProducts();

        // Close the modal and reset the itemToDelete
        this.showDeleteModal = false;
        this.itemToDelete = null;
      } catch (error) {
        console.error("Error deleting item:", error);

      }
    }
  },
};

</script>
