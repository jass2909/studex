<template>
  <div class="container mx-auto p-6 max-w-lg">
    <!-- Title -->
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
      Sell Your Item
    </h1>

    <div>
      <!-- Authenticated Form -->
      <div v-if="isAuthenticated" class="bg-white shadow-md rounded-lg p-6">
        <form @submit.prevent="handleUpload" class="space-y-4">
          <!-- Item Name -->
          <input type="text" v-model="itemName" placeholder="Item Name" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <!-- Price -->
          <input type="number" v-model="itemPrice" placeholder="Price (€)" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

        <!-- Category -->
        <select v-model="itemCategory" required
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="" disabled selected>Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home">Home</option>
          <option value="Toys">Toys</option>
          <option value="Books">Books</option>
        </select>

        <!-- Condition -->
        <select v-model="itemCondition" required
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="" disabled selected>Select Condition</option>
          <option value="New">New</option>
          <option value="Used">Used</option>
          <option value="Refurbished">Refurbished</option>
          
          <option value="Damaged">Damaged</option>

        </select>

          <!-- Description -->
          <input type="text" v-model="itemDescription" placeholder="Description" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <!-- City -->
          <input type="text" v-model="itemCity" placeholder="City Name" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <!-- Postal Code -->
          <input type="text" v-model="itemPostalCode" placeholder="Postal Code" required
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

          <!-- File Upload -->
          <input type="file" @change="onFileChange" accept="image/*"
            class="w-full border rounded-md py-2 px-4 cursor-pointer" />

          <!-- Submit Button -->
          <button type="submit" class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
            <p v-if="loading" class="flex items-center justify-center text-white">
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
            <p v-else>Upload</p>
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { db } from "@/firebase";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import axios from "axios";
import Swal from "sweetalert2"; // Make sure to import axios for HTTP requests

export default {
  data() {
    return {
      itemName: "",
      itemPrice: "",
      itemDescription: "",
      itemCity: "",
      itemPostalCode: "",
      itemCategory: "",
      file: null,
      uploadSuccess: false,
      uploadError: "",
      defaultImageUrl: "https://placehold.co/400?text=No+Image+Available",
      imageUrl: null,
      itemCondition: "",
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
      getUser: "auth/getUser",
      getFCM: "auth/getFCMToken",
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
      this.loading = true;
      try {

        if (this.file) {
          // Upload image to ImgBB
          this.imageUrl = await this.uploadToImgBB(this.file);
        } else {
          // Use the default image URL
          this.imageUrl = this.defaultImageUrl;
        }

        // Generate the custom ID
        const customId = `${this.user.username}-${this.itemName.replace(/\s/g, '-')}`;

        // Save item details in Firestore
        await setDoc(doc(db, "items", customId), {
          id: customId,
          name: this.itemName,
          price: this.itemPrice,
          description: this.itemDescription,
          city: this.itemCity,
          postalCode: this.itemPostalCode,
          category: this.itemCategory,
          imageUrl: this.imageUrl,
          sellerId: this.user.username,
          createdAt: new Date(),
          condition: this.itemCondition,
          sellerUid: this.user.uid
        });

        // Create the new product object
        const newProduct = {
          id: customId,
          name: this.itemName,
          price: this.itemPrice,
          description: this.itemDescription,
          city: this.itemCity,
          postalCode: this.itemPostalCode,
          category: this.itemCategory,
          imageUrl: this.imageUrl,
          sellerId: this.user.username,
          createdAt: new Date(),
          condition: this.itemCondition
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
        this.imageUrl = null;
        this.itemCity = "";
        this.itemPostalCode = "";
        this.itemCategory = "";
        this.itemCondition = "";

        this.loading = false;

        await Swal.fire({
          title: "Item uploaded successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        console.error("Upload failed:", error.message);
        this.uploadError = error.message;
        await Swal.fire({
          title: "Upload failed",
          text: error.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  },
};
</script>

<style scoped>
.container {
  margin-top: 20px; /* Header Bar was covering the container -> Better looks */
}
.error {
  color: red;
}
</style>
