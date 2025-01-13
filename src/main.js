import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import './assets/tailwind.css';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';



// Function to store FCM token
function storeFCMToken(token, userId) {
  setDoc(doc(db, 'users', userId), {
    fcmToken: token
  }, { merge: true })
  .then(() => {
    console.log("FCM token stored successfully!");
  })
  .catch((error) => {
    console.error("Error storing token:", error);
  });
}

const messaging = getMessaging();

// Register service worker for Firebase Messaging
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered:', registration);
    })
    .catch((err) => console.error('Service Worker registration failed:', err));
}

// Wait for user to be authenticated before retrieving the token
store.dispatch('auth/initializeAuth').then(() => {
  // Watch for changes to the user state in the Vuex store
  store.watch(
    (state) => state.auth.user,
    (user) => {
      console.log('User authenticated:', user);
      if (user) {
        // Request Notification Permission and Get FCM Token
        getToken(messaging, { vapidKey: process.env.VUE_APP_VAPID_KEY })
          .then((currentToken) => {
            if (currentToken) {
              console.log('FCM Token:', currentToken);
  
              // Store the FCM token with the user ID
              storeFCMToken(currentToken, user.uid);
              // Add FCM Token to vuex store
              store.dispatch('auth/setFCMToken', currentToken);
              
            } else {
              console.warn('No registration token available. Request permission to generate one.');
            }
          })
          .catch((err) => console.error('An error occurred while retrieving token:', err));

        // Handle foreground messages
        onMessage(messaging, (payload) => {
          console.log('Message received:', payload);
          // Optionally, you can display notifications or update your UI directly
          console.log('Complete payload:', payload);
        });
      } else {
        console.warn('User is not authenticated.');
      }
    }
  );
}).catch((error) => {
  console.error('Failed to initialize authentication:', error);
});

const app = createApp(App);

// Ensure app is mounted after authentication is initialized
app.use(store).use(router).mount('#app');