<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">
          <v-icon color="primary" size="large" class="mr-3">
            mdi-form-select
          </v-icon>
          Projektdaten eingeben
        </h1>
      </v-col>
    </v-row>

    <v-form ref="form" v-model="formValid" @submit.prevent="saveProject">
      <v-row>
        <!-- Project Type Selection -->
        <v-col cols="12">
          <v-card class="mb-6">
            <v-card-title>
              <v-icon class="mr-2">mdi-cog</v-icon>
              Projekttyp
            </v-card-title>
            <v-card-text>
              <v-radio-group
                v-model="projectStore.projectDetails.project_type"
                inline
                @update:model-value="onProjectTypeChange"
              >
                <v-radio
                  label="Photovoltaik"
                  value="pv"
                  color="solar"
                >
                  <template #label>
                    <div class="d-flex align-center">
                      <v-icon color="solar" class="mr-2">mdi-solar-panel</v-icon>
                      Photovoltaik
                    </div>
                  </template>
                </v-radio>
                <v-radio
                  label="Wärmepumpe"
                  value="hp"
                  color="hp"
                >
                  <template #label>
                    <div class="d-flex align-center">
                      <v-icon color="hp" class="mr-2">mdi-heat-pump</v-icon>
                      Wärmepumpe
                    </div>
                  </template>
                </v-radio>
                <v-radio
                  label="Kombiniert"
                  value="combined"
                  color="primary"
                >
                  <template #label>
                    <div class="d-flex align-center">
                      <v-icon color="primary" class="mr-2">mdi-lightning-bolt</v-icon>
                      Kombiniert (PV + HP)
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Customer Data -->
        <v-col cols="12" lg="6">
          <v-card class="h-100">
            <v-card-title>
              <v-icon class="mr-2">mdi-account</v-icon>
              Kundendaten
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="projectStore.customerData.first_name"
                    label="Vorname"
                    :rules="[rules.required]"
                    prepend-icon="mdi-account"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="projectStore.customerData.last_name"
                    label="Nachname"
                    :rules="[rules.required]"
                    prepend-icon="mdi-account"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="projectStore.customerData.email"
                    label="E-Mail"
                    type="email"
                    :rules="[rules.required, rules.email]"
                    prepend-icon="mdi-email"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="projectStore.customerData.phone"
                    label="Telefon"
                    prepend-icon="mdi-phone"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="projectStore.customerData.postal_code"
                    label="PLZ"
                    prepend-icon="mdi-mailbox"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="projectStore.customerData.address"
                    label="Adresse"
                    prepend-icon="mdi-home"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="projectStore.customerData.city"
                    label="Ort"
                    prepend-icon="mdi-city"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Project Details -->
        <v-col cols="12" lg="6">
          <v-card class="h-100">
            <v-card-title>
              <v-icon class="mr-2">mdi-briefcase</v-icon>
              Projektdetails
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="projectStore.projectDetails.project_name"
                label="Projektname"
                :rules="[rules.required]"
                prepend-icon="mdi-folder"
                class="mb-4"
              />
              
              <v-textarea
                v-model="projectStore.projectDetails.notes"
                label="Notizen"
                prepend-icon="mdi-note-text"
                rows="3"
                auto-grow
              />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- PV Details (wenn PV oder kombiniert) -->
        <v-col 
          v-if="showPVDetails" 
          cols="12"
        >
          <v-card>
            <v-card-title>
              <v-icon color="solar" class="mr-2">mdi-solar-panel</v-icon>
              PV-Anlagendetails
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="projectStore.pvDetails.anlage_kwp"
                    label="Anlagengröße (kWp)"
                    type="number"
                    step="0.1"
                    min="0"
                    :rules="[rules.required, rules.positive]"
                    prepend-icon="mdi-solar-panel"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="projectStore.pvDetails.annual_consumption_kwh"
                    label="Jahresverbrauch (kWh)"
                    type="number"
                    min="0"
                    :rules="[rules.required, rules.positive]"
                    prepend-icon="mdi-home-lightning-bolt"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="projectStore.pvDetails.storage_kwh"
                    label="Speicher (kWh)"
                    type="number"
                    step="0.1"
                    min="0"
                    prepend-icon="mdi-battery"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="projectStore.pvDetails.roof_orientation"
                    label="Dachausrichtung"
                    :items="roofOrientations"
                    prepend-icon="mdi-compass"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="projectStore.pvDetails.roof_tilt"
                    label="Dachneigung (°)"
                    type="number"
                    min="0"
                    max="90"
                    prepend-icon="mdi-angle-acute"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="projectStore.pvDetails.location"
                    label="Standort"
                    prepend-icon="mdi-map-marker"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- HP Details (wenn HP oder kombiniert) -->
        <v-col 
          v-if="showHPDetails" 
          cols="12"
        >
          <v-card>
            <v-card-title>
              <v-icon color="hp" class="mr-2">mdi-heat-pump</v-icon>
              Wärmepumpendetails
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="projectStore.hpDetails.heat_demand_kwh"
                    label="Wärmebedarf (kWh/Jahr)"
                    type="number"
                    min="0"
                    :rules="[rules.required, rules.positive]"
                    prepend-icon="mdi-thermometer"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="projectStore.hpDetails.hp_power_kw"
                    label="WP-Leistung (kW)"
                    type="number"
                    step="0.1"
                    min="0"
                    :rules="[rules.required, rules.positive]"
                    prepend-icon="mdi-lightning-bolt"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="projectStore.hpDetails.cop_value"
                    label="COP-Wert"
                    type="number"
                    step="0.1"
                    min="1"
                    prepend-icon="mdi-gauge"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="projectStore.hpDetails.hp_type"
                    label="Wärmepumpentyp"
                    :items="heatPumpTypes"
                    prepend-icon="mdi-heat-pump"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="projectStore.hpDetails.installation_type"
                    label="Aufstellungsart"
                    :items="installationTypes"
                    prepend-icon="mdi-home-outline"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Action Buttons -->
        <v-col cols="12">
          <v-card>
            <v-card-actions class="justify-space-between">
              <div>
                <v-btn
                  color="secondary"
                  variant="outlined"
                  @click="resetForm"
                >
                  <v-icon class="mr-2">mdi-refresh</v-icon>
                  Zurücksetzen
                </v-btn>
              </div>
              
              <div>
                <v-btn
                  color="primary"
                  type="submit"
                  :loading="saving"
                  :disabled="!formValid || !projectStore.isProjectValid"
                >
                  <v-icon class="mr-2">mdi-content-save</v-icon>
                  Projekt speichern
                </v-btn>
                
                <v-btn
                  color="success"
                  class="ml-2"
                  :disabled="!projectStore.isProjectValid"
                  @click="calculateAndContinue"
                >
                  <v-icon class="mr-2">mdi-calculator</v-icon>
                  Berechnen & Weiter
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProjectStore } from '@/store/project'
import { useAppStore } from '@/store/app'
import { apiService } from '@/services/api'

