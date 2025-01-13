// src/services/pushNotification.js

import axios from 'axios';
const API_URL = process.env.VUE_APP_API_URL;


export async function sendPushNotification(token, title, body) {
  console.log(token, title, body);
  try {
    const response = await axios.post(API_URL, {
      token: token,
      title: title,
      body: body,
      
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    
  );
    console.log('Notification sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}