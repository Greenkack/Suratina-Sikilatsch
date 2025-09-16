// API Types - matching backend Pydantic models

export interface CustomerData {
  customer_id?: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
}

export interface PVDetails {
  anlage_kwp: number
  annual_consumption_kwh: number
  storage_kwh?: number
  roof_orientation?: string
  roof_tilt?: number
  location?: string
  location_lat?: number
  location_lon?: number
  module_type?: string
  inverter_type?: string
}

export interface HPDetails {
  heat_demand_kwh: number
  hp_power_kw: number
  cop_value?: number
  hp_type?: string
  installation_type?: string
  existing_heating?: string
}

export interface ProjectDetails {
  project_id?: number
  project_name: string
  project_type: 'pv' | 'hp' | 'combined'
  status?: string
  created_at?: string
  notes?: string
}

export interface ProjectData {
  customer_data: CustomerData
  pv_details?: PVDetails
  hp_details?: HPDetails
  project_details: ProjectDetails
}

export interface CalculationResults {
  // Basis-Kennzahlen
  anlage_kwp?: number
  annual_pv_production_kwh?: number
  
  // Investition und Kosten
  base_matrix_price_netto?: number
  total_additional_costs_netto?: number
  subtotal_netto?: number
  total_investment_netto?: number
  mwst_summe?: number
  total_investment_brutto?: number
  
  // Einsparungen und Wirtschaftlichkeit
  annual_savings?: number
  payback_time_years?: number
  roi_percent?: number
  npv_20_years?: number
  
  // Autarkie und Eigenverbrauch
  self_consumption_rate?: number
  autarky_rate?: number
  
  // Umwelt
  co2_savings_kg_per_year?: number
  
  // Einspeisevergütung
  feed_in_tariff_ct_per_kwh?: number
  annual_feed_in_revenue?: number
  
  // Zusätzliche Berechnungen
  extra_data?: Record<string, any>
}

export interface CalculationRequest {
  project_data: ProjectData
  calculation_type: 'pv' | 'hp' | 'combined'
  include_extended_analysis?: boolean
  include_scenarios?: boolean
}

export interface CalculationResponse {
  calculation_results: CalculationResults
  status: string
  errors: string[]
  warnings: string[]
  calculation_type: string
}

export interface PDFOptions {
  include_main_template?: boolean
  append_additional_pages?: boolean
  include_charts?: boolean
  include_technical_details?: boolean
  include_economic_analysis?: boolean
  language?: string
  template_style?: string
}

export interface PDFGenerationRequest {
  project_data: ProjectData
  calculation_results?: CalculationResults
  pdf_options?: PDFOptions
  offer_type: 'pv' | 'hp'
}

export interface PDFGenerationResponse {
  task_id: string
  status: string
  message: string
  estimated_completion_time?: number
}

export interface PDFStatusResponse {
  task_id: string
  status: 'PENDING' | 'STARTED' | 'PROGRESS' | 'SUCCESS' | 'FAILURE'
  progress?: number
  current_step?: string
  result?: string
  error?: string
}

export interface CompanyInfo {
  name: string
  address: string
  contact_email: string
  contact_phone: string
  website?: string
  logo_path?: string
  tax_number?: string
  vat_id?: string
}

export interface ProductInfo {
  product_id?: number
  name: string
  category: string
  manufacturer?: string
  model?: string
  price: number
  specifications: Record<string, any>
  datasheet_path?: string
  image_path?: string
  is_active?: boolean
}

export interface Customer {
  id?: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  created_at?: string
  status?: string
}

export interface Project {
  id?: number
  customer_id: number
  project_name: string
  status?: string
  offer_type: 'pv' | 'hp' | 'combined'
  notes?: string
  created_at?: string
  last_updated?: string
}

export interface CustomerDocument {
  id?: number
  customer_id: number
  project_id?: number
  path: string
  label?: string
  document_type?: string
  created_at?: string
}

export interface ChartData {
  chart_type: string
  title: string
  data: any[]
  config?: Record<string, any>
}

export interface AnalysisRequest {
  project_data: ProjectData
  calculation_results: CalculationResults
  analysis_type: 'standard' | 'extended' | 'co2' | 'charts' | 'sensitivity'
}

export interface AnalysisResponse {
  analysis_data: Record<string, any>
  charts?: ChartData[]
  status: string
  analysis_type: string
}

export interface ErrorResponse {
  error: string
  detail?: string
  error_code?: string
}

export interface SuccessResponse {
  message: string
  data?: Record<string, any>
  timestamp?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

// Live pricing for real-time updates
export interface LivePricing {
  base_cost: number
  total_discounts: number
  total_surcharges: number
  final_price: number
  discount_percentage?: number
  surcharge_percentage?: number
}

// Task tracking
export interface TaskStatus {
  task_id: string
  status: string
  progress?: number
  message?: string
  result?: any
  error?: string
  created_at?: string
  updated_at?: string
}

// Admin settings
export interface AdminSettings {
  price_matrix_status?: string
  feed_in_tariffs?: Record<string, any>
  default_parameters?: Record<string, any>
  vat_rate?: number
  company_settings?: Record<string, any>
}

// Chart.js compatible chart data
export interface ChartJSData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    fill?: boolean
  }[]
}

// Key figures for dashboard display
export interface KeyFigure {
  title: string
  value: number
  unit: string
  icon: string
  color: string
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
}

// Form validation
export interface ValidationError {
  field: string
  message: string
  value?: any
}

// File upload
export interface FileUpload {
  file: File
  name: string
  type: string
  size: number
}

// Navigation and routing
export interface RouteInfo {
  name: string
  path: string
  title: string
  description?: string
  icon?: string
  meta?: Record<string, any>
}

// Notification types
export interface Notification {
  id?: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message?: string
  timeout?: number
  actions?: {
    label: string
    action: () => void
  }[]
}

// API response wrapper
export interface ApiResponse<T = any> {
  data?: T
  error?: ErrorResponse
  status: number
  message?: string
}