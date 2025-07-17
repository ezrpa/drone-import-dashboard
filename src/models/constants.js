export const tooltipContent = {
  freightMultiplier: "Different drone categories require specialized handling: Consumer (1.0x), Enterprise (1.8x), Agricultural (2.5x), Cinema (2.0x). This accounts for size, complexity, and regulatory requirements.",
  challengeMultiplier: "Import complexity factor based on regulatory requirements: Basic (1.0x), Enterprise (1.2x), Agricultural (1.3x), Thermal/Multispectral (+20%). Includes certification, special handling, and documentation.",
  adpFee: "ADP Trading management fee calculated as maximum of 7% of CIF value OR $1,000 minimum. This covers customs clearance, documentation, and local logistics coordination.",
  importAdvantage: "Cost advantage ratio comparing your import cost vs. Argentina retail price. Values >2.0x indicate strong import opportunity, >3.0x excellent deals.",
  argentineTax: "Argentine import taxes: 10.5% IVA + 10% Additional IVA + 3% Gross Income + 6% Advance Profit + $10 SIM fee. Applied to CIF value (Cost + Insurance + Freight).",
  exchangeRate: "Current USD/ARS exchange rate. Higher rates (weaker peso) improve import advantages but increase local selling prices in ARS.",
  depreciation: "Used market depreciation from new price. Enterprise drones (8-20%) hold value better than consumer models (15-30%).",
  totalLandedCost: "Complete cost to get drones delivered to Buenos Aires: Drone + Upgrades + Freight + Taxes + Logistics + ADP fees."
};

export const defaultParams = {
  exwPrice: 537,
  inlandCost: 365,
  freight: 625,
  insurance: 5.37,
  quantity: 2,
  exchangeRate: 1250,
  batteryUpgrade: 150,
  caseUpgrade: 75,
  targetMargin: 10,
};

export const defaultSpecs = {
  model: 'DJI Phantom Standard',
  condition: 'Used',
  cameraType: 'Standard HD',
  batteryCapacity: '5350mAh',
  flightTime: 28,
  origin: 'Texas-USA',
  payloadCapacity: 300,
  priceOverride: null
};