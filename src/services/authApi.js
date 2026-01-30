const BASE_URL = 'https://api.dev.eventsmonial.com';

const authApi = {

  login: async (userData) => {
    const response = await fetch(`${BASE_URL}/api/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();

    return {
      status: response.status,
      ok: response.ok,
      headers: response.headers, 
      data,
    };
  },

  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/api/v1/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();

    return {
      status: response.status,
      ok: response.ok,
      headers: response.headers, 
      data,
    };
  },

  verificationOtp: async (userData, token) => {
    console.log(userData);
    const response = await fetch(`${BASE_URL}/api/v1/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'verificationtoken': token,
      },
      body: JSON.stringify({otp: userData}),
    });
    const data = await response.json();

    return {
      status: response.status,
      ok: response.ok,
      headers: response.headers,
      data,
    };
  },

  resendOTP: async (verificationtoken) => {
    const response = await fetch(`${BASE_URL}/api/v1/resendOTP`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        verificationtoken: verificationtoken,
      },
    });
    const data = await response.json();

    return {
      status: response.status,
      ok: response.ok,
      headers: response.headers,
      data,
    };
  },

  forgotPassword: async (email) => {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return response.json();
  },
};

export default authApi;