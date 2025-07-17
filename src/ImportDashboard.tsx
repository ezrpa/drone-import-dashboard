import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ReferenceLine, ScatterChart, Scatter, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Sliders, DollarSign, Plane, Settings, TrendingUp, AlertTriangle, Target, Calculator, Award, Zap, Package, Truck, Shield, Info, HelpCircle, Bell, TrendingDown } from 'lucide-react';

const DroneImportDashboard = () => {
  // Base data from ADP Trading quote - updated exchange rate
  const [baseParams, setBaseParams] = useState({
    exwPrice: 537,
    inlandCost: 365,
    freight: 625,
    insurance: 5.37,
    quantity: 2,
    exchangeRate: 1250, // Updated current rate ARS per USD
    batteryUpgrade: 150, // New batteries
    caseUpgrade: 75, // Protective case
    targetMargin: 10, // Target profit margin %
  });

  // Drone-specific parameters
  const [droneSpecs, setDroneSpecs] = useState({
    model: 'DJI Phantom Standard',
    condition: 'Used', // New parameter for used vs new
    cameraType: 'Standard HD',
    batteryCapacity: '5350mAh',
    flightTime: 28,
    origin: 'Texas-USA',
    payloadCapacity: 300,
    priceOverride: null // Allow manual price setting
  });

  // UI state for help tooltips
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  // Sensitivity ranges for analysis
  const sensitivityRanges = {
    exwVariation: 0.20, // ±20% for used drone price variation
    freightVariation: 0.25, // ±25%
    exchangeVariation: 0.15, // ±15% (more realistic)
    batteryVariation: 0.30, // ±30% for battery prices
  };

  // Argentine tax structure
  const argentineTaxes = {
    importDuty: 0.00, // 0% for drones
    statisticsFee: 0.00,
    iva: 0.105, // 10.5%
    additionalIva: 0.10, // 10%
    grossIncome: 0.03, // 3%
    advanceProfit: 0.06, // 6%
    simFee: 10
  };

  // Comprehensive drone model database with research data + Argentina pricing context
  const droneModels = {
    // Consumer DJI Models
    'DJI Neo': { 
      newPrice: 159, usedRange: [80, 120], camera: 'Basic 4K', batteryLife: 18, 
      category: 'Entry', use: 'Beginner/Indoor', depreciation: 0.25,
      argentinePriceARS: 250000, challenges: ['Limited battery life', 'Basic features'], importAdvantage: 4.2
    },
    'DJI Mini 2 SE': { 
      newPrice: 349, usedRange: [180, 280], camera: '2.7K', batteryLife: 31, 
      category: 'Entry', use: 'Casual/Travel', depreciation: 0.20,
      argentinePriceARS: 650000, challenges: ['No obstacle avoidance'], importAdvantage: 2.8
    },
    'DJI Mini 4 Pro': { 
      newPrice: 759, usedRange: [450, 650], camera: '4K HDR', batteryLife: 34, 
      category: 'Consumer', use: 'Content Creation', depreciation: 0.15,
      argentinePriceARS: 1400000, challenges: ['Popular model - good availability'], importAdvantage: 2.5
    },
    'DJI Phantom Standard': { 
      newPrice: 537, usedRange: [250, 400], camera: 'HD', batteryLife: 28, 
      category: 'Consumer', use: 'General Purpose', depreciation: 0.30,
      argentinePriceARS: 800000, challenges: ['Older model', 'Large size'], importAdvantage: 2.4
    },
    'DJI Air 3S': { 
      newPrice: 1299, usedRange: [800, 1100], camera: 'Dual 4K', batteryLife: 45, 
      category: 'Prosumer', use: 'Professional Photo/Video', depreciation: 0.18,
      argentinePriceARS: 2200000, challenges: ['High demand', 'Complex dual camera'], importAdvantage: 2.0
    },
    'DJI Mavic 3 Pro': { 
      newPrice: 2399, usedRange: [1600, 2000], camera: '5.1K Hasselblad Triple', batteryLife: 43, 
      category: 'Professional', use: 'Cinema/Commercial', depreciation: 0.20,
      argentinePriceARS: 4500000, challenges: ['Professional market limited', 'High-end features'], importAdvantage: 2.3
    },
    'DJI Mavic 4 Pro (2025)': { 
      newPrice: 2250, usedRange: [1800, 2100], camera: '6K HDR Triple', batteryLife: 51, 
      category: 'Professional', use: 'Next-Gen Cinema', depreciation: 0.10,
      argentinePriceARS: 4200000, challenges: ['Latest model', 'Limited used availability'], importAdvantage: 2.0
    },
    
    // Enterprise DJI Models - Based on research
    'DJI Mavic 3M (Multispectral)': {
      newPrice: 5344, usedRange: [4500, 5400], camera: 'Multispectral + RGB', batteryLife: 43,
      category: 'Enterprise', use: 'Agriculture/Mapping', depreciation: 0.08,
      argentinePriceARS: 12000000, challenges: ['Agricultural import restrictions', 'Specialized sensors', 'Limited market'], importAdvantage: 2.6
    },
    'DJI Matrice 30T': {
      newPrice: 10748, usedRange: [8500, 9000], camera: 'Thermal + 48MP Zoom', batteryLife: 41,
      category: 'Enterprise', use: 'Inspection/Public Safety', depreciation: 0.15,
      argentinePriceARS: 22000000, challenges: ['Thermal camera import regulations', 'Professional certification required'], importAdvantage: 2.4
    },
    'DJI Matrice 300 RTK': {
      newPrice: 14000, usedRange: [6500, 11000], camera: 'Modular Payload', batteryLife: 55,
      category: 'Enterprise', use: 'Professional Surveying', depreciation: 0.35,
      argentinePriceARS: 28000000, challenges: ['Large size freight', 'Professional market limited', 'High depreciation'], importAdvantage: 3.2
    },
    'DJI Matrice 350 RTK': {
      newPrice: 12050, usedRange: [8000, 10000], camera: 'Enhanced Payload System', batteryLife: 55,
      category: 'Enterprise', use: 'Advanced Surveying', depreciation: 0.20,
      argentinePriceARS: 25000000, challenges: ['Latest enterprise model', 'Complex import procedures'], importAdvantage: 2.8
    },
    
    // Agricultural Drones - Based on research
    'DJI Agras T30': {
      newPrice: 15000, usedRange: [11000, 13000], camera: 'FPV + Task Camera', batteryLife: 22,
      category: 'Agricultural', use: 'Crop Spraying', depreciation: 0.25,
      argentinePriceARS: 35000000, challenges: ['Agricultural equipment import restrictions', 'SENASA approval required', 'Special freight'], importAdvantage: 2.8
    },
    'DJI Agras T40': {
      newPrice: 23259, usedRange: [18000, 21000], camera: 'Dual FPV + Task', batteryLife: 25,
      category: 'Agricultural', use: 'Large Scale Spraying', depreciation: 0.15,
      argentinePriceARS: 50000000, challenges: ['Professional agricultural license', 'Large tank capacity import', 'Specialized training'], importAdvantage: 2.4
    },
    'DJI Agras T50': {
      newPrice: 22670, usedRange: [19000, 21500], camera: 'Advanced FPV System', batteryLife: 27,
      category: 'Agricultural', use: 'Professional Agriculture', depreciation: 0.10,
      argentinePriceARS: 48000000, challenges: ['Latest agricultural tech', 'Limited used market', 'High-end features'], importAdvantage: 2.3
    },
    'Hylio AG-110': {
      newPrice: 18040, usedRange: [15000, 17000], camera: 'Navigation Camera', batteryLife: 25,
      category: 'Agricultural', use: 'Precision Agriculture', depreciation: 0.12,
      argentinePriceARS: 42000000, challenges: ['US-made premium', 'Limited brand recognition in ARG'], importAdvantage: 2.6
    },
    'Hylio AG-272': {
      newPrice: 69500, usedRange: [58000, 65000], camera: 'Professional Navigation', batteryLife: 30,
      category: 'Agricultural', use: 'Industrial Agriculture', depreciation: 0.10,
      argentinePriceARS: 150000000, challenges: ['Industrial-scale equipment', 'Complex import procedures', 'High-value declaration'], importAdvantage: 2.4
    },
    
    // Autel Alternatives (NDAA Compliant)
    'Autel EVO Nano+': { 
      newPrice: 719, usedRange: [400, 600], camera: '4K HDR', batteryLife: 28, 
      category: 'Consumer', use: 'DJI Alternative', depreciation: 0.25,
      argentinePriceARS: 1200000, challenges: ['Limited brand recognition', 'Service network'], importAdvantage: 2.2
    },
    'Autel EVO Lite+': { 
      newPrice: 1199, usedRange: [750, 1000], camera: '6K Moonlight', batteryLife: 40, 
      category: 'Prosumer', use: 'NDAA Compliant Pro', depreciation: 0.22,
      argentinePriceARS: 2000000, challenges: ['NDAA compliance premium', 'Limited service'], importAdvantage: 2.2
    },
    'Autel EVO II Dual 640T V3': {
      newPrice: 5399, usedRange: [4000, 4800], camera: 'Thermal + 8K', batteryLife: 40,
      category: 'Enterprise', use: 'Thermal Inspection', depreciation: 0.18,
      argentinePriceARS: 11000000, challenges: ['Thermal import restrictions', 'Professional market'], importAdvantage: 2.4
    },
    
    // Specialized Enterprise Platforms
    'senseFly eBee X': {
      newPrice: 30000, usedRange: [7999, 12000], camera: 'Mapping Camera', batteryLife: 90,
      category: 'Enterprise', use: 'Fixed-wing Mapping', depreciation: 0.65,
      argentinePriceARS: 25000000, challenges: ['Fixed-wing different regulations', 'Professional surveying only'], importAdvantage: 5.2
    },
    'Freefly Alta 8 Pro': {
      newPrice: 25000, usedRange: [15450, 18000], camera: 'Cinema Payload', batteryLife: 15,
      category: 'Cinema', use: 'Professional Film', depreciation: 0.30,
      argentinePriceARS: 45000000, challenges: ['Cinema market limited', 'Professional operators only'], importAdvantage: 2.8
    },
    'Skydio X2': {
      newPrice: 11000, usedRange: [8000, 9500], camera: '4K AI Navigation', batteryLife: 23,
      category: 'Enterprise', use: 'Autonomous Inspection', depreciation: 0.20,
      argentinePriceARS: 20000000, challenges: ['US government contractor origins', 'AI technology complexity'], importAdvantage: 2.3
    }
  };

  // Camera upgrade options with real market pricing
  const cameraUpgrades = {
    'Standard HD': { cost: 0, quality: 'Basic', resolution: '1080p' },
    '2.7K Standard': { cost: 120, quality: 'Good', resolution: '2.7K' },
    '4K Standard': { cost: 280, quality: 'Very Good', resolution: '4K/30fps' },
    '4K HDR Pro': { cost: 450, quality: 'Excellent', resolution: '4K/60fps HDR' },
    '6K Professional': { cost: 800, quality: 'Cinema', resolution: '6K/30fps' },
    '4K AI Tracking': { cost: 600, quality: 'AI-Enhanced', resolution: '4K with AI' },
    'Thermal + RGB': { cost: 2000, quality: 'Industrial', resolution: 'Thermal + RGB' },
    'Multispectral': { cost: 3000, quality: 'Agricultural', resolution: 'Multi-band Imaging' }
  };

  // Tooltip content for contextual help
  const tooltipContent = {
    freightMultiplier: "Different drone categories require specialized handling: Consumer (1.0x), Enterprise (1.8x), Agricultural (2.5x), Cinema (2.0x). This accounts for size, complexity, and regulatory requirements.",
    challengeMultiplier: "Import complexity factor based on regulatory requirements: Basic (1.0x), Enterprise (1.2x), Agricultural (1.3x), Thermal/Multispectral (+20%). Includes certification, special handling, and documentation.",
    adpFee: "ADP Trading management fee calculated as maximum of 7% of CIF value OR $1,000 minimum. This covers customs clearance, documentation, and local logistics coordination.",
    importAdvantage: "Cost advantage ratio comparing your import cost vs. Argentina retail price. Values >2.0x indicate strong import opportunity, >3.0x excellent deals.",
    argentineTax: "Argentine import taxes: 10.5% IVA + 10% Additional IVA + 3% Gross Income + 6% Advance Profit + $10 SIM fee. Applied to CIF value (Cost + Insurance + Freight).",
    exchangeRate: "Current USD/ARS exchange rate. Higher rates (weaker peso) improve import advantages but increase local selling prices in ARS.",
    depreciation: "Used market depreciation from new price. Enterprise drones (8-20%) hold value better than consumer models (15-30%).",
    totalLandedCost: "Complete cost to get drones delivered to Buenos Aires: Drone + Upgrades + Freight + Taxes + Logistics + ADP fees."
  };

  // Calculate costs with specific parameters including challenges
  const calculateCostsWithParams = (params, specs) => {
    const modelData = droneModels[specs.model] || droneModels['DJI Phantom Standard'];
    
    // Use manual price override or calculate from range
    let basePrice;
    if (specs.priceOverride && specs.priceOverride > 0) {
      basePrice = specs.priceOverride;
    } else {
      basePrice = specs.condition === 'Used' 
        ? (modelData.usedRange[0] + modelData.usedRange[1]) / 2 
        : modelData.newPrice;
    }
    
    const cameraUpgradeCost = cameraUpgrades[specs.cameraType]?.cost || 0;
    const batteryUpgradeCost = params.batteryUpgrade || 0;
    const caseUpgradeCost = params.caseUpgrade || 0;
    
    const adjustedExw = (basePrice + cameraUpgradeCost + batteryUpgradeCost + caseUpgradeCost) * params.quantity;
    const adjustedInland = params.inlandCost * params.quantity;
    
    // Enhanced freight calculation based on category challenges
    let freightMultiplier = 1.0;
    let challengeMultiplier = 1.0;
    
    if (modelData.category === 'Agricultural') {
      freightMultiplier = 2.5; // Special agricultural equipment handling
      challengeMultiplier = 1.3; // SENASA and agricultural import complexity
    } else if (modelData.category === 'Enterprise') {
      freightMultiplier = 1.8; // Professional equipment handling
      challengeMultiplier = 1.2; // Enterprise import documentation
    } else if (modelData.category === 'Cinema') {
      freightMultiplier = 2.0; // Professional film equipment
      challengeMultiplier = 1.15; // Specialized equipment
    }
    
    // Additional challenges for thermal/multispectral
    if (specs.cameraType === 'Thermal + RGB' || specs.cameraType === 'Multispectral') {
      challengeMultiplier *= 1.2; // Special sensor import restrictions
    }
    
    const freightScaling = Math.max(0.7, Math.sqrt(params.quantity / 2));
    const adjustedFreight = params.freight * freightScaling * freightMultiplier;
    
    const fobValue = adjustedExw + adjustedInland;
    const cifValue = fobValue + adjustedFreight + params.insurance;
    
    // Calculate Argentine taxes
    const taxes = {
      importDuty: cifValue * argentineTaxes.importDuty,
      statisticsFee: cifValue * argentineTaxes.statisticsFee,
      iva: cifValue * argentineTaxes.iva,
      additionalIva: cifValue * argentineTaxes.additionalIva,
      grossIncome: cifValue * argentineTaxes.grossIncome,
      advanceProfit: cifValue * argentineTaxes.advanceProfit,
      simFee: argentineTaxes.simFee
    };
    
    const totalTaxes = Object.values(taxes).reduce((sum, tax) => sum + tax, 0);
    
    // Enhanced logistics costs with challenge multiplier
    const adpFee = Math.max(1000, cifValue * 0.07);
    const baseComplexityMultiplier = modelData.category === 'Agricultural' ? 1.5 : 
                                     modelData.category === 'Enterprise' ? 1.3 : 1.0;
    const finalComplexityMultiplier = baseComplexityMultiplier * challengeMultiplier;
    
    const logistics = {
      fiscalDeposit: 150 * finalComplexityMultiplier,
      internationalInsurance: 60,
      importClearance: 680 * finalComplexityMultiplier,
      forwardingFee: 100,
      localTransport: 150,
      ivaOnExpenses: 239.40 * finalComplexityMultiplier,
      managementFee: adpFee,
      challengeFee: (modelData.category === 'Agricultural' || modelData.category === 'Enterprise') ? 200 : 0 // Special handling
    };
    
    const totalLogistics = Object.values(logistics).reduce((sum, cost) => sum + cost, 0);
    const totalDdpUsd = cifValue + totalTaxes + totalLogistics;
    const totalDdpArs = totalDdpUsd * params.exchangeRate;
    const costPerDrone = totalDdpUsd / params.quantity;
    
    // Calculate import advantage vs Argentina pricing
    const argentinePriceUsd = modelData.argentinePriceARS / params.exchangeRate;
    const importSavings = argentinePriceUsd - costPerDrone;
    const importAdvantageCalculated = argentinePriceUsd / costPerDrone;
    
    // Profit calculations
    const costPerDroneWithMargin = costPerDrone * (1 + params.targetMargin / 100);
    const profitPerDrone = costPerDroneWithMargin - costPerDrone;
    const totalProfit = profitPerDrone * params.quantity;
    
    return {
      adjustedExw,
      fobValue,
      cifValue,
      taxes,
      totalTaxes,
      logistics,
      totalLogistics,
      totalDdpUsd,
      totalDdpArs,
      costPerDrone,
      modelData,
      basePrice,
      adpFee,
      freightMultiplier,
      challengeMultiplier,
      argentinePriceUsd,
      importSavings,
      importAdvantageCalculated,
      costPerDroneWithMargin,
      profitPerDrone,
      totalProfit
    };
  };

  // Memoized current costs calculation
  const costs = useMemo(() => {
    return calculateCostsWithParams(baseParams, droneSpecs);
  }, [baseParams, droneSpecs]);

  // Threshold alerts
  const alerts = useMemo(() => {
    const alertList = [];
    
    if (costs.importAdvantageCalculated < 1.5) {
      alertList.push({
        type: 'warning',
        message: 'Low import advantage - consider different model or pricing',
        value: costs.importAdvantageCalculated.toFixed(1) + 'x'
      });
    }
    
    if (costs.challengeMultiplier > 1.25) {
      alertList.push({
        type: 'info',
        message: 'High complexity import - plan for extended timeline',
        value: costs.challengeMultiplier.toFixed(2) + 'x'
      });
    }
    
    if (costs.profitPerDrone < 100) {
      alertList.push({
        type: 'warning',
        message: 'Low profit margin - consider increasing target margin',
        value: '$' + costs.profitPerDrone.toFixed(0)
      });
    }
    
    if (baseParams.exchangeRate > 1400) {
      alertList.push({
        type: 'success',
        message: 'Favorable exchange rate for imports',
        value: baseParams.exchangeRate + ' ARS/USD'
      });
    }
    
    return alertList;
  }, [costs, baseParams]);

  // Supplier comparison for spider chart
  const supplierComparison = useMemo(() => {
    const suppliers = [
      {
        name: 'Current Config',
        cost: 100 - ((costs.costPerDrone - 500) / 1500) * 100,
        reliability: costs.modelData.category === 'Professional' ? 90 : 75,
        speed: costs.freightMultiplier === 1.0 ? 85 : 60,
        quality: costs.modelData.depreciation < 0.2 ? 85 : 70,
        compliance: costs.challengeMultiplier < 1.2 ? 90 : 70
      }
    ];
    
    return suppliers;
  }, [costs]);

  // Enhanced price sensitivity analysis by category
  const priceSensitivityByCategory = useMemo(() => {
    const categories = ['Entry', 'Consumer', 'Prosumer', 'Professional', 'Enterprise', 'Agricultural', 'Cinema'];
    
    return categories.map(category => {
      const categoryModels = Object.keys(droneModels).filter(model => 
        droneModels[model].category === category
      );
      
      if (categoryModels.length === 0) return null;
      
      // Calculate average sensitivity for this category
      const categoryAnalysis = categoryModels.map(model => {
        const modelData = droneModels[model];
        const priceRange = modelData.usedRange;
        const lowPrice = priceRange[0];
        const highPrice = priceRange[1];
        
        const testSpecs = { ...droneSpecs, model, condition: 'Used', priceOverride: null };
        const lowPriceSpecs = { ...testSpecs, priceOverride: lowPrice };
        const highPriceSpecs = { ...testSpecs, priceOverride: highPrice };
        
        const lowCost = calculateCostsWithParams(baseParams, lowPriceSpecs);
        const highCost = calculateCostsWithParams(baseParams, highPriceSpecs);
        
        const priceSpread = highPrice - lowPrice;
        const costSpread = highCost.costPerDrone - lowCost.costPerDrone;
        const sensitivity = priceSpread > 0 ? costSpread / priceSpread : 0;
        
        return {
          model,
          sensitivity,
          importAdvantage: modelData.importAdvantage,
          challengeCount: modelData.challenges.length,
          avgPrice: (lowPrice + highPrice) / 2,
          avgCost: (lowCost.costPerDrone + highCost.costPerDrone) / 2
        };
      });
      
      const avgSensitivity = categoryAnalysis.reduce((sum, item) => sum + item.sensitivity, 0) / categoryAnalysis.length;
      const avgImportAdvantage = categoryAnalysis.reduce((sum, item) => sum + item.importAdvantage, 0) / categoryAnalysis.length;
      const avgChallengeCount = categoryAnalysis.reduce((sum, item) => sum + item.challengeCount, 0) / categoryAnalysis.length;
      const totalModels = categoryAnalysis.length;
      
      return {
        category,
        avgSensitivity,
        avgImportAdvantage,
        avgChallengeCount,
        totalModels,
        bestModel: categoryAnalysis.reduce((best, current) => 
          current.importAdvantage > best.importAdvantage ? current : best
        ),
        models: categoryAnalysis
      };
    }).filter(Boolean);
  }, [baseParams, droneSpecs]);

  // Tornado Chart Sensitivity Analysis with challenges
  const tornadoSensitivityData = useMemo(() => {
    const baseCost = costs.totalDdpUsd;
    
    // Drone price sensitivity (used price range)
    const modelData = droneModels[droneSpecs.model];
    const priceRange = droneSpecs.condition === 'Used' ? modelData.usedRange : [modelData.newPrice * 0.8, modelData.newPrice * 1.2];
    
    const priceLowSpecs = { ...droneSpecs, priceOverride: priceRange[0] };
    const priceHighSpecs = { ...droneSpecs, priceOverride: priceRange[1] };
    const priceLowCost = calculateCostsWithParams(baseParams, priceLowSpecs).totalDdpUsd;
    const priceHighCost = calculateCostsWithParams(baseParams, priceHighSpecs).totalDdpUsd;
    const priceLowImpact = (priceLowCost / baseCost - 1) * 100;
    const priceHighImpact = (priceHighCost / baseCost - 1) * 100;
    
    // Freight cost sensitivity with multipliers
    const freightLow = { ...baseParams, freight: baseParams.freight * (1 - sensitivityRanges.freightVariation) };
    const freightHigh = { ...baseParams, freight: baseParams.freight * (1 + sensitivityRanges.freightVariation) };
    const freightLowCost = calculateCostsWithParams(freightLow, droneSpecs).totalDdpUsd;
    const freightHighCost = calculateCostsWithParams(freightHigh, droneSpecs).totalDdpUsd;
    const freightLowImpact = (freightLowCost / baseCost - 1) * 100;
    const freightHighImpact = (freightHighCost / baseCost - 1) * 100;
    
    // Exchange rate sensitivity (affects ARS total AND import advantage)
    const exchangeLow = { ...baseParams, exchangeRate: baseParams.exchangeRate * (1 - sensitivityRanges.exchangeVariation) };
    const exchangeHigh = { ...baseParams, exchangeRate: baseParams.exchangeRate * (1 + sensitivityRanges.exchangeVariation) };
    const exchangeLowResult = calculateCostsWithParams(exchangeLow, droneSpecs);
    const exchangeHighResult = calculateCostsWithParams(exchangeHigh, droneSpecs);
    const baseSavings = costs.importSavings;
    const exchangeLowSavings = exchangeLowResult.importSavings;
    const exchangeHighSavings = exchangeHighResult.importSavings;
    const exchangeLowImpact = baseSavings > 0 ? (exchangeLowSavings / baseSavings - 1) * 100 : 0;
    const exchangeHighImpact = baseSavings > 0 ? (exchangeHighSavings / baseSavings - 1) * 100 : 0;
    
    // Challenge complexity impact
    const baseChallenge = costs.challengeMultiplier;
    const challengeLow = baseChallenge * 0.8; // Reduced complexity
    const challengeHigh = baseChallenge * 1.2; // Increased complexity
    const challengeLowImpact = ((baseCost * challengeLow / baseChallenge) / baseCost - 1) * 100;
    const challengeHighImpact = ((baseCost * challengeHigh / baseChallenge) / baseCost - 1) * 100;
    
    const tornadoData = [
      {
        parameter: `${droneSpecs.model} Price Range`,
        lowImpact: Math.min(priceLowImpact, priceHighImpact),
        highImpact: Math.max(priceLowImpact, priceHighImpact),
        range: `$${priceRange[0].toLocaleString()}-$${priceRange[1].toLocaleString()}`,
        totalRange: Math.abs(priceHighImpact - priceLowImpact)
      },
      {
        parameter: 'Enhanced Freight (Category Impact)',
        lowImpact: Math.min(freightLowImpact, freightHighImpact),
        highImpact: Math.max(freightLowImpact, freightHighImpact),
        range: `±${(sensitivityRanges.freightVariation * 100).toFixed(0)}% × ${costs.freightMultiplier.toFixed(1)}x`,
        totalRange: Math.abs(freightHighImpact - freightLowImpact)
      },
      {
        parameter: 'Exchange Rate (Import Advantage)',
        lowImpact: Math.min(exchangeLowImpact, exchangeHighImpact),
        highImpact: Math.max(exchangeLowImpact, exchangeHighImpact),
        range: `±${(sensitivityRanges.exchangeVariation * 100).toFixed(0)}%`,
        totalRange: Math.abs(exchangeHighImpact - exchangeLowImpact)
      },
      {
        parameter: 'Import Challenge Complexity',
        lowImpact: Math.min(challengeLowImpact, challengeHighImpact),
        highImpact: Math.max(challengeLowImpact, challengeHighImpact),
        range: `${costs.challengeMultiplier.toFixed(2)}x multiplier`,
        totalRange: Math.abs(challengeHighImpact - challengeLowImpact)
      }
    ].sort((a, b) => b.totalRange - a.totalRange);
    
    return tornadoData;
  }, [baseParams, droneSpecs, costs]);

  // Price range analysis for current drone
  const priceRangeAnalysis = useMemo(() => {
    const modelData = droneModels[droneSpecs.model];
    const priceRange = droneSpecs.condition === 'Used' ? modelData.usedRange : [modelData.newPrice * 0.8, modelData.newPrice * 1.2];
    
    const pricePoints = [];
    const stepSize = (priceRange[1] - priceRange[0]) / 10;
    
    for (let i = 0; i <= 10; i++) {
      const price = priceRange[0] + (stepSize * i);
      const testSpecs = { ...droneSpecs, priceOverride: price };
      const result = calculateCostsWithParams(baseParams, testSpecs);
      
      pricePoints.push({
        dronePrice: Math.round(price),
        totalCostUSD: Math.round(result.totalDdpUsd),
        totalCostARS: Math.round(result.totalDdpArs),
        costPerDrone: Math.round(result.costPerDrone),
        costPerDroneWithMargin: Math.round(result.costPerDroneWithMargin),
        importSavings: Math.round(result.importSavings),
        advantageRatio: result.importAdvantageCalculated.toFixed(1)
      });
    }
    
    return pricePoints;
  }, [baseParams, droneSpecs, costs]);

  // Cost breakdown for pie chart
  const costBreakdown = useMemo(() => [
    { name: 'Drone + Upgrades', value: costs.adjustedExw, color: '#8884d8' },
    { name: 'Enhanced Freight', value: baseParams.freight * costs.freightMultiplier, color: '#82ca9d' },
    { name: 'Argentine Taxes', value: costs.totalTaxes, color: '#ffc658' },
    { name: 'ADP Services', value: costs.adpFee, color: '#ff7300' },
    { name: 'Challenge Costs', value: costs.totalLogistics - costs.adpFee, color: '#8dd1e1' }
  ], [costs, baseParams.freight]);

  // Custom Tooltip Component
  const InfoTooltip = ({ content, children }) => (
    <div className="relative inline-block">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );

  // Custom Tornado Chart Component
  const TornadoChart = ({ data }) => {
    const maxRange = Math.max(...data.map(d => Math.max(Math.abs(d.lowImpact), Math.abs(d.highImpact))));
    
    return (
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-48 text-sm text-gray-700 text-right pr-4">
              {item.parameter}
            </div>
            <div className="flex-1 relative h-8 bg-gray-100 rounded">
              {/* Center line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400"></div>
              
              {/* Low impact bar */}
              <div 
                className="absolute top-1 bottom-1 bg-blue-400 rounded-l"
                style={{
                  right: '50%',
                  width: `${(Math.abs(item.lowImpact) / maxRange) * 45}%`
                }}
              ></div>
              
              {/* High impact bar */}
              <div 
                className="absolute top-1 bottom-1 bg-blue-600 rounded-r"
                style={{
                  left: '50%',
                  width: `${(Math.abs(item.highImpact) / maxRange) * 45}%`
                }}
              ></div>
              
              {/* Labels */}
              <div className="absolute left-1 top-1 text-xs text-white font-semibold">L</div>
              <div className="absolute right-1 top-1 text-xs text-white font-semibold">H</div>
            </div>
            <div className="w-32 text-xs text-gray-500 pl-2">
              {item.range}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Help Toggle */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Plane className="text-blue-600" />
                  Enterprise Drone Import Analysis Dashboard
                </h1>
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <HelpCircle size={24} />
                </button>
              </div>
              <p className="text-gray-600 mt-2">Dallas, TX → Buenos Aires, Argentina</p>
              <p className="text-sm text-gray-500 mt-1">
                Category: {costs.modelData.category} | Condition: {droneSpecs.condition} | 
                Challenges: {costs.modelData.challenges.length} factors
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="group relative">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded cursor-help">
                    Freight Multiplier: {costs.freightMultiplier.toFixed(1)}x
                  </span>
                  {showHelp && (
                    <InfoTooltip content={tooltipContent.freightMultiplier}>
                      <Info size={14} className="inline ml-1 text-blue-600" />
                    </InfoTooltip>
                  )}
                </div>
                <div className="group relative">
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded cursor-help">
                    Challenge Factor: {costs.challengeMultiplier.toFixed(2)}x
                  </span>
                  {showHelp && (
                    <InfoTooltip content={tooltipContent.challengeMultiplier}>
                      <Info size={14} className="inline ml-1 text-orange-600" />
                    </InfoTooltip>
                  )}
                </div>
                <div className="group relative">
                  <span className={`text-xs px-2 py-1 rounded cursor-help ${costs.importAdvantageCalculated > 2 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    Import Advantage: {costs.importAdvantageCalculated.toFixed(1)}x
                  </span>
                  {showHelp && (
                    <InfoTooltip content={tooltipContent.importAdvantage}>
                      <Info size={14} className="inline ml-1 text-green-600" />
                    </InfoTooltip>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                ${costs.totalDdpUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                Total Landed Cost 
                {showHelp && (
                  <InfoTooltip content={tooltipContent.totalLandedCost}>
                    <Info size={14} className="text-gray-400" />
                  </InfoTooltip>
                )}
              </div>
              <div className="text-lg text-blue-600">
                ARS ${costs.totalDdpArs.toLocaleString('es-AR')}
              </div>
              <div className="text-sm font-semibold text-green-700 mt-1">
                Save: ${costs.importSavings.toLocaleString()} vs ARG
              </div>
              <div className="text-xs text-gray-400">
                Argentina Avg: ARS ${costs.modelData.argentinePriceARS.toLocaleString('es-AR')}
              </div>
            </div>
          </div>
        </div>

        {/* Threshold Alerts */}
        {alerts.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="text-orange-600" />
              Smart Alerts & Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.map((alert, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
                  alert.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' :
                  'bg-blue-50 border-blue-400 text-blue-800'
                }`}>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <span className="text-lg font-bold">{alert.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Key Metrics with Profit Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cost per Drone</p>
                <p className="text-xl font-bold text-gray-900">${costs.costPerDrone.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Landed cost</p>
              </div>
              <DollarSign className="text-blue-500 w-6 h-6" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">+ {baseParams.targetMargin}% Margin</p>
                <p className="text-xl font-bold text-green-600">${costs.costPerDroneWithMargin.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Selling price</p>
              </div>
              <TrendingUp className="text-green-500 w-6 h-6" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">vs ARG New Price</p>
                <p className="text-xl font-bold text-blue-600">${costs.argentinePriceUsd.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{costs.importAdvantageCalculated.toFixed(1)}x advantage</p>
              </div>
              <Package className="text-blue-500 w-6 h-6" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Import Savings</p>
                <p className="text-xl font-bold text-green-600">
                  ${costs.importSavings.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">vs Argentina retail</p>
              </div>
              <Award className="text-green-500 w-6 h-6" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profit per Drone</p>
                <p className="text-xl font-bold text-purple-600">
                  ${costs.profitPerDrone.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{baseParams.targetMargin}% margin</p>
              </div>
              <Calculator className="text-purple-500 w-6 h-6" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Profit</p>
                <p className="text-xl font-bold text-purple-600">
                  ${costs.totalProfit.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{baseParams.quantity} units</p>
              </div>
              <Target className="text-purple-500 w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Configuration Panel with Enhanced Help */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Drone Configuration */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="text-blue-600" />
              Drone Configuration
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  Drone Model
                  {showHelp && (
                    <InfoTooltip content="Select your target drone model. Each model has different freight multipliers, challenge factors, and Argentina pricing.">
                      <Info size={14} className="text-gray-400" />
                    </InfoTooltip>
                  )}
                </label>
                <select 
                  value={droneSpecs.model}
                  onChange={(e) => {
                    const selectedModel = e.target.value;
                    setDroneSpecs({
                      ...droneSpecs, 
                      model: selectedModel,
                      cameraType: droneModels[selectedModel].camera,
                      priceOverride: null
                    });
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  {Object.keys(droneModels).map(model => (
                    <option key={model} value={model}>
                      {model} - Used: ${droneModels[model].usedRange[0].toLocaleString()}-${droneModels[model].usedRange[1].toLocaleString()} 
                      ({droneModels[model].importAdvantage.toFixed(1)}x advantage)
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Category: {costs.modelData.category} | 
                  Challenges: {costs.modelData.challenges.length} | 
                  Argentina: ARS ${costs.modelData.argentinePriceARS.toLocaleString('es-AR')}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  Manual Price Override: ${droneSpecs.priceOverride || costs.basePrice}
                  {showHelp && (
                    <InfoTooltip content="Adjust the drone purchase price to test different scenarios. Green zone = below market average.">
                      <Info size={14} className="text-gray-400" />
                    </InfoTooltip>
                  )}
                </label>
                <input
                  type="range"
                  min={droneModels[droneSpecs.model].usedRange[0]}
                  max={droneModels[droneSpecs.model].usedRange[1]}
                  step="100"
                  value={droneSpecs.priceOverride || costs.basePrice}
                  onChange={(e) => setDroneSpecs({...droneSpecs, priceOverride: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Low: ${droneModels[droneSpecs.model].usedRange[0].toLocaleString()}</span>
                  <span>Current Savings: ${costs.importSavings.toLocaleString()}</span>
                  <span>High: ${droneModels[droneSpecs.model].usedRange[1].toLocaleString()}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  Target Profit Margin: {baseParams.targetMargin}%
                  {showHelp && (
                    <InfoTooltip content="Set your desired profit margin. This calculates your selling price and total profit potential.">
                      <Info size={14} className="text-gray-400" />
                    </InfoTooltip>
                  )}
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={baseParams.targetMargin}
                  onChange={(e) => setBaseParams({...baseParams, targetMargin: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5% (Low)</span>
                  <span>Profit: ${costs.profitPerDrone.toFixed(0)}/drone</span>
                  <span>50% (High)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity: {baseParams.quantity} units
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={baseParams.quantity}
                  onChange={(e) => setBaseParams({...baseParams, quantity: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Supplier Comparison Spider Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="text-purple-600" />
              Supplier Analysis
              {showHelp && (
                <InfoTooltip content="Multi-factor analysis of your current configuration across key decision criteria.">
                  <Info size={14} className="text-gray-400" />
                </InfoTooltip>
              )}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={[
                { category: 'Cost', value: 100 - ((costs.costPerDrone - 500) / 1500) * 100 },
                { category: 'Reliability', value: costs.modelData.category === 'Professional' ? 90 : 75 },
                { category: 'Speed', value: costs.freightMultiplier === 1.0 ? 85 : 60 },
                { category: 'Quality', value: costs.modelData.depreciation < 0.2 ? 85 : 70 },
                { category: 'Compliance', value: costs.challengeMultiplier < 1.2 ? 90 : 70 }
              ]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Current Config" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span>Cost Efficiency:</span>
                <span className="font-semibold">{(100 - ((costs.costPerDrone - 500) / 1500) * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Import Speed:</span>
                <span className="font-semibold">{costs.freightMultiplier === 1.0 ? '85%' : '60%'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Analysis Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Tornado Sensitivity Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Enhanced Tornado Sensitivity Analysis
              {showHelp && (
                <InfoTooltip content="Shows which factors have the biggest impact on your total cost. Longer bars = higher sensitivity.">
                  <Info size={14} className="text-gray-400" />
                </InfoTooltip>
              )}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Impact on total cost including category challenges
            </p>
            <TornadoChart data={tornadoSensitivityData} />
          </div>

          {/* Enhanced Price Range Analysis */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Profit Analysis Across Price Range
              {showHelp && (
                <InfoTooltip content="See how drone price affects your costs, selling price, and profit margins across the used market range.">
                  <Info size={14} className="text-gray-400" />
                </InfoTooltip>
              )}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={priceRangeAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dronePrice" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    `$${value.toLocaleString()}`,
                    name === 'costPerDrone' ? 'Cost per Drone' : 
                    name === 'costPerDroneWithMargin' ? `Selling Price (${baseParams.targetMargin}% margin)` :
                    'Import Savings'
                  ]}
                />
                <Area type="monotone" dataKey="costPerDrone" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Line type="monotone" dataKey="costPerDroneWithMargin" stroke="#22c55e" strokeWidth={3} name="Selling Price" />
                <Line type="monotone" dataKey="importSavings" stroke="#f59e0b" strokeWidth={2} name="Import Savings" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strategic Insights Panel */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-900 flex items-center gap-2">
            🎯 Strategic Import Analysis & Recommendations
            {showHelp && (
              <InfoTooltip content="AI-powered insights based on your current configuration and market conditions.">
                <Info size={14} className="text-blue-600" />
              </InfoTooltip>
            )}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">🏆 Best Category</h4>
              <p className="text-sm text-gray-600">
                <span className="font-bold">
                  {priceSensitivityByCategory.reduce((best, current) => 
                    current.avgImportAdvantage > best.avgImportAdvantage ? current : best
                  ).category}
                </span><br/>
                {priceSensitivityByCategory.reduce((best, current) => 
                  current.avgImportAdvantage > best.avgImportAdvantage ? current : best
                ).avgImportAdvantage.toFixed(1)}x avg advantage<br/>
                {priceSensitivityByCategory.reduce((best, current) => 
                  current.avgImportAdvantage > best.avgImportAdvantage ? current : best
                ).totalModels} models analyzed
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">💰 Your Profit Potential</h4>
              <p className="text-sm text-gray-600">
                ${costs.profitPerDrone.toFixed(0)} profit/drone<br/>
                {baseParams.targetMargin}% margin rate<br/>
                ${costs.totalProfit.toFixed(0)} total profit
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">📈 Market Position</h4>
              <p className="text-sm text-gray-600">
                {costs.basePrice < (costs.modelData.usedRange[0] + costs.modelData.usedRange[1]) / 2 ? 
                  '✅ Below market avg' : '⚠️ Above market avg'}<br/>
                Target: ${costs.basePrice.toLocaleString()}<br/>
                Range: ${costs.modelData.usedRange[0].toLocaleString()}-${costs.modelData.usedRange[1].toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">⚠️ Risk Assessment</h4>
              <p className="text-sm text-gray-600">
                Challenges: {costs.modelData.challenges.length} factors<br/>
                Complexity: {costs.challengeMultiplier.toFixed(2)}x multiplier<br/>
                {costs.challengeMultiplier < 1.2 ? '🟢 Low risk' : 
                 costs.challengeMultiplier < 1.4 ? '🟡 Medium risk' : '🟠 High risk'}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Cost Table with Enhanced Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Complete Cost Breakdown & Profit Analysis
            {showHelp && (
              <InfoTooltip content={tooltipContent.totalLandedCost}>
                <Info size={14} className="text-gray-400" />
              </InfoTooltip>
            )}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Component</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">USD</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ARS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Per Drone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Drone + Upgrades</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${costs.adjustedExw.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ARS ${(costs.adjustedExw * baseParams.exchangeRate).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(costs.adjustedExw / baseParams.quantity).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Base price + upgrades</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Enhanced Freight</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(baseParams.freight * costs.freightMultiplier).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ARS ${(baseParams.freight * costs.freightMultiplier * baseParams.exchangeRate).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${((baseParams.freight * costs.freightMultiplier) / baseParams.quantity).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{costs.freightMultiplier.toFixed(1)}x multiplier</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Argentine Taxes</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${costs.totalTaxes.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ARS ${(costs.totalTaxes * baseParams.exchangeRate).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(costs.totalTaxes / baseParams.quantity).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">IVA + Additional taxes</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ADP Management</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${costs.adpFee.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ARS ${(costs.adpFee * baseParams.exchangeRate).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(costs.adpFee / baseParams.quantity).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7% or $1000 min</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Logistics & Challenge Costs</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${(costs.totalLogistics - costs.adpFee).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ARS ${((costs.totalLogistics - costs.adpFee) * baseParams.exchangeRate).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${((costs.totalLogistics - costs.adpFee) / baseParams.quantity).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{costs.challengeMultiplier.toFixed(2)}x factor</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Total Landed Cost</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${costs.totalDdpUsd.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">ARS ${costs.totalDdpArs.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${costs.costPerDrone.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">All costs included</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-800">With {baseParams.targetMargin}% Margin</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-800">${(costs.costPerDroneWithMargin * baseParams.quantity).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-800">ARS ${(costs.costPerDroneWithMargin * baseParams.quantity * baseParams.exchangeRate).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-800">${costs.costPerDroneWithMargin.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">Selling price</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-800">Total Profit</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-800">${costs.totalProfit.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-800">ARS ${(costs.totalProfit * baseParams.exchangeRate).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-800">${costs.profitPerDrone.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">Revenue - costs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroneImportDashboard;