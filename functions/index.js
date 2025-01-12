const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Cloud Function triggered when an offer is created in Firestore
exports.sendOfferNotification = functions.firestore
  .document('offers/{offerId}')
  .onCreate(async (snap, context) => {
    const newOffer = snap.data();

    // Get the user ID to send the notification to
    const userId = newOffer.sellerId; // Assuming the offer has a 'userId' field to identify the recipient

    // Get the user's FCM token from Firestore
    const userRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (!userData || !userData.fcmToken) {
      console.log('User does not have a valid FCM token.');
      return null;
    }

    const fcmToken = userData.fcmToken;

    // Prepare the notification payload
    const payload = {
      notification: {
        title: 'New Offer Received!',
        body: `You have received an offer for ${newOffer.productName}`, // Customize as needed
        icon: 'icon_url', // Optional: Include an icon if you want
      },
      token: fcmToken,
    };

    // Send the notification using Firebase Cloud Messaging
    try {
      const response = await admin.messaging().send(payload);
      console.log('Successfully sent message:', response);
      return null;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  });