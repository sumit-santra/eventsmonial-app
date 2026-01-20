import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://dev.eventsmonial.com';

const getToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

const protectedApi = {
  getUserProfile: async () => {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  updateProfile: async (userData) => {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  getMyBookings: async () => {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/user/bookings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  createBooking: async (bookingData) => {
    const token = await getToken();
    const response = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
    return response.json();
  },
};

export default protectedApi;