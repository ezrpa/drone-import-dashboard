import React, { useState } from 'react';
import { LineChart, Line } from 'recharts';
import { droneModels } from '../models/droneData';
import { defaultParams, defaultSpecs, tooltipContent } from '../models/constants';
import { useDroneCalculations } from '../hooks/useDroneCalculations';
import { 
  DashboardHeader, 
  AlertsPanel, 
  KeyMetrics, 
  ConfigurationPanel, 
  SupplierAnalysis, 
  PriceRangeChart, 
  CostBreakdownChart, 
  StrategicInsights,
  TornadoChart,
  InfoTooltip
} from './ui';

const DroneImportDashboard = () => {
  const [baseParams, setBaseParams] = useState(defaultParams);
  const [droneSpecs, setDroneSpecs] = useState(defaultSpecs);
  const [showHelp, setShowHelp] = useState(false);

  const {
    costs,
    alerts,
    priceRangeAnalysis,
    costBreakdown,
    priceSensitivityByCategory,
    tornadoSensitivityData,
    recommendations,
    riskAssessment
  } = useDroneCalculations(baseParams, droneSpecs);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <DashboardHeader 
          costs={costs} 
          droneSpecs={droneSpecs}
          showHelp={showHelp} 
          setShowHelp={setShowHelp} 
          tooltipContent={tooltipContent}
        />

        {/* Alerts */}
        <AlertsPanel alerts={alerts} />

        {/* Key Metrics */}
        <KeyMetrics costs={costs} baseParams={baseParams} />

        {/* Configuration Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ConfigurationPanel 
            droneSpecs={droneSpecs}
            setDroneSpecs={setDroneSpecs}
            baseParams={baseParams}
            setBaseParams={setBaseParams}
            costs={costs}
            showHelp={showHelp}
            droneModels={droneModels}
          />

          <SupplierAnalysis costs={costs} showHelp={showHelp} />
        </div>

        {/* Analysis Charts */}
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

          <PriceRangeChart 
            priceRangeAnalysis={priceRangeAnalysis} 
            baseParams={baseParams} 
            showHelp={showHelp} 
          />
        </div>

        {/* Strategic Insights */}
        <StrategicInsights 
          costs={costs} 
          baseParams={baseParams} 
          priceSensitivityByCategory={priceSensitivityByCategory} 
          showHelp={showHelp} 
        />

        {/* Cost Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CostBreakdownChart costBreakdown={costBreakdown} showHelp={showHelp} />

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Category Analysis Summary
              {showHelp && (
                <InfoTooltip content="Overview of import advantages across different drone categories.">
                  <Info size={14} className="text-gray-400" />
                </InfoTooltip>
              )}
            </h3>
            <div className="space-y-3">
              {priceSensitivityByCategory.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">{category.category}</div>
                    <div className="text-sm text-gray-600">{category.totalModels} models</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${category.avgImportAdvantage > 2.5 ? 'text-green-600' : 'text-blue-600'}`}>
                      {category.avgImportAdvantage.toFixed(1)}x
                    </div>
                    <div className="text-xs text-gray-500">avg advantage</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Cost Table */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USD</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ARS</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per Drone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Base Drone Cost ({droneSpecs.condition})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${costs.basePrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(costs.basePrice * baseParams.exchangeRate).toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${costs.basePrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {droneSpecs.model} - {costs.modelData.category}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Enhanced Freight ({costs.freightMultiplier.toFixed(1)}x)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(baseParams.freight * costs.freightMultiplier).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(baseParams.freight * costs.freightMultiplier * baseParams.exchangeRate).toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(baseParams.freight * costs.freightMultiplier / baseParams.quantity).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Category-specific handling
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Argentine Taxes (29.5% total)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${costs.totalTaxes.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(costs.totalTaxes * baseParams.exchangeRate).toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(costs.totalTaxes / baseParams.quantity).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    IVA + Additional IVA + Gross Income + Advance Profit
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ADP Management Fee
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${costs.adpFee.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(costs.adpFee * baseParams.exchangeRate).toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(costs.adpFee / baseParams.quantity).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Max(7% CIF, $1000 minimum)
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Challenge Logistics ({costs.challengeMultiplier.toFixed(2)}x)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${(costs.totalLogistics - costs.adpFee).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${((costs.totalLogistics - costs.adpFee) * baseParams.exchangeRate).toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${((costs.totalLogistics - costs.adpFee) / baseParams.quantity).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Complexity multiplier applied
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    Total Landed Cost (DDP)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    ${costs.totalDdpUsd.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    ${costs.totalDdpArs.toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    ${costs.costPerDrone.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Complete import cost
                  </td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-900">
                    + {baseParams.targetMargin}% Profit Margin
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-900">
                    ${costs.totalProfit.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-900">
                    ${(costs.totalProfit * baseParams.exchangeRate).toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-900">
                    ${costs.profitPerDrone.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Target selling price
                  </td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">
                    Import Advantage vs ARG
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">
                    ${(costs.importSavings * baseParams.quantity).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">
                    ${(costs.importSavings * baseParams.quantity * baseParams.exchangeRate).toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">
                    ${costs.importSavings.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {costs.importAdvantageCalculated.toFixed(1)}x cost advantage
                  </td>
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