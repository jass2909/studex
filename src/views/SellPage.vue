<template>
  <div>
    <h1>Sell Your Item</h1>
    <div v-if="isAuthenticated">
      <form @submit.prevent="handleUpload">
        <input
          type="text"
          v-model="itemName"
          placeholder="Item Name"
          required
        />
        <input
          type="number"
          v-model="itemPrice"
          placeholder="Price (€)"
          required
        />
        <input
          type="text"
          v-model="itemDescription"
          placeholder="Description"
          required
        />
        <input type="file" @change="onFileChange" accept="image/*" required />
        <button type="submit">Upload Item</button>
      </form>
      <p v-if="uploadSuccess">Item uploaded successfully!</p>
      <p v-if="uploadError" class="error">{{ uploadError }}</p>
    </div>
    <div v-else>
      <p>You must be logged in to upload an item.</p>
      <router-link to="/login">Login</router-link>
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
      file: null,
      uploadSuccess: false,
      uploadError: "",
    };
  },
  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
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
        await addDoc(collection(db, "items"), {
          name: this.itemName,
          price: this.itemPrice,
          description: this.itemDescription,
          imageUrl,
          sellerId: this.$store.getters.getUser.username,
          createdAt: new Date(),
        });

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
