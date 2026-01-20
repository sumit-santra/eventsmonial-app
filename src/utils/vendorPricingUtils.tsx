/**
 * Utility functions for handling vendor pricing information
 */

/**
 * Configuration object that maps vendor categories to their pricing field paths
 */
export const VENDOR_PRICING_CONFIG = {
  catering: {
    priceField: 'vegPlatePrice',
    displayName: 'Starting Price'
  },
  venues: {
    priceField: 'vegetarianMenuPrice',
    displayName: 'Starting Price'
  },
  photography: {
    priceField: 'mostBookedValue',
    displayName: 'Starting Price'
  },
  'bridal-makeup': {
    priceField: 'seniorPrice',
    displayName: 'Starting Price'
  },
  decorators: {
    priceField: 'weddingDecorPrice',
    displayName: 'Starting Price'
  },
  'wedding-planners': {
    priceField: 'startingPrice',
    displayName: 'Starting Price'
  },
  'mehendi-artist': {
    priceField: 'mehendiPrice',
    displayName: 'Starting Price'
  },
  dj: {
    priceField: 'basicPackage',
    displayName: 'Starting Price'
  },
  'pre-wedding-photographers': {
    priceField: 'preWeddingFilmPrice',
    displayName: 'Starting Price'
  },
  'wedding-pandit': {
    priceField: 'weddingCharges',
    displayName: 'Starting Price'
  },
  cake: {
    priceField: 'startingPrice',
    displayName: 'Starting Price'
  },
  bartenders: {
    priceField: 'chargesFor200',
    displayName: 'Starting Price'
  }
};

/**
 * Get the starting price for a vendor based on their category
 * @param {Object} vendor - The vendor object containing business and services information
 * @param {string} category - The vendor category (e.g., 'catering', 'venue', etc.)
 * @returns {Object} - Returns { price: number|string, displayName: string, formatted: string }
 */
export const getVendorStartingPrice = (vendor: any, category: string | null = null) => {
  try {
    // If category is not provided, try to get it from vendor data
    if (!category && vendor?.business?.category) {
      category = vendor.business.category.toLowerCase();
    }

    // Check if we have pricing configuration for this category
    const pricingConfig = category ? VENDOR_PRICING_CONFIG[category as keyof typeof VENDOR_PRICING_CONFIG] : null;
    if (!pricingConfig) {
      return {
        price: null,
        displayName: 'Starting Price',
        formatted: 'Price on request'
      };
    }

    // Get the price from the vendor's service info
    const serviceInfo = vendor?.services?.[0]?.serviceInfo;
    if (!serviceInfo) {
      return {
        price: null,
        displayName: pricingConfig.displayName,
        formatted: 'Price on request'
      };
    }

    let price = serviceInfo[pricingConfig.priceField];
    
    if (price === null || price === undefined || price === '') {
      return {
        price: null,
        displayName: pricingConfig.displayName,
        formatted: 'Price on request'
      };
    }

    // Handle price ranges (e.g., "25,000 - 30,000" or "25000-30000")
    // Extract the starting price if it's a range
    let numericPrice;
    if (typeof price === 'string') {
      // Remove commas from the string first
      const cleanedPrice = price.replace(/,/g, '');
      
      if (cleanedPrice.includes('-')) {
        // Split by dash and take the first value (starting price)
        const priceRange = cleanedPrice.split('-');
        numericPrice = Number(priceRange[0].trim());
      } else {
        numericPrice = Number(cleanedPrice.trim());
      }
      price = numericPrice; // Update price to be the numeric value
    } else {
      numericPrice = Number(price);
    }

    // If we still don't have a valid number, return price on request
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return {
        price: null,
        displayName: pricingConfig.displayName,
        formatted: 'Price on request'
      };
    }

    // Format the price
    const formattedPrice = `₹${numericPrice.toLocaleString('en-IN')}`;

    return {
      price: numericPrice,
      displayName: pricingConfig.displayName,
      formatted: formattedPrice,
      unit: 'onwards' // Add unit to indicate starting price
    };

  } catch (error) {
    console.error('Error getting vendor starting price:', error);
    return {
      price: null,
      displayName: 'Starting Price',
      formatted: 'Price on request'
    };
  }
};

/**
 * Get formatted starting price string for display
 * @param {Object} vendor - The vendor object
 * @param {string} category - The vendor category
 * @returns {string} - Formatted price string like "Starting Price: ₹5,000"
 */
export const getFormattedStartingPrice = (vendor: any, category: string | null = null) => {
  const pricing = getVendorStartingPrice(vendor, category);
  return `${pricing.displayName}: ${pricing.formatted}`;
};

/**
 * Check if vendor has pricing information available
 * @param {Object} vendor - The vendor object
 * @param {string} category - The vendor category
 * @returns {boolean} - True if pricing information is available
 */
export const hasVendorPricing = (vendor: any, category: string | null = null) => {
  const pricing = getVendorStartingPrice(vendor, category);
  return pricing.price !== null;
};

/**
 * Get all available categories with their pricing field mappings
 * @returns {Array} - Array of category objects with name and priceField
 */
export const getAvailableCategories = () => {
  return Object.entries(VENDOR_PRICING_CONFIG).map(([category, config]) => ({
    category,
    priceField: config.priceField,
    displayName: config.displayName
  }));
};

/**
 * Batch process multiple vendors to add pricing information
 * @param {Array} vendors - Array of vendor objects
 * @param {string} category - The category for all vendors (optional if category is in vendor data)
 * @returns {Array} - Array of vendors with added pricing information
 */
export const addPricingToVendors = (vendors: any, category: string | null = null) => {
  if (!Array.isArray(vendors)) {
    return vendors;
  }

  return vendors.map(vendor => ({
    ...vendor,
    pricing: getVendorStartingPrice(vendor, category)
  }));
};