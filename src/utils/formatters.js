
/**
 * Format currency values with proper localization
 */
export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format numbers with thousands separators
 */
export const formatNumber = (value, minimumFractionDigits = 0, maximumFractionDigits = 2) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
};

/**
 * Format percentage values
 */
export const formatPercentage = (value, decimals = 1) => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format Argentine peso values
 */
export const formatARS = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format compact numbers for large values
 */
export const formatCompact = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

/**
 * Format multiplier values
 */
export const formatMultiplier = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}x`;
};

/**
 * Format drone model display name
 */
export const formatDroneModel = (model, modelData) => {
  return `${model} (${modelData.category} - ${formatCurrency(modelData.usedRange[0])}-${formatCurrency(modelData.usedRange[1])})`;
};

/**
 * Format risk level with color coding
 */
export const formatRiskLevel = (riskScore) => {
  if (riskScore >= 70) return { level: 'High', color: 'red' };
  if (riskScore >= 40) return { level: 'Medium', color: 'yellow' };
  return { level: 'Low', color: 'green' };
};

/**
 * Format time duration
 */
export const formatDuration = (minutes) => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
};