<template>
    <div class="container mx-auto py-8">
   
      <!-- Profile Header -->
      <div class="bg-white rounded-2xl shadow-lg p-6 mb-8 mt-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-3xl font-semibold text-gray-900 mb-2">
              {{ user?.username || "Loading..." }}
            </h2>
            <p class="text-lg text-gray-700">
              <strong>City:</strong> {{ user?.city || "Loading..." }}
            </p>
            <p class="text-lg text-gray-700">
              <strong>Bio:</strong> {{ user?.bio || "Loading..." }}
            </p>
          </div>
          
        </div>
      </div>
  
      <!-- Tabs -->
      <div class="flex justify-center mb-6 mx-4 text-2xl">
        <div class="bg-white rounded-lg shadow-lg p-2">
         <h1>Items</h1>
          
          
          
        </div>
      </div>
  
      <!-- Items -->
      <div v-if="activeTab === 'items'">

  
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="product in products"
            :key="product.id"
            class="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between relative"
          >
            <router-link :to="`/product/${product.id}`" class="flex-grow">
              <div class="mb-4">
                <img
                  :src="product.imageUrl"
                  alt="Product Image"
                  class="w-full h-64 object-contain rounded-md"
                />
              </div>
              <div class="flex flex-col">
                <span class="font-semibold text-gray-800 mb-2">
                  {{ product.name }}
                </span>
                <span class="text-gray-600 mb-2">€{{ product.price }}</span>
                <span class="text-gray-600"
                  >Location: {{ product.city }}, {{ product.postalCode }}</span
                >
              </div>
            </router-link>
            
            
          </div>
        </div>
      </div>
  
  
  
      
  
    
    </div>
  </template>
  
  <script>
  import { mapGetters } from "vuex";
  import { db } from "@/firebase";
  import OffersPage from "./OffersPage.vue";
  import {
    collection,
    getDocs,
    doc,
    getDoc,
    where,
    query,
    deleteDoc,
    writeBatch,
    updateDoc
  } from "firebase/firestore";
  import WishlistPage from "@/views/WishlistPage.vue";
  import Swal from "sweetalert2";
  
  
  export default {
   
   
    data() {
      return {
        user: null,
        products: [],
        itemToDelete: null,
        showDeleteModal: false,
        activeTab: "items",
        reviews: [],
        offers: [],
        showEditModal: false,
        itemToEdit: null,
        loading: false,
         
      };
    },
    
  
    components: {
      WishlistPage,
      OffersPage,
    },
    computed: {
      ...mapGetters(["getProductsByUserName"]),
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
    name: "SellerProfile",
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
          const q = query(
            collection(db, "items"),
            where("sellerId", "==", this.user.username)
          );
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
      async editProduct(itemToEdit) {
        
  
    try {
      await updateDoc(doc(db, "items", itemToEdit.id), {
        name: itemToEdit.name,
        price: itemToEdit.price,
        city: itemToEdit.city,
        postalCode: itemToEdit.postalCode,
        imageUrl: itemToEdit.imageUrl,
      });
  
      this.showEditModal = false;
      this.fetchProducts(); // Assuming you have a method to fetch products
  
      // Reset the itemToEdit
      this.itemToEdit = null;
  
      alert("Product updated successfully!");
    } catch (error) {
      alert("Error updating product. Please try again later.");
      console.error(error);
    }
  },
      async deleteItem() {
        this.loading = true;
        try {
          // Get the reference to the document
          const itemDocRef = doc(db, "items", this.itemToDelete.id);
          // Delete the offers associated with the item
          const offersQuery = query(
            collection(db, "offers"),
            where("productId", "==", this.itemToDelete.id)
          );
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
          this.loading = false;
          // Show a success message
          await Swal.fire({
            icon: 'success',
            title: 'Item deleted!',
            text: 'Your item has been deleted successfully.',
            timer: 3000,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error("Error deleting item:", error);
          // Show an error message
          await Swal.fire({
            icon: 'error',
            title: 'Error deleting item',
            text: 'An error occurred while deleting the item. Please try again later.',
            timer: 3000,
            showConfirmButton: false,
          });
        }
      },
    },
  };
  </script>
  