import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

export const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      error => reject(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
