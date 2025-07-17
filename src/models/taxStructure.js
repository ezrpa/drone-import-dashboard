export const argentineTaxes = {
  importDuty: 0.00, // 0% for drones
  statisticsFee: 0.00,
  iva: 0.105, // 10.5%
  additionalIva: 0.10, // 10%
  grossIncome: 0.03, // 3%
  advanceProfit: 0.06, // 6%
  simFee: 10
};

export const sensitivityRanges = {
  exwVariation: 0.20, // ±20% for used drone price variation
  freightVariation: 0.25, // ±25%
  exchangeVariation: 0.15, // ±15% (more realistic)
  batteryVariation: 0.30, // ±30% for battery prices
};