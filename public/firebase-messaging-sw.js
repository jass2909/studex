importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDywNdRbif5BFi_q5hb7rUhzvrOXTGrrks",
    authDomain: "studex-e3c2a.firebaseapp.com",
    projectId: "studex-e3c2a",
    storageBucket: "studex-e3c2a.firebasestorage.app",
    messagingSenderId: "1076156754259",
    appId: "1:1076156754259:web:c0d7a65d58ce2f739519a6",
    measurementId: "G-PQD022RY3E"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
