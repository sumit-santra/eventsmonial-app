const BASE_URL = 'https://api.dev.eventsmonial.com';

const publicApi = {
  
  getVendors: async () => {
    const response = await fetch(`${BASE_URL}/api/v1/planners/get-all-business-categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON, got: ${contentType}. Response: ${text.substring(0, 200)}`);
    }
    
    return response.json();
  },

  getAllBusinesses: async (params = {}) => {
    const queryParams = new URLSearchParams({
      page: '1',
      limit: '12',
      sortBy: 'rankingScore',
      sortOrder: 'desc',
      ...params
    }).toString();
    
    const response = await fetch(`${BASE_URL}/api/v1/planners/get-all-businesses?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  getVendorDetails: async (categorySlug) => {
    const response = await fetch(`${BASE_URL}/api/v1/planners/business-by-slug/${categorySlug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },


  getAllcards: async (params = {}) => {
    console.log('API Params:', params);
    const queryParams = new URLSearchParams({ ...params}).toString();
    
    const response = await fetch(`${BASE_URL}/api/v1/multi-page-card-templates/templates?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON, got: ${contentType}. Response: ${text.substring(0, 200)}`);
    }
    
    return response.json();
  },

  getCardDetails: async (slug) => {

    // https://api.dev.eventsmonial.com/api/v1/multi-page-card-templates/templates

    const response = await fetch(`${BASE_URL}/api/v1/multi-page-card-templates/templates/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },


  
};

export default publicApi;