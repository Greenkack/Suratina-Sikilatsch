import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CalculationResults } from '@/types/api'

export const useCalculationStore = defineStore('calculation', () => {
  // Calculation state
  const results = ref<CalculationResults | null>(null)
  const isCalculating = ref(false)
  const lastCalculationTime = ref<Date | null>(null)
  const calculationErrors = ref<string[]>([])
  const calculationWarnings = ref<string[]>([])
  
  // Live pricing for sidebar preview (similar to original Streamlit live preview)
  const livePricing = ref({
    base_cost: 0,
    total_discounts: 0,
    total_surcharges: 0,
    final_price: 0
  })
  
  // Scenarios
  const scenarios = ref<{
    base?: CalculationResults
    optimistic?: CalculationResults
    pessimistic?: CalculationResults
  }>({})
  
  // Extended analysis data
  const extendedAnalysis = ref<any>(null)
  const chartData = ref<any[]>([])
  
  // Computed
  const hasResults = computed(() => results.value !== null)
  
  const totalInvestment = computed(() => {
    return results.value?.total_investment_brutto || 0
  })
  
  const annualSavings = computed(() => {
    return results.value?.annual_savings || 0
  })
  
  const paybackTime = computed(() => {
    return results.value?.payback_time_years || 0
  })
  
  const systemSize = computed(() => {
    return results.value?.anlage_kwp || 0
  })
  
  const annualProduction = computed(() => {
    return results.value?.annual_pv_production_kwh || 0
  })
  
  const selfConsumptionRate = computed(() => {
    return results.value?.self_consumption_rate || 0
  })
  
  const autarkyRate = computed(() => {
    return results.value?.autarky_rate || 0
  })
  
  const co2Savings = computed(() => {
    return results.value?.co2_savings_kg_per_year || 0
  })
  
  const isCalculationValid = computed(() => {
    return hasResults.value && 
           totalInvestment.value > 0 && 
           calculationErrors.value.length === 0
  })
  
  // Actions
  const setResults = (newResults: CalculationResults) => {
    results.value = newResults
    lastCalculationTime.value = new Date()
    
    // Update live pricing with base values
    if (newResults.total_investment_brutto) {
      livePricing.value.base_cost = newResults.total_investment_brutto
      livePricing.value.final_price = newResults.total_investment_brutto
    }
  }
  
  const setCalculating = (calculating: boolean) => {
    isCalculating.value = calculating
    if (calculating) {
      calculationErrors.value = []
      calculationWarnings.value = []
    }
  }
  
  const setErrors = (errors: string[]) => {
    calculationErrors.value = errors
  }
  
  const setWarnings = (warnings: string[]) => {
    calculationWarnings.value = warnings
  }
  
  const updateLivePricing = (pricing: {
    base_cost?: number
    total_discounts?: number
    total_surcharges?: number
    final_price?: number
  }) => {
    livePricing.value = { ...livePricing.value, ...pricing }
  }
  
  const setScenarios = (scenarioData: {
    base?: CalculationResults
    optimistic?: CalculationResults
    pessimistic?: CalculationResults
  }) => {
    scenarios.value = scenarioData
  }
  
  const setExtendedAnalysis = (analysis: any) => {
    extendedAnalysis.value = analysis
  }
  
  const setChartData = (charts: any[]) => {
    chartData.value = charts
  }
  
  const clearResults = () => {
    results.value = null
    lastCalculationTime.value = null
    calculationErrors.value = []
    calculationWarnings.value = []
    scenarios.value = {}
    extendedAnalysis.value = null
    chartData.value = []
    
    livePricing.value = {
      base_cost: 0,
      total_discounts: 0,
      total_surcharges: 0,
      final_price: 0
    }
  }
  
  // Key figures for display (similar to original KPI displays)
  const getKeyFigures = computed(() => {
    if (!results.value) return []
    
    return [
      {
        title: 'Anlagengröße',
        value: systemSize.value,
        unit: 'kWp',
        icon: 'mdi-solar-panel',
        color: 'solar'
      },
      {
        title: 'Jahresproduktion',
        value: annualProduction.value,
        unit: 'kWh',
        icon: 'mdi-lightning-bolt',
        color: 'warning'
      },
      {
        title: 'Investition',
        value: totalInvestment.value,
        unit: '€',
        icon: 'mdi-currency-eur',
        color: 'primary'
      },
      {
        title: 'Jährl. Einsparung',
        value: annualSavings.value,
        unit: '€',
        icon: 'mdi-piggy-bank',
        color: 'success'
      },
      {
        title: 'Amortisation',
        value: paybackTime.value,
        unit: 'Jahre',
        icon: 'mdi-calendar-clock',
        color: 'info'
      },
      {
        title: 'Eigenverbrauch',
        value: selfConsumptionRate.value,
        unit: '%',
        icon: 'mdi-home-lightning-bolt',
        color: 'orange'
      },
      {
        title: 'Autarkiegrad',
        value: autarkyRate.value,
        unit: '%',
        icon: 'mdi-battery-charging',
        color: 'green'
      },
      {
        title: 'CO₂-Einsparung',
        value: co2Savings.value,
        unit: 'kg/Jahr',
        icon: 'mdi-leaf',
        color: 'success'
      }
    ]
  })
  
  return {
    // State
    results,
    isCalculating,
    lastCalculationTime,
    calculationErrors,
    calculationWarnings,
    livePricing,
    scenarios,
    extendedAnalysis,
    chartData,
    
    // Computed
    hasResults,
    totalInvestment,
    annualSavings,
    paybackTime,
    systemSize,
    annualProduction,
    selfConsumptionRate,
    autarkyRate,
    co2Savings,
    isCalculationValid,
    getKeyFigures,
    
    // Actions
    setResults,
    setCalculating,
    setErrors,
    setWarnings,
    updateLivePricing,
    setScenarios,
    setExtendedAnalysis,
    setChartData,
    clearResults
  }
})