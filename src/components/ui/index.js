import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ReferenceLine, ScatterChart, Scatter, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Sliders, DollarSign, Plane, Settings, TrendingUp, AlertTriangle, Target, Calculator, Award, Zap, Package, Truck, Shield, Info, HelpCircle, Bell, TrendingDown } from 'lucide-react';

// Custom Tooltip Component
export const InfoTooltip = ({ content, children }) => (
  <div className="relative inline-block">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
      {content}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

// Custom Tornado Chart Component
export const TornadoChart = ({ data }) => {
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

// Header Component
export const DashboardHeader = ({ costs, droneSpecs, showHelp, setShowHelp, tooltipContent }) => (
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
);

// Alerts Component
export const AlertsPanel = ({ alerts }) => {
  if (alerts.length === 0) return null;

  return (
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
  );
};

// Key Metrics Component
export const KeyMetrics = ({ costs, baseParams }) => (
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
);

// Configuration Panel Component
export const ConfigurationPanel = ({ 
  droneSpecs, 
  setDroneSpecs, 
  baseParams, 
  setBaseParams, 
  costs, 
  showHelp, 
  droneModels 
}) => (
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
);

// Supplier Analysis Component
export const SupplierAnalysis = ({ costs, showHelp }) => (
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
);

// Price Range Analysis Chart
export const PriceRangeChart = ({ priceRangeAnalysis, baseParams, showHelp }) => (
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
            `${value.toLocaleString()}`,
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
);

// Cost Breakdown Chart
export const CostBreakdownChart = ({ costBreakdown, showHelp }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
      Cost Distribution Analysis
      {showHelp && (
        <InfoTooltip content="Visual breakdown of where your money goes in the import process.">
          <Info size={14} className="text-gray-400" />
        </InfoTooltip>
      )}
    </h3>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={costBreakdown}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {costBreakdown.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

// Strategic Insights Panel
export const StrategicInsights = ({ costs, baseParams, priceSensitivityByCategory, showHelp }) => (
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
);