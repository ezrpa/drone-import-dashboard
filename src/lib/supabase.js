import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database helper functions
export const droneAnalysisService = {
  // Save analysis results
  async saveAnalysis(analysisData) {
    try {
      const { data, error } = await supabase
        .from('drone_analyses')
        .insert([
          {
            drone_model: analysisData.droneModel,
            condition: analysisData.condition,
            purchase_price: analysisData.purchasePrice,
            quantity: analysisData.quantity,
            total_cost_usd: analysisData.totalCostUSD,
            total_cost_ars: analysisData.totalCostARS,
            cost_per_drone: analysisData.costPerDrone,
            profit_per_drone: analysisData.profitPerDrone,
            total_profit: analysisData.totalProfit,
            import_advantage: analysisData.importAdvantage,
            exchange_rate: analysisData.exchangeRate,
            target_margin: analysisData.targetMargin,
            freight_multiplier: analysisData.freightMultiplier,
            challenge_multiplier: analysisData.challengeMultiplier,
            analysis_data: analysisData,
            created_at: new Date().toISOString()
          }
        ])
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error saving analysis:', error)
      return { success: false, error: error.message }
    }
  },

  // Load saved analyses
  async getAnalyses(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('drone_analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error loading analyses:', error)
      return { success: false, error: error.message }
    }
  },

  // Get analysis by ID
  async getAnalysisById(id) {
    try {
      const { data, error } = await supabase
        .from('drone_analyses')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error loading analysis:', error)
      return { success: false, error: error.message }
    }
  },

  // Delete analysis
  async deleteAnalysis(id) {
    try {
      const { error } = await supabase
        .from('drone_analyses')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error deleting analysis:', error)
      return { success: false, error: error.message }
    }
  },

  // Save drone model data
  async saveDroneModel(modelData) {
    try {
      const { data, error } = await supabase
        .from('drone_models')
        .upsert([
          {
            model_name: modelData.modelName,
            category: modelData.category,
            new_price: modelData.newPrice,
            used_price_min: modelData.usedRange[0],
            used_price_max: modelData.usedRange[1],
            camera_type: modelData.camera,
            battery_life: modelData.batteryLife,
            use_case: modelData.use,
            depreciation: modelData.depreciation,
            argentina_price_ars: modelData.argentinePriceARS,
            challenges: modelData.challenges,
            import_advantage: modelData.importAdvantage,
            model_data: modelData,
            updated_at: new Date().toISOString()
          }
        ])
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error saving drone model:', error)
      return { success: false, error: error.message }
    }
  },

  // Get all drone models
  async getDroneModels() {
    try {
      const { data, error } = await supabase
        .from('drone_models')
        .select('*')
        .order('model_name')

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error loading drone models:', error)
      return { success: false, error: error.message }
    }
  },

  // Analytics functions
  async getAnalyticsData() {
    try {
      const { data, error } = await supabase
        .from('drone_analyses')
        .select(`
          drone_model,
          cost_per_drone,
          profit_per_drone,
          import_advantage,
          created_at,
          quantity
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error loading analytics:', error)
      return { success: false, error: error.message }
    }
  }
}