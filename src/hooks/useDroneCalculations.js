import { useMemo } from 'react';
import { DroneCalculationService } from '../services/DroneCalculationService';
import { AlertService } from '../services/AlertService';
import { sensitivityRanges } from '../models/taxStructure';

export const useDroneCalculations = (baseParams, droneSpecs) => {
  const calculationService = useMemo(() => new DroneCalculationService(), []);
  const alertService = useMemo(() => new AlertService(), []);

  const costs = useMemo(() => {
    return calculationService.calculateCostsWithParams(baseParams, droneSpecs);
  }, [baseParams, droneSpecs, calculationService]);

  const alerts = useMemo(() => {
    return alertService.generateAlerts(costs, baseParams);
  }, [costs, baseParams, alertService]);

  const priceRangeAnalysis = useMemo(() => {
    return calculationService.generatePriceRangeAnalysis(baseParams, droneSpecs);
  }, [baseParams, droneSpecs, calculationService]);

  const costBreakdown = useMemo(() => {
    return calculationService.generateCostBreakdown(costs, baseParams);
  }, [costs, baseParams, calculationService]);

  const priceSensitivityByCategory = useMemo(() => {
    return calculationService.generatePriceSensitivityByCategory(baseParams, droneSpecs);
  }, [baseParams, droneSpecs, calculationService]);

  const tornadoSensitivityData = useMemo(() => {
    return generateTornadoSensitivityData(baseParams, droneSpecs, costs, calculationService);
  }, [baseParams, droneSpecs, costs, calculationService]);

  const recommendations = useMemo(() => {
    return alertService.getRecommendations(costs, baseParams, priceSensitivityByCategory);
  }, [costs, baseParams, priceSensitivityByCategory, alertService]);

  const riskAssessment = useMemo(() => {
    return alertService.getRiskAssessment(costs, baseParams);
  }, [costs, baseParams, alertService]);

  return {
    costs,
    alerts,
    priceRangeAnalysis,
    costBreakdown,
    priceSensitivityByCategory,
    tornadoSensitivityData,
    recommendations,
    riskAssessment
  };
};

// Helper function for tornado sensitivity analysis
const generateTornadoSensitivityData = (baseParams, droneSpecs, costs, calculationService) => {
  const baseCost = costs.totalDdpUsd;
  
  // Drone price sensitivity (used price range)
  const modelData = costs.modelData;
  const priceRange = droneSpecs.condition === 'Used' ? modelData.usedRange : [modelData.newPrice * 0.8, modelData.newPrice * 1.2];
  
  const priceLowSpecs = { ...droneSpecs, priceOverride: priceRange[0] };
  const priceHighSpecs = { ...droneSpecs, priceOverride: priceRange[1] };
  const priceLowCost = calculationService.calculateCostsWithParams(baseParams, priceLowSpecs).totalDdpUsd;
  const priceHighCost = calculationService.calculateCostsWithParams(baseParams, priceHighSpecs).totalDdpUsd;
  const priceLowImpact = (priceLowCost / baseCost - 1) * 100;
  const priceHighImpact = (priceHighCost / baseCost - 1) * 100;
  
  // Freight cost sensitivity with multipliers
  const freightLow = { ...baseParams, freight: baseParams.freight * (1 - sensitivityRanges.freightVariation) };
  const freightHigh = { ...baseParams, freight: baseParams.freight * (1 + sensitivityRanges.freightVariation) };
  const freightLowCost = calculationService.calculateCostsWithParams(freightLow, droneSpecs).totalDdpUsd;
  const freightHighCost = calculationService.calculateCostsWithParams(freightHigh, droneSpecs).totalDdpUsd;
  const freightLowImpact = (freightLowCost / baseCost - 1) * 100;
  const freightHighImpact = (freightHighCost / baseCost - 1) * 100;
  
  // Exchange rate sensitivity (affects ARS total AND import advantage)
  const exchangeLow = { ...baseParams, exchangeRate: baseParams.exchangeRate * (1 - sensitivityRanges.exchangeVariation) };
  const exchangeHigh = { ...baseParams, exchangeRate: baseParams.exchangeRate * (1 + sensitivityRanges.exchangeVariation) };
  const exchangeLowResult = calculationService.calculateCostsWithParams(exchangeLow, droneSpecs);
  const exchangeHighResult = calculationService.calculateCostsWithParams(exchangeHigh, droneSpecs);
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
};