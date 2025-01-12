<template>
  <div class="container mx-auto p-4">
    <!-- Profile Header -->


    <!-- Profile Information -->
    <div v-if="user" class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 class="text-3xl font-semibold text-gray-900 mb-4">
        {{ user.username }}
      </h2>
      <p class="text-lg text-gray-700 mb-4">
        <strong>City:</strong> {{ user.city }}
      </p>
      <p class="text-lg text-gray-700">
        <strong>Bio:</strong> {{ user.bio }}
      </p>
          <!-- Profile Actions -->
    <div class="flex justify-center mb-4">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Edit Profile
      </button>
    </div>
    </div>
    <div class="">
      <h1>My Items</h1>

    </div>
    <div >
        <div class="bg-white rounded-lg shadow-lg p-6 flex justify-center mb-4" v-for="product in products" :key="product.id">
          <router-link :to="`/product/${product.id}`">
            <div class="">
              <img
                :src="product.imageUrl"
                alt="Product Image"
                class="w-full h-64 object-contain rounded-mg"
              />
            </div>
            <div class="flex flex-col">
              <span class="font-semibold text-gray-800">{{
                product.name
              }}</span>
              <span class="text-gray-600">€{{ product.price }}</span>
              <span class="text-gray-600">Location: {{ product.location }}</span>
            </div>
          </router-link>
        </div>
      </div>


  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { db } from "@/firebase";
import { collection, getDocs, doc, getDoc, where, query } from "firebase/firestore";

export default {
  data() {
    return {
      user: null,
      products: [],
    };

  },
  computed: {
    ...mapGetters(["getProductsByUserName"]
      
    )
  },
  async created() {
    const uid = this.$route.params.uid;
    if (uid) {
      await this.fetchUser(uid); // Fetch the user data by UID if uid exists
    } else {
      console.error("No UID provided in route parameters.");
    }
    try {
      const cachedProducts = this.getProductsByUserName(this.user.username);
      if (cachedProducts) {
        this.products = cachedProducts;
        console.log(this.products);
      } else {
        const productsCollection = collection(db, "items");
        const snapshot = await getDocs(productsCollection);
        this.products = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
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
  },
};

</script>

