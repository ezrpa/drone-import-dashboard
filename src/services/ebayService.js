import config, { getEbayConfig } from '../config/api';
import { droneAnalysisService } from '../lib/supabase';

class EbayPricingService {
  constructor() {
    this.config = getEbayConfig();
    this.accessToken = null;
    this.tokenExpiry = null;
    this.requestCount = 0;
    this.lastRequestTime = 0;
    this.cache = new Map();
  }

  // Rate limiting to respect eBay API limits
  async rateLimitCheck() {
    const now = Date.now();
    if (now - this.lastRequestTime < 200) { // 5 requests per second max
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  // Get OAuth token for eBay API
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const credentials = btoa(`${this.config.appId}:${this.config.certId}`);
      
      const response = await fetch(this.config.authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`
        },
        body: 'grant_type=client_credentials&scope=' + encodeURIComponent(this.config.scope)
      });

      if (!response.ok) {
        throw new Error(`eBay Auth failed: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 minute buffer
      
      return this.accessToken;
    } catch (error) {
      console.error('eBay authentication failed:', error);
      throw new Error('Failed to authenticate with eBay API');
    }
  }

  // Search for drone listings on eBay
  async searchDroneListings(droneModel, options = {}) {
    const cacheKey = `${droneModel}-${JSON.stringify(options)}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < config.app.cacheTimeout) {
        return cached.data;
      }
    }

    await this.rateLimitCheck();

    try {
      const token = await this.getAccessToken();
      
      // Clean and prepare search query
      const searchQuery = this.prepareSearchQuery(droneModel);
      
      // Use eBay Browse API for better results
      const searchParams = new URLSearchParams({
        q: searchQuery,
        category_ids: config.ebay.search.categoryIds.drones,
        filter: this.buildFilters(options),
        sort: options.sortOrder || 'price',
        limit: Math.min(options.maxResults || 50, 200),
        offset: options.offset || 0
      });

      const response = await fetch(`${this.config.browseApiUrl}/item_summary/search?${searchParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US' // US marketplace
        }
      });

      if (!response.ok) {
        throw new Error(`eBay search failed: ${response.status}`);
      }

      const data = await response.json();
      const processedResults = this.processSearchResults(data, droneModel);

      // Cache results
      this.cache.set(cacheKey, {
        data: processedResults,
        timestamp: Date.now()
      });

