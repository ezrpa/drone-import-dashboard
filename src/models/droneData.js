export const droneModels = {
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
  
  // Enterprise DJI Models
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
  
  // Agricultural Drones
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

export const cameraUpgrades = {
  'Standard HD': { cost: 0, quality: 'Basic', resolution: '1080p' },
  '2.7K Standard': { cost: 120, quality: 'Good', resolution: '2.7K' },
  '4K Standard': { cost: 280, quality: 'Very Good', resolution: '4K/30fps' },
  '4K HDR Pro': { cost: 450, quality: 'Excellent', resolution: '4K/60fps HDR' },
  '6K Professional': { cost: 800, quality: 'Cinema', resolution: '6K/30fps' },
  '4K AI Tracking': { cost: 600, quality: 'AI-Enhanced', resolution: '4K with AI' },
  'Thermal + RGB': { cost: 2000, quality: 'Industrial', resolution: 'Thermal + RGB' },
  'Multispectral': { cost: 3000, quality: 'Agricultural', resolution: 'Multi-band Imaging' }
};