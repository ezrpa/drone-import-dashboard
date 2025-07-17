import { droneModels, cameraUpgrades } from '../models/droneData';
import { argentineTaxes } from '../models/taxStructure';

export class DroneCalculationService {
  calculateCostsWithParams(params, specs) {
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
    const { freightMultiplier, challengeMultiplier } = this.calculateMultipliers(modelData, specs);
    
    const freightScaling = Math.max(0.7, Math.sqrt(params.quantity / 2));
    const adjustedFreight = params.freight * freightScaling * freightMultiplier;
    
    const fobValue = adjustedExw + adjustedInland;
    const cifValue = fobValue + adjustedFreight + params.insurance;
    
    // Calculate Argentine taxes
    const taxes = this.calculateTaxes(cifValue);
    const totalTaxes = Object.values(taxes).reduce((sum, tax) => sum + tax, 0);
    
    // Enhanced logistics costs with challenge multiplier
    const logistics = this.calculateLogistics(cifValue, modelData, challengeMultiplier);
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
      adpFee: logistics.managementFee,
      freightMultiplier,
      challengeMultiplier,
      argentinePriceUsd,
      importSavings,
      importAdvantageCalculated,
      costPerDroneWithMargin,
      profitPerDrone,
      totalProfit
    };
  }

  calculateMultipliers(modelData, specs) {
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

    return { freightMultiplier, challengeMultiplier };
  }

  calculateTaxes(cifValue) {
    return {
      importDuty: cifValue * argentineTaxes.importDuty,
      statisticsFee: cifValue * argentineTaxes.statisticsFee,
      iva: cifValue * argentineTaxes.iva,
      additionalIva: cifValue * argentineTaxes.additionalIva,
      grossIncome: cifValue * argentineTaxes.grossIncome,
      advanceProfit: cifValue * argentineTaxes.advanceProfit,
      simFee: argentineTaxes.simFee
    };
  }

  calculateLogistics(cifValue, modelData, challengeMultiplier) {
    const adpFee = Math.max(1000, cifValue * 0.07);
    const baseComplexityMultiplier = modelData.category === 'Agricultural' ? 1.5 : 
                                     modelData.category === 'Enterprise' ? 1.3 : 1.0;
    const finalComplexityMultiplier = baseComplexityMultiplier * challengeMultiplier;
    
    return {
      fiscalDeposit: 150 * finalComplexityMultiplier,
      internationalInsurance: 60,
      importClearance: 680 * finalComplexityMultiplier,
      forwardingFee: 100,
      localTransport: 150,
      ivaOnExpenses: 239.40 * finalComplexityMultiplier,
      managementFee: adpFee,
      challengeFee: (modelData.category === 'Agricultural' || modelData.category === 'Enterprise') ? 200 : 0 // Special handling
    };
  }

  generatePriceRangeAnalysis(baseParams, droneSpecs) {
    const modelData = droneModels[droneSpecs.model];
    const priceRange = droneSpecs.condition === 'Used' ? modelData.usedRange : [modelData.newPrice * 0.8, modelData.newPrice * 1.2];
    
    const pricePoints = [];
    const stepSize = (priceRange[1] - priceRange[0]) / 10;
    
    for (let i = 0; i <= 10; i++) {
      const price = priceRange[0] + (stepSize * i);
      const testSpecs = { ...droneSpecs, priceOverride: price };
      const result = this.calculateCostsWithParams(baseParams, testSpecs);
      
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
  }

  generateCostBreakdown(costs, baseParams) {
    return [
      { name: 'Drone + Upgrades', value: costs.adjustedExw, color: '#8884d8' },
      { name: 'Enhanced Freight', value: baseParams.freight * costs.freightMultiplier, color: '#82ca9d' },
      { name: 'Argentine Taxes', value: costs.totalTaxes, color: '#ffc658' },
      { name: 'ADP Services', value: costs.adpFee, color: '#ff7300' },
      { name: 'Challenge Costs', value: costs.totalLogistics - costs.adpFee, color: '#8dd1e1' }
    ];
  }

  generatePriceSensitivityByCategory(baseParams, droneSpecs) {
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
        
        const lowCost = this.calculateCostsWithParams(baseParams, lowPriceSpecs);
        const highCost = this.calculateCostsWithParams(baseParams, highPriceSpecs);
        
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
  }
}