      return processedResults;
    } catch (error) {
      console.error('eBay search failed:', error);
      return { success: false, error: error.message, results: [] };
    }
  }

  // Prepare search query for better matching
  prepareSearchQuery(droneModel) {
    // Remove common prefixes and clean the model name
    let query = droneModel
      .replace(/^(DJI|Autel|Skydio|Parrot)\s+/i, '') // Remove brand prefix if present
      .replace(/\s+/g, ' ')
      .trim();

    // Add the brand back for better search
    const brand = this.detectBrand(droneModel);
    if (brand) {
      query = `${brand} ${query}`;
    }

    // Add drone keyword if not present
    if (!query.toLowerCase().includes('drone') && !query.toLowerCase().includes('quadcopter')) {
      query += ' drone';
    }

    return query;
  }

  // Detect brand from model name
  detectBrand(droneModel) {
    const brands = {
      'DJI': /\b(dji|phantom|mavic|mini|air|spark|inspire|matrice|agras)\b/i,
      'Autel': /\b(autel|evo)\b/i,
      'Skydio': /\bskydio\b/i,
      'Parrot': /\b(parrot|bebop|anafi)\b/i,
      'Holy Stone': /\bholy\s*stone\b/i
    };

    for (const [brand, regex] of Object.entries(brands)) {
      if (regex.test(droneModel)) {
        return brand;
      }
    }
    return null;
  }

  // Build eBay API filters
  buildFilters(options) {
    const filters = [];
    
    // Condition filter
    if (options.condition) {
      const conditions = Array.isArray(options.condition) ? options.condition : [options.condition];
      const conditionMap = {
        'new': 'NEW',
        'used': 'USED_EXCELLENT,USED_VERY_GOOD,USED_GOOD',
        'refurbished': 'SELLER_REFURBISHED,MANUFACTURER_REFURBISHED'
      };
      
      const conditionFilters = conditions.map(c => conditionMap[c.toLowerCase()]).filter(Boolean);
      if (conditionFilters.length > 0) {
        filters.push(`conditionIds:{${conditionFilters.join('|')}}`);
      }
    }

    // Price range filter
    if (options.minPrice || options.maxPrice) {
      let priceFilter = 'price:[';
      priceFilter += options.minPrice || '';
      priceFilter += '..';
      priceFilter += options.maxPrice || '';
      priceFilter += ']';
      filters.push(priceFilter);
    }

    // Location filter (US only for consistency)
    filters.push('itemLocationCountry:US');
    
    // Exclude auction-style listings if specified
    if (options.buyItNowOnly) {
      filters.push('buyingOptions:{FIXED_PRICE}');
    }

    return filters.join(',');
  }

  // Process and analyze search results
  processSearchResults(data, originalModel) {
    if (!data.itemSummaries || data.itemSummaries.length === 0) {
      return {
        success: true,
        results: [],
        summary: {
          totalFound: 0,
          avgPrice: 0,
          priceRange: { min: 0, max: 0 },
          conditions: {}
        }
      };
    }

    const results = data.itemSummaries.map(item => {
      const price = this.extractPrice(item.price);
      const shipping = this.extractPrice(item.shippingOptions?.[0]?.shippingCost);
      
      return {
        id: item.itemId,
        title: item.title,
        price: price,
        shipping: shipping,
        totalPrice: price + shipping,
        condition: item.condition,
        conditionDescription: item.conditionDescription,
        location: item.itemLocation?.city,
        country: item.itemLocation?.country,
        seller: {
          username: item.seller?.username,
          feedbackScore: item.seller?.feedbackScore,
          feedbackPercentage: item.seller?.feedbackPercentage
        },
        url: item.itemWebUrl,
        imageUrl: item.image?.imageUrl,
        listingType: item.listingMarketplaceId,
        endTime: item.itemEndDate,
        relevanceScore: this.calculateRelevance(item.title, originalModel)
      };
    });

    // Filter by relevance (remove obviously unrelated items)
    const relevantResults = results.filter(item => item.relevanceScore > 0.3);

    // Calculate summary statistics
    const prices = relevantResults.map(item => item.totalPrice).filter(price => price > 0);
    const summary = {
      totalFound: relevantResults.length,
      avgPrice: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
      priceRange: {
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 0
      },
      conditions: this.groupByCondition(relevantResults)
    };

    return {
      success: true,
      results: relevantResults.slice(0, 20), // Limit to top 20 most relevant
      summary,
      searchQuery: originalModel,
      timestamp: new Date().toISOString()
    };
  }

  // Extract numeric price from eBay price object
  extractPrice(priceObj) {
    if (!priceObj) return 0;
    if (typeof priceObj === 'number') return priceObj;
    if (typeof priceObj === 'string') return parseFloat(priceObj.replace(/[^0-9.]/g, '')) || 0;
    if (priceObj.value) return parseFloat(priceObj.value) || 0;
    return 0;
  }

  // Calculate relevance score for search results
  calculateRelevance(title, targetModel) {
    const titleLower = title.toLowerCase();
    const modelLower = targetModel.toLowerCase();
    
    // Extract key terms from target model
    const modelTerms = modelLower.split(/\s+/).filter(term => term.length > 2);
    
    let score = 0;
    let maxPossibleScore = 0;

    // Check for exact model match
    if (titleLower.includes(modelLower)) {
      score += 1.0;
    }

    // Check for individual terms
    modelTerms.forEach(term => {
      maxPossibleScore += 0.3;
      if (titleLower.includes(term)) {
        score += 0.3;
      }
    });

    // Bonus for drone-related keywords
    const droneKeywords = ['drone', 'quadcopter', 'uav', 'multirotor'];
    if (droneKeywords.some(keyword => titleLower.includes(keyword))) {
      score += 0.2;
    }

    // Penalty for irrelevant items
    const irrelevantKeywords = ['case', 'bag', 'parts', 'battery', 'charger', 'propeller', 'toy'];
    if (irrelevantKeywords.some(keyword => titleLower.includes(keyword))) {
      score -= 0.3;
    }

    return Math.max(0, Math.min(1, score / Math.max(maxPossibleScore, 1)));
  }

  // Group results by condition
  groupByCondition(results) {
    const grouped = {};
    results.forEach(item => {
      const condition = item.condition || 'Unknown';
      if (!grouped[condition]) {
        grouped[condition] = { count: 0, prices: [] };
      }
      grouped[condition].count++;
      if (item.totalPrice > 0) {
        grouped[condition].prices.push(item.totalPrice);
      }
    });

    // Calculate averages
    Object.keys(grouped).forEach(condition => {
      const prices = grouped[condition].prices;
      grouped[condition].avgPrice = prices.length > 0 
        ? prices.reduce((a, b) => a + b, 0) / prices.length 
        : 0;
      grouped[condition].priceRange = prices.length > 0 
        ? { min: Math.min(...prices), max: Math.max(...prices) }
        : { min: 0, max: 0 };
    });

    return grouped;
  }

  // Update drone model data in database with eBay pricing
  async updateDroneModelPricing(modelName) {
    try {
      const searchResults = await this.searchDroneListings(modelName, {
        condition: ['new', 'used'],
        maxResults: 100
      });

      if (!searchResults.success || searchResults.results.length === 0) {
        return { success: false, error: 'No eBay listings found' };
      }

      const { summary } = searchResults;
      
      // Calculate updated pricing data
      const newConditionData = summary.conditions['NEW'] || summary.conditions['Brand New'];
      const usedConditionData = summary.conditions['Used'] || summary.conditions['USED_EXCELLENT'];

      const updateData = {
        ebay_new_price: newConditionData?.avgPrice || null,
        ebay_used_price_min: usedConditionData?.priceRange?.min || null,
        ebay_used_price_max: usedConditionData?.priceRange?.max || null,
        ebay_listings_count: summary.totalFound,
        ebay_last_updated: new Date().toISOString(),
        ebay_price_data: searchResults
      };

      // Update in Supabase
      const result = await droneAnalysisService.saveDroneModel({
        modelName,
        ...updateData
      });

      return result;
    } catch (error) {
      console.error('Failed to update drone pricing:', error);
      return { success: false, error: error.message };
    }
  }

  // Get current API usage stats
  getUsageStats() {
    return {
      requestCount: this.requestCount,
      cacheSize: this.cache.size,
      tokenValid: this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry,
      rateLimitStatus: Date.now() - this.lastRequestTime
    };
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

// Export singleton instance
export const ebayService = new EbayPricingService();
export default ebayService;