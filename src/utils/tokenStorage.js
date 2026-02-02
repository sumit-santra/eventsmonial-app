import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAccessToken = () =>
  AsyncStorage.getItem('accessToken');

export const getRefreshToken = () =>
  AsyncStorage.getItem('refreshToken');

export const saveTokens = async ({ accessToken, refreshToken }) => {
  const data = [];

  if (accessToken !== undefined) {
    data.push(['accessToken', accessToken]);
  }
  if (refreshToken !== undefined) {
    data.push(['refreshToken', refreshToken]);
  }

  if (data.length) {
    await AsyncStorage.multiSet(data);
  }
};

export const clearAuthStorage = async () => {
  await AsyncStorage.multiRemove([
    'accessToken',
    'refreshToken',
    'user',
    'isLoggedIn',
  ]);
};
