import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from '../utils/tokenStorage';

const BASE_URL = 'https://api.dev.eventsmonial.com/api/v1';

let isRefreshing = false;
let pendingRequests = [];

const processQueue = (error, token = null) => {
  pendingRequests.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  pendingRequests = [];
};


const refreshAccessToken = async () => {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token');
  }

  const response = await fetch(`${BASE_URL}/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Refresh token expired');
  }

  const newAccessToken = response.headers.get('accesstoken');

  if (!newAccessToken) {
    throw new Error('Access token missing in refresh response');
  }

  await saveTokens({ accessToken: newAccessToken });

  return newAccessToken;
};


export const secureFetch = async (url, options = {}, retry = true) => {
  const token = await getAccessToken();

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  // Success (non-401)
  if (response.status !== 401) {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  //retried → logout
  if (!retry) {
    await clearTokens();
    throw new Error('Unauthorized');
  }

  // Wait if refresh already in progress
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingRequests.push({
        resolve: (newToken) =>
          resolve(
            secureFetch(
              url,
              {
                ...options,
                headers: {
                  ...options.headers,
                  Authorization: `Bearer ${newToken}`,
                },
              },
              false
            )
          ),
        reject,
      });
    });
  }

  isRefreshing = true;

  try {
    const newAccessToken = await refreshAccessToken();
    processQueue(null, newAccessToken);

    return secureFetch(
      url,
      {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      },
      false
    );
  } catch (error) {
    processQueue(error, null);
    await clearTokens();
    throw error;
  } finally {
    isRefreshing = false;
  }
};
