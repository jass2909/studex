// src/utils/firebaseUtils.js
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the import path based on your project structure

/**
 * Fetches the FCM token for a user based on their username (sellerId).
 * @param {string} sellerId - The username of the seller.
 * @returns {Promise<string|null>} - The FCM token or null if not found.
 */
export async function getSellerFCMToken(sellerId) {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", sellerId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const user = userDoc.data();
      return user.fcmToken;
    }
    return null; // User not found
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}