import axios, { AxiosInstance, AxiosResponse } from 'axios'
import type {
  ProjectData,
  CalculationRequest,
  CalculationResponse,
  PDFGenerationRequest,
  PDFGenerationResponse,
  PDFStatusResponse,
  CompanyInfo,
  ProductInfo,
  Customer,
  Project,
  AnalysisRequest,
  AnalysisResponse,
  AdminSettings,
  ApiResponse
} from '@/types/api'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8000/api',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 seconds
    })

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
        return config
      },
      (error) => {
        console.error('API Request Error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`)
        return response
      },
      (error) => {
        console.error('API Response Error:', error)
        
        // Handle common error cases
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Backend nicht erreichbar. Bitte Backend starten.')
        }
        
        if (error.response?.status === 422) {
          throw new Error('Validierungsfehler: ' + (error.response.data?.detail || 'Ungültige Daten'))
        }
        
        if (error.response?.status >= 500) {
          throw new Error('Serverfehler: ' + (error.response.data?.detail || 'Unbekannter Fehler'))
        }
        
        return Promise.reject(error)
      }
    )
  }

  // Project Management
  async saveProject(projectData: ProjectData): Promise<{ project_id: number; message: string }> {
    const response = await this.api.post('/project', projectData)
    return response.data
  }

  async getProject(projectId: number): Promise<{ project_data: ProjectData }> {
    const response = await this.api.get(`/project/${projectId}`)
    return response.data
  }

  async listProjects(limit = 50, offset = 0): Promise<{ projects: any[] }> {
    const response = await this.api.get('/projects', {
      params: { limit, offset }
    })
    return response.data
  }

  // Calculations
  async calculateProject(request: CalculationRequest): Promise<CalculationResponse> {
    const response = await this.api.post('/calculate', request)
    return response.data
  }

  async calculateQuick(projectData: ProjectData): Promise<{ quick_results: any; status: string }> {
    const response = await this.api.post('/calculate_quick', { project_data: projectData })
    return response.data
  }

  async calculateLivePricing(data: any): Promise<{ live_pricing: any; timestamp: string }> {
    const response = await this.api.post('/live_pricing', data)
    return response.data
  }

  async calculateScenarios(request: CalculationRequest): Promise<{ scenarios: any; status: string }> {
    const response = await this.api.post('/scenarios', request)
    return response.data
  }

  // PDF Generation
  async generatePDF(request: PDFGenerationRequest): Promise<PDFGenerationResponse> {
    const response = await this.api.post('/generate_pdf', request)
    return response.data
  }

  async getPDFStatus(taskId: string): Promise<PDFStatusResponse> {
    const response = await this.api.get(`/task_status/${taskId}`)
    return response.data
  }

  async downloadPDF(taskId: string): Promise<Blob> {
    const response = await this.api.get(`/download_pdf/${taskId}`, {
      responseType: 'blob'
    })
    return response.data
  }

  async generateMultiPDF(data: any): Promise<{ task_id: string; status: string }> {
    const response = await this.api.post('/generate_multi_pdf', data)
    return response.data
  }

  // Analysis
  async generateAnalysis(request: AnalysisRequest): Promise<AnalysisResponse> {
    const response = await this.api.post('/analysis', request)
    return response.data
  }

  async generateCharts(request: AnalysisRequest): Promise<{ charts: any[]; status: string }> {
    const response = await this.api.post('/charts', request)
    return response.data
  }

  async calculateCO2Analysis(request: AnalysisRequest): Promise<{ co2_analysis: any; status: string }> {
    const response = await this.api.post('/co2_analysis', request)
    return response.data
  }

  async calculateSensitivity(request: AnalysisRequest): Promise<{ sensitivity_analysis: any; status: string }> {
    const response = await this.api.post('/sensitivity_analysis', request)
    return response.data
  }

  // Admin Panel
  async getCompanyInfo(): Promise<{ company_info: CompanyInfo }> {
    const response = await this.api.get('/company_info')
    return response.data
  }

  async saveCompanyInfo(company: CompanyInfo): Promise<{ message: string; result: any }> {
    const response = await this.api.post('/company_info', company)
    return response.data
  }

  async listProducts(category?: string): Promise<{ products: ProductInfo[] }> {
    const response = await this.api.get('/products', {
      params: category ? { category } : {}
    })
    return response.data
  }

  async addProduct(product: ProductInfo): Promise<{ message: string; product_id: number }> {
    const response = await this.api.post('/products', product)
    return response.data
  }

  async getProduct(productId: number): Promise<{ product: ProductInfo }> {
    const response = await this.api.get(`/products/${productId}`)
    return response.data
  }

  async updateProduct(productId: number, product: ProductInfo): Promise<{ message: string; result: any }> {
    const response = await this.api.put(`/products/${productId}`, product)
    return response.data
  }

  async deleteProduct(productId: number): Promise<{ message: string; result: any }> {
    const response = await this.api.delete(`/products/${productId}`)
    return response.data
  }

  async uploadPriceMatrix(file: File): Promise<{ message: string; result: any }> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await this.api.post('/upload_price_matrix', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  async getAdminSettings(): Promise<{ settings: AdminSettings }> {
    const response = await this.api.get('/settings')
    return response.data
  }

  async saveAdminSettings(settings: AdminSettings): Promise<{ message: string }> {
    const response = await this.api.post('/settings', settings)
    return response.data
  }

  async uploadLogo(file: File): Promise<{ message: string; logo_path: string }> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await this.api.post('/upload_logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }

  // CRM
  async listCustomers(limit = 50, offset = 0): Promise<{ customers: Customer[] }> {
    const response = await this.api.get('/customers', {
      params: { limit, offset }
    })
    return response.data
  }

  async createCustomer(customer: Customer): Promise<{ message: string; customer_id: number }> {
    const response = await this.api.post('/customers', customer)
    return response.data
  }

  async getCustomer(customerId: number): Promise<{ customer: Customer }> {
    const response = await this.api.get(`/customers/${customerId}`)
    return response.data
  }

  async updateCustomer(customerId: number, customer: Customer): Promise<{ message: string; result: any }> {
    const response = await this.api.put(`/customers/${customerId}`, customer)
    return response.data
  }

  async getCustomerProjects(customerId: number): Promise<{ projects: Project[] }> {
    const response = await this.api.get(`/customers/${customerId}/projects`)
    return response.data
  }

  async createProject(project: Project): Promise<{ message: string; project_id: number }> {
    const response = await this.api.post('/projects', project)
    return response.data
  }

  async getProjectById(projectId: number): Promise<{ project: Project }> {
    const response = await this.api.get(`/projects/${projectId}`)
    return response.data
  }

  async updateProject(projectId: number, project: Project): Promise<{ message: string; result: any }> {
    const response = await this.api.put(`/projects/${projectId}`, project)
    return response.data
  }

  async getPipeline(): Promise<{ pipeline: any }> {
    const response = await this.api.get('/pipeline')
    return response.data
  }

  async getDashboard(): Promise<{ dashboard: any }> {
    const response = await this.api.get('/dashboard')
    return response.data
  }

  async addCustomerDocument(data: {
    customer_id: number
    project_id?: number
    document_path: string
    document_label?: string
  }): Promise<{ message: string; document_id: number }> {
    const response = await this.api.post('/documents', data)
    return response.data
  }

  async getCustomerDocuments(customerId: number): Promise<{ documents: any[] }> {
    const response = await this.api.get(`/customers/${customerId}/documents`)
    return response.data
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.api.get('/health', {
      baseURL: 'http://localhost:8000' // Direct health endpoint
    })
    return response.data
  }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService