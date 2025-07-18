// Centralized API Configuration
// All external service configurations and connection parameters

const config = {
  // Supabase Configuration
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL,
    anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY,
    projectRef: process.env.REACT_APP_SUPABASE_PROJECT_REF
  },

  // eBay API Configuration
  ebay: {
    // Sandbox Environment
    sandbox: {
      enabled: process.env.NODE_ENV !== 'production',
      baseUrl: 'https://api.sandbox.ebay.com',
      appId: process.env.REACT_APP_EBAY_APP_ID,
      devId: process.env.REACT_APP_EBAY_DEV_ID,
      certId: process.env.REACT_APP_EBAY_CERT_ID,
      authUrl: 'https://auth.sandbox.ebay.com/oauth/api/token',
      findingApiUrl: 'https://svcs.sandbox.ebay.com/services/search/FindingService/v1',
      browseApiUrl: 'https://api.sandbox.ebay.com/buy/browse/v1',
      scope: 'https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/buy.item.feed'
    },
    
    // Production Environment
    production: {
      enabled: process.env.NODE_ENV === 'production',
      baseUrl: 'https://api.ebay.com',
      appId: process.env.REACT_APP_EBAY_PROD_APP_ID,
      devId: process.env.REACT_APP_EBAY_PROD_DEV_ID,
      certId: process.env.REACT_APP_EBAY_PROD_CERT_ID,
      authUrl: 'https://auth.ebay.com/oauth/api/token',
      findingApiUrl: 'https://svcs.ebay.com/services/search/FindingService/v1',
      browseApiUrl: 'https://api.ebay.com/buy/browse/v1',
      scope: 'https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/buy.item.feed'
    },

    // Search Configuration
    search: {
      categoryIds: {
        drones: '179697', // Consumer Electronics > Radio Control & Control Line > RC Model Vehicles & Kits > RC Model Vehicle Parts & Accs > Multi-Rotor/Drone
        djidrones: '182186', // More specific DJI category
        autel: '179697',
        cameras: '625' // Cameras & Photo
      },
      defaultFilters: {
        condition: ['New', 'Used', 'Manufacturer refurbished'],
        sortOrder: 'PricePlusShippingLowest',
        listingType: 'FixedPrice,Auction',
        maxResults: 100,
        aspectFilters: {
          brand: ['DJI', 'Autel Robotics', 'Skydio', 'Parrot', 'Holy Stone']
        }
      },
      rateLimit: {
        requestsPerSecond: 5, // eBay sandbox limit
        requestsPerDay: 5000
      }
    }
  },

  // Exchange Rate API (for USD/ARS conversion)
  exchangeRate: {
    primary: {
      name: 'ExchangeRate-API',
      baseUrl: 'https://api.exchangerate-api.com/v4/latest',
      apiKey: process.env.REACT_APP_EXCHANGE_API_KEY || null, // Free tier doesn't require key
      supportedCurrencies: ['USD', 'ARS']
    },
    fallback: {
      name: 'Fixer.io',
      baseUrl: 'https://api.fixer.io/latest',
      apiKey: process.env.REACT_APP_FIXER_API_KEY || null
    }
  },

  // Application Settings
  app: {
    environment: process.env.NODE_ENV || 'development',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    apiTimeout: 30000, // 30 seconds
    retryAttempts: 3,
    cacheTimeout: 300000, // 5 minutes
    features: {
      ebayIntegration: true,
      realTimePricing: true,
      priceComparison: true,
      autoRefresh: false
    }
  }
};

// Helper function to get current eBay config (sandbox vs production)
export const getEbayConfig = () => {
  return config.app.environment === 'production' 
    ? config.ebay.production 
    : config.ebay.sandbox;
};

// Helper function to validate API configurations
export const validateConfig = () => {
  const ebayConfig = getEbayConfig();
  const issues = [];

  // Check Supabase
  if (!config.supabase.url || !config.supabase.anonKey) {
    issues.push('Supabase configuration incomplete');
  }

  // Check eBay
  if (!ebayConfig.appId || !ebayConfig.devId || !ebayConfig.certId) {
    issues.push('eBay API configuration incomplete');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};

// Export configuration
export default config;