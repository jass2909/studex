<template>
  <div class="container mx-auto p-6 max-w-lg">
    <!-- Title -->
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
      Sell Your Item
    </h1>

    <!-- Authenticated Form -->
    <div v-if="isAuthenticated" class="bg-white shadow-md rounded-lg p-6">
      <form @submit.prevent="handleUpload" class="space-y-4">
        <!-- Item Name -->
        <input
          type="text"
          v-model="itemName"
          placeholder="Item Name"
          required
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <!-- Price -->
        <input
          type="number"
          v-model="itemPrice"
          placeholder="Price (€)"
          required
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <!-- Category -->
        <select
          v-model="itemCategory"
          required
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          
        >
          <option value="" disabled selected>Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home">Home</option>
          <option value="Toys">Toys</option>
          <option value="Books">Books</option>
        </select>

        <!-- Description -->
        <input
          type="text"
          v-model="itemDescription"
          placeholder="Description"
          required
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <!-- Location -->
        <input
          type="text"
          v-model="itemLocation"
          placeholder="Location (City and Postal Code)"
          required
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <!-- File Upload -->
        <input
          type="file"
          @change="onFileChange"
          accept="image/*"
          required
          class="w-full border rounded-md py-2 px-4 cursor-pointer"
        />

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Upload Item
        </button>
      </form>

      <!-- Feedback Messages -->
      <p v-if="uploadSuccess" class="text-green-500 mt-4">
        Item uploaded successfully!
      </p>
      <p v-if="uploadError" class="text-red-500 mt-4">{{ uploadError }}</p>
    </div>

    <!-- Not Authenticated Message -->
    <div v-else class="text-center mt-6">
      <p class="text-gray-700 mb-2">You must be logged in to upload an item.</p>
      <router-link to="/login" class="text-blue-500 hover:underline">
        Login
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios"; // Make sure to import axios for HTTP requests

export default {
  data() {
    return {
      itemName: "",
      itemPrice: "",
      itemDescription: "",
      itemLocation: "",
      itemCategory: "",
      file: null,
      uploadSuccess: false,
      uploadError: "",
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
    onFileChange(event) {
      this.file = event.target.files[0];
    },

    async uploadToImgBB(file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${process.env.VUE_APP_imgBB_APIKEY}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          return response.data.data.url; // The URL of the uploaded image
        } else {
          throw new Error("Image upload failed");
        }
      } catch (error) {
        throw new Error("Image upload failed: " + error.message);
      }
    },

    async handleUpload() {
      try {
        if (!this.file) {
          throw new Error("Please select an image to upload.");
        }

        // Upload image to ImgBB
        const imageUrl = await this.uploadToImgBB(this.file);

        // Save item details in Firestore
        const docRef = await addDoc(collection(db, "items"), {
          name: this.itemName,
          price: this.itemPrice,
          description: this.itemDescription,
          location: this.itemLocation,
          category: this.itemCategory,
          imageUrl,
          sellerId: this.user.username,
          createdAt: new Date(),
        });

        // Create the new product object
        const newProduct = {
          id: docRef.id, // Use Firestore document ID
          name: this.itemName,
          price: this.itemPrice,
          description: this.itemDescription,
          imageUrl,
          sellerId: this.user.username,
          createdAt: new Date(),
        };

        // Directly add the product to the Vuex store
        this.$store.commit("addProduct", newProduct);
        this.$store.commit("setProductsFetched", false);

        // Reset form and display success message
        this.uploadSuccess = true;
        this.uploadError = "";
        this.itemName = "";
        this.itemPrice = "";
        this.itemDescription = "";
        this.file = null;
      } catch (error) {
        console.error("Upload failed:", error.message);
        this.uploadError = error.message;
      }
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