const router = useRouter()
const route = useRoute()
const projectStore = useProjectStore()
const appStore = useAppStore()

const form = ref()
const formValid = ref(false)
const saving = ref(false)

const showPVDetails = computed(() => {
  const type = projectStore.projectDetails.project_type
  return type === 'pv' || type === 'combined'
})

const showHPDetails = computed(() => {
  const type = projectStore.projectDetails.project_type
  return type === 'hp' || type === 'combined'
})

// Validation rules
const rules = {
  required: (value: any) => !!value || 'Pflichtfeld',
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return !value || pattern.test(value) || 'Ungültige E-Mail-Adresse'
  },
  positive: (value: number) => value > 0 || 'Wert muss größer als 0 sein'
}

// Options for select fields
const roofOrientations = [
  'Süd', 'Südost', 'Südwest', 'Ost', 'West', 'Nord', 'Flachdach'
]

const heatPumpTypes = [
  'Luft-Wasser', 'Wasser-Wasser', 'Sole-Wasser', 'Luft-Luft'
]

const installationTypes = [
  'Außenaufstellung', 'Innenaufstellung', 'Split-Gerät'
]

const onProjectTypeChange = () => {
  // Save snapshot when project type changes
  projectStore.saveSnapshot('input')
}

const resetForm = () => {
  projectStore.resetProject()
  appStore.showSnackbar('Formular zurückgesetzt', 'info')
}

const saveProject = async () => {
  if (!form.value.validate()) {
    return
  }

  saving.value = true
  try {
    const projectData = projectStore.currentProjectData
    const response = await apiService.saveProject(projectData)
    
    projectStore.markSaved()
    appStore.showSnackbar(`Projekt gespeichert (ID: ${response.project_id})`, 'success')
    
    // Update project ID if it was a new project
    if (response.project_id) {
      projectStore.updateProjectDetails({ project_id: response.project_id })
    }
    
  } catch (error: any) {
    appStore.showSnackbar(`Speichern fehlgeschlagen: ${error.message}`, 'error')
  } finally {
    saving.value = false
  }
}

const calculateAndContinue = async () => {
  if (!projectStore.isProjectValid) {
    appStore.showSnackbar('Bitte alle Pflichtfelder ausfüllen', 'warning')
    return
  }

  // Save first
  await saveProject()
  
  // Then navigate to analysis
  router.push('/analysis')
}

// Load project from URL parameter if provided
onMounted(async () => {
  const projectId = route.query.project_id as string
  
  if (projectId) {
    try {
      appStore.setLoading(true, 'Projekt wird geladen...')
      const response = await apiService.getProject(parseInt(projectId))
      projectStore.setProjectData(response.project_data)
      appStore.showSnackbar('Projekt geladen', 'success')
    } catch (error: any) {
      appStore.showSnackbar(`Projekt konnte nicht geladen werden: ${error.message}`, 'error')
    } finally {
      appStore.setLoading(false)
    }
  } else {
    // Restore snapshot if available
    projectStore.restoreSnapshot('input')
  }
})

// Save snapshot before leaving
onBeforeUnmount(() => {
  projectStore.saveSnapshot('input')
})
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}

.h-100 {
  height: 100%;
}
</style>