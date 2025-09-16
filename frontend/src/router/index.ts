import { createRouter, createWebHistory } from 'vue-router'

// Lazy load components for better performance
const DataInputPage = () => import('@/views/DataInputPage.vue')
const AnalysisPage = () => import('@/views/AnalysisPage.vue')
const PdfOutputPage = () => import('@/views/PdfOutputPage.vue')
const QuickCalcPage = () => import('@/views/QuickCalcPage.vue')
const HeatpumpPage = () => import('@/views/HeatpumpPage.vue')
const CrmPage = () => import('@/views/CrmPage.vue')
const AdminPanelPage = () => import('@/views/AdminPanelPage.vue')
const DashboardPage = () => import('@/views/DashboardPage.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashboardPage,
      meta: {
        title: 'Dashboard',
        description: 'Übersicht und Schnellzugriff'
      }
    },
    {
      path: '/input',
      name: 'DataInput',
      component: DataInputPage,
      meta: {
        title: 'Eingabe',
        description: 'Projektdaten und Kundendaten eingeben'
      }
    },
    {
      path: '/analysis',
      name: 'Analysis',
      component: AnalysisPage,
      meta: {
        title: 'Analyse',
        description: 'Wirtschaftlichkeitsberechnung und Visualisierung'
      }
    },
    {
      path: '/pdf',
      name: 'PdfOutput',
      component: PdfOutputPage,
      meta: {
        title: 'PDF-Erstellung',
        description: 'Angebots-PDF konfigurieren und erstellen'
      }
    },
    {
      path: '/quick-calc',
      name: 'QuickCalc',
      component: QuickCalcPage,
      meta: {
        title: 'Schnellkalkulation',
        description: 'Schnelle Preisschätzung'
      }
    },
    {
      path: '/heatpump',
      name: 'Heatpump',
      component: HeatpumpPage,
      meta: {
        title: 'Wärmepumpe',
        description: 'Wärmepumpen-Angebote erstellen'
      }
    },
    {
      path: '/crm',
      name: 'Crm',
      component: CrmPage,
      meta: {
        title: 'CRM',
        description: 'Kunden- und Projektverwaltung'
      }
    },
    {
      path: '/admin',
      name: 'AdminPanel',
      component: AdminPanelPage,
      meta: {
        title: 'Administration',
        description: 'Einstellungen und Stammdaten'
      }
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Update document title
  if (to.meta.title) {
    document.title = `${to.meta.title} - Solar Configurator`
  }
  
  next()
})

export default router