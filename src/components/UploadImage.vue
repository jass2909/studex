<template>
  <div>
    <h2>Upload an Image</h2>
    <input type="file" @change="handleImageUpload" />
    <button @click="uploadImage" :disabled="!image">Upload</button>

    <p v-if="uploading">Uploading...</p>
    <p v-if="uploadError" style="color: red">{{ uploadError }}</p>
    <p v-if="imageUrl">Image URL: {{ imageUrl }}</p>
  </div>
</template>

<script>
import { storage } from "@/firebase"; // Import storage from firebase.js

export default {
  data() {
    return {
      image: null, // To store the image file
      uploading: false, // To handle the upload status
      imageUrl: null, // To store the uploaded image URL
      uploadError: null, // To handle any errors
    };
  },
  methods: {
    // Handle file input change (when a user selects a file)
    handleImageUpload(event) {
      this.image = event.target.files[0]; // The file selected by the user
    },

    // Upload the selected image to Firebase Storage
    async uploadImage() {
      if (!this.image) return;

      this.uploading = true; // Set uploading flag to true
      this.uploadError = null; // Clear previous errors

      try {
        const uploadTask = storage
          .ref(`images/${this.image.name}`)
          .put(this.image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Progress monitoring (optional)
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            // Error handling
            this.uploadError = error.message;
            console.error(error);
          },
          () => {
            // When the upload is complete, get the image URL
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              this.imageUrl = downloadURL; // Set the image URL
              console.log("File available at", downloadURL);
            });
          }
        );
      } catch (error) {
        this.uploadError = error.message;
        console.error(error);
      } finally {
        this.uploading = false; // Reset uploading flag
      }
    },
  },
};
</script>

<style scoped>
/* Add any styles for the component */
</style>
