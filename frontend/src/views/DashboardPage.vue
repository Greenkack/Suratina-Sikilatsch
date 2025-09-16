<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">
          <v-icon color="primary" size="large" class="mr-3">
            mdi-view-dashboard
          </v-icon>
          Dashboard
        </h1>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
            Schnellzugriff
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6" md="3" v-for="action in quickActions" :key="action.route">
                <v-card
                  :color="action.color"
                  dark
                  hover
                  @click="$router.push(action.route)"
                  class="text-center pa-4"
                  style="cursor: pointer;"
                >
                  <v-icon size="48" class="mb-2">{{ action.icon }}</v-icon>
                  <div class="text-h6">{{ action.title }}</div>
                  <div class="text-body-2">{{ action.description }}</div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- System Status -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-server-network</v-icon>
            System Status
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <template #prepend>
                  <v-icon :color="backendStatus.connected ? 'success' : 'error'">
                    {{ backendStatus.connected ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                  </v-icon>
                </template>
                <v-list-item-title>Backend API</v-list-item-title>
                <v-list-item-subtitle>
                  {{ backendStatus.connected ? 'Verbunden' : 'Offline' }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon color="info">mdi-database</v-icon>
                </template>
                <v-list-item-title>Datenbank</v-list-item-title>
                <v-list-item-subtitle>SQLite</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon color="info">mdi-file-pdf-box</v-icon>
                </template>
                <v-list-item-title>PDF Templates</v-list-item-title>
                <v-list-item-subtitle>Verfügbar</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-information</v-icon>
            Information
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-title>Version</v-list-item-title>
                <v-list-item-subtitle>1.0.0</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Architektur</v-list-item-title>
                <v-list-item-subtitle>Tauri + Vue 3 + FastAPI</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Letztes Update</v-list-item-title>
                <v-list-item-subtitle>{{ formatDate(new Date()) }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Projects (if available) -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon class="mr-2">mdi-history</v-icon>
            Letzte Projekte
          </v-card-title>
          <v-card-text>
            <v-alert
              v-if="!backendStatus.connected"
              type="warning"
              class="mb-4"
            >
              Backend nicht verfügbar - Projekte können nicht geladen werden
            </v-alert>
            
            <v-data-table-server
              v-else
              :headers="projectHeaders"
              :items="recentProjects"
              :loading="loadingProjects"
              item-value="project_id"
              class="elevation-1"
              @click:row="openProject"
            >
              <template #item.project_created_at="{ item }">
                {{ formatDate(new Date(item.project_created_at)) }}
              </template>
              
              <template #item.offer_type="{ item }">
                <v-chip
                  :color="item.offer_type === 'pv' ? 'solar' : 'hp'"
                  size="small"
                >
                  {{ item.offer_type === 'pv' ? 'PV' : item.offer_type === 'hp' ? 'HP' : 'Kombi' }}
                </v-chip>
              </template>
            </v-data-table-server>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/store/app'
import { apiService } from '@/services/api'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

const router = useRouter()
const appStore = useAppStore()

const recentProjects = ref([])
const loadingProjects = ref(false)

const backendStatus = computed(() => appStore.backendStatus)

const quickActions = [
  {
    title: 'Neues Projekt',
    description: 'PV-Anlage planen',
    icon: 'mdi-plus-circle',
    color: 'primary',
    route: '/input'
  },
  {
    title: 'Schnellkalkulation',
    description: 'Sofortige Schätzung',
    icon: 'mdi-calculator',
    color: 'success',
    route: '/quick-calc'
  },
  {
    title: 'Wärmepumpe',
    description: 'HP-Angebot erstellen',
    icon: 'mdi-heat-pump',
    color: 'hp',
    route: '/heatpump'
  },
  {
    title: 'CRM',
    description: 'Kundenverwaltung',
    icon: 'mdi-account-group',
    color: 'info',
    route: '/crm'
  }
]

const projectHeaders = [
  { title: 'Projekt', key: 'project_name', sortable: true },
  { title: 'Kunde', key: 'customer_name', sortable: true },
  { title: 'Typ', key: 'offer_type', sortable: false },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Erstellt', key: 'project_created_at', sortable: true }
]

const formatDate = (date: Date) => {
  return format(date, 'dd.MM.yyyy HH:mm', { locale: de })
}

const loadRecentProjects = async () => {
  if (!backendStatus.value.connected) return
  
  loadingProjects.value = true
  try {
    const response = await apiService.listProjects(10, 0)
    recentProjects.value = response.projects
  } catch (error) {
    console.error('Failed to load recent projects:', error)
    appStore.showSnackbar('Projekte konnten nicht geladen werden', 'warning')
  } finally {
    loadingProjects.value = false
  }
}

const openProject = (event: any, item: any) => {
  const projectId = item.item.project_id
  router.push(`/input?project_id=${projectId}`)
}

onMounted(async () => {
  await appStore.checkBackendStatus()
  await loadRecentProjects()
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>