import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ProjectData, CustomerData, PVDetails, HPDetails, ProjectDetails } from '@/types/api'

export const useProjectStore = defineStore('project', () => {
  // Project state - mirrors original Streamlit session_state structure
  const projectData = ref<ProjectData | null>(null)
  const hasUnsavedChanges = ref(false)
  
  // Customer data
  const customerData = ref<CustomerData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: ''
  })
  
  // PV details
  const pvDetails = ref<PVDetails>({
    anlage_kwp: 10.0,
    annual_consumption_kwh: 4000.0,
    storage_kwh: 0.0,
    roof_orientation: 'Süd',
    roof_tilt: 30.0,
    location: 'Deutschland'
  })
  
  // HP details
  const hpDetails = ref<HPDetails>({
    heat_demand_kwh: 15000.0,
    hp_power_kw: 8.0,
    cop_value: 4.0,
    hp_type: 'Luft-Wasser',
    installation_type: 'Außenaufstellung'
  })
  
  // Project details
  const projectDetails = ref<ProjectDetails>({
    project_name: '',
    project_type: 'pv',
    status: 'active',
    notes: ''
  })
  
  // Computed
  const currentProjectData = computed<ProjectData>(() => ({
    customer_data: customerData.value,
    pv_details: projectDetails.value.project_type !== 'hp' ? pvDetails.value : undefined,
    hp_details: projectDetails.value.project_type !== 'pv' ? hpDetails.value : undefined,
    project_details: projectDetails.value
  }))
  
  const isProjectValid = computed(() => {
    const customer = customerData.value
    const project = projectDetails.value
    
    // Basic validation
    const hasCustomerData = customer.first_name && customer.last_name && customer.email
    const hasProjectName = project.project_name
    
    let hasTypeSpecificData = false
    
    if (project.project_type === 'pv') {
      hasTypeSpecificData = pvDetails.value.anlage_kwp > 0 && pvDetails.value.annual_consumption_kwh > 0
    } else if (project.project_type === 'hp') {
      hasTypeSpecificData = hpDetails.value.heat_demand_kwh > 0 && hpDetails.value.hp_power_kw > 0
    } else if (project.project_type === 'combined') {
      hasTypeSpecificData = 
        pvDetails.value.anlage_kwp > 0 && 
        pvDetails.value.annual_consumption_kwh > 0 &&
        hpDetails.value.heat_demand_kwh > 0 && 
        hpDetails.value.hp_power_kw > 0
    }
    
    return hasCustomerData && hasProjectName && hasTypeSpecificData
  })
  
  // Actions
  const updateCustomerData = (data: Partial<CustomerData>) => {
    customerData.value = { ...customerData.value, ...data }
    hasUnsavedChanges.value = true
  }
  
  const updatePVDetails = (data: Partial<PVDetails>) => {
    pvDetails.value = { ...pvDetails.value, ...data }
    hasUnsavedChanges.value = true
  }
  
  const updateHPDetails = (data: Partial<HPDetails>) => {
    hpDetails.value = { ...hpDetails.value, ...data }
    hasUnsavedChanges.value = true
  }
  
  const updateProjectDetails = (data: Partial<ProjectDetails>) => {
    projectDetails.value = { ...projectDetails.value, ...data }
    hasUnsavedChanges.value = true
  }
  
  const setProjectData = (data: ProjectData) => {
    customerData.value = data.customer_data
    if (data.pv_details) pvDetails.value = data.pv_details
    if (data.hp_details) hpDetails.value = data.hp_details
    projectDetails.value = data.project_details
    projectData.value = data
    hasUnsavedChanges.value = false
  }
  
  const resetProject = () => {
    customerData.value = {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postal_code: ''
    }
    
    pvDetails.value = {
      anlage_kwp: 10.0,
      annual_consumption_kwh: 4000.0,
      storage_kwh: 0.0,
      roof_orientation: 'Süd',
      roof_tilt: 30.0,
      location: 'Deutschland'
    }
    
    hpDetails.value = {
      heat_demand_kwh: 15000.0,
      hp_power_kw: 8.0,
      cop_value: 4.0,
      hp_type: 'Luft-Wasser',
      installation_type: 'Außenaufstellung'
    }
    
    projectDetails.value = {
      project_name: '',
      project_type: 'pv',
      status: 'active',
      notes: ''
    }
    
    projectData.value = null
    hasUnsavedChanges.value = false
  }
  
  const markSaved = () => {
    hasUnsavedChanges.value = false
  }
  
  // Snapshots for page restoration (similar to original Streamlit snapshot system)
  const saveSnapshot = (pageKey: string) => {
    const snapshot = {
      customerData: { ...customerData.value },
      pvDetails: { ...pvDetails.value },
      hpDetails: { ...hpDetails.value },
      projectDetails: { ...projectDetails.value }
    }
    
    localStorage.setItem(`project_snapshot_${pageKey}`, JSON.stringify(snapshot))
  }
  
  const restoreSnapshot = (pageKey: string) => {
    const snapshotData = localStorage.getItem(`project_snapshot_${pageKey}`)
    
    if (snapshotData) {
      try {
        const snapshot = JSON.parse(snapshotData)
        customerData.value = snapshot.customerData || customerData.value
        pvDetails.value = snapshot.pvDetails || pvDetails.value
        hpDetails.value = snapshot.hpDetails || hpDetails.value
        projectDetails.value = snapshot.projectDetails || projectDetails.value
      } catch (error) {
        console.error('Failed to restore snapshot:', error)
      }
    }
  }
  
  return {
    // State
    projectData,
    hasUnsavedChanges,
    customerData,
    pvDetails,
    hpDetails,
    projectDetails,
    
    // Computed
    currentProjectData,
    isProjectValid,
    
    // Actions
    updateCustomerData,
    updatePVDetails,
    updateHPDetails,
    updateProjectDetails,
    setProjectData,
    resetProject,
    markSaved,
    saveSnapshot,
    restoreSnapshot
  }
})