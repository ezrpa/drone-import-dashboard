export class AlertService {
  generateAlerts(costs, baseParams) {
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
    
    if (costs.importSavings > 500) {
      alertList.push({
        type: 'success',
        message: 'Excellent import opportunity - high savings potential',
        value: '$' + costs.importSavings.toFixed(0) + ' saved'
      });
    }
    
    if (costs.modelData.category === 'Agricultural' && costs.challengeMultiplier > 1.3) {
      alertList.push({
        type: 'info',
        message: 'Agricultural drones require SENASA approval - factor in 2-4 weeks',
        value: 'Regulatory'
      });
    }
    
    if (costs.freightMultiplier > 2.0) {
      alertList.push({
        type: 'warning',
        message: 'High freight costs due to specialized handling requirements',
        value: costs.freightMultiplier.toFixed(1) + 'x'
      });
    }
    
    return alertList;
  }

  getRecommendations(costs, baseParams, priceSensitivityByCategory) {
    const recommendations = [];
    
    // Best category recommendation
    if (priceSensitivityByCategory && priceSensitivityByCategory.length > 0) {
      const bestCategory = priceSensitivityByCategory.reduce((best, current) => 
        current.avgImportAdvantage > best.avgImportAdvantage ? current : best
      );
      
      if (bestCategory.category !== costs.modelData.category) {
        recommendations.push({
          type: 'suggestion',
          title: 'Consider Category Switch',
          message: `${bestCategory.category} drones offer ${bestCategory.avgImportAdvantage.toFixed(1)}x average import advantage vs your current ${costs.importAdvantageCalculated.toFixed(1)}x`,
          action: 'explore_category',
          data: bestCategory
        });
      }
    }
    
    // Price optimization
    if (costs.basePrice > (costs.modelData.usedRange[0] + costs.modelData.usedRange[1]) / 2) {
      const targetPrice = costs.modelData.usedRange[0] + (costs.modelData.usedRange[1] - costs.modelData.usedRange[0]) * 0.3;
      recommendations.push({
        type: 'optimization',
        title: 'Price Optimization',
        message: `Target price around $${targetPrice.toFixed(0)} for better margins`,
        action: 'adjust_price',
        data: { targetPrice }
      });
    }
    
    // Quantity scaling
    if (baseParams.quantity < 5 && costs.importAdvantageCalculated > 2.0) {
      recommendations.push({
        type: 'scaling',
        title: 'Scale for Better Economics',
        message: 'Consider increasing quantity to improve freight scaling and unit economics',
        action: 'increase_quantity',
        data: { suggestedQuantity: Math.min(baseParams.quantity + 2, 5) }
      });
    }
    
    return recommendations;
  }

  getRiskAssessment(costs, baseParams) {
    let riskScore = 0;
    const risks = [];
    
    // Financial risks
    if (costs.importAdvantageCalculated < 1.5) {
      riskScore += 30;
      risks.push({
        category: 'Financial',
        risk: 'Low import advantage',
        impact: 'High',
        mitigation: 'Find better pricing or different model'
      });
    }
    
    if (costs.profitPerDrone < 100) {
      riskScore += 25;
      risks.push({
        category: 'Financial',
        risk: 'Low profit margins',
        impact: 'Medium',
        mitigation: 'Increase target margin or reduce costs'
      });
    }
    
    // Operational risks
    if (costs.challengeMultiplier > 1.3) {
      riskScore += 20;
      risks.push({
        category: 'Operational',
        risk: 'High import complexity',
        impact: 'Medium',
        mitigation: 'Plan for extended timelines and additional documentation'
      });
    }
    
    if (costs.modelData.category === 'Agricultural') {
      riskScore += 15;
      risks.push({
        category: 'Regulatory',
        risk: 'SENASA approval required',
        impact: 'Medium',
        mitigation: 'Ensure proper agricultural equipment documentation'
      });
    }
    
    // Market risks
    if (baseParams.exchangeRate < 1200) {
      riskScore += 10;
      risks.push({
        category: 'Market',
        risk: 'Unfavorable exchange rate',
        impact: 'Low',
        mitigation: 'Monitor exchange rates for better timing'
      });
    }
    
    let riskLevel = 'Low';
    if (riskScore > 50) riskLevel = 'High';
    else if (riskScore > 25) riskLevel = 'Medium';
    
    return {
      score: riskScore,
      level: riskLevel,
      risks,
      summary: `Overall risk level: ${riskLevel} (${riskScore}/100)`
    };
  }
}