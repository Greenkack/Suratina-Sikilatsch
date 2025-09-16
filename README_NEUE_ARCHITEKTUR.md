# Solar Configurator - Neue Architektur

Dieses Projekt implementiert die Migration des bestehenden Streamlit-basierten Solar-Angebots-Konfigurators zu einer modernen Desktop-Anwendung mit **Tauri + Vue 3 + FastAPI + Celery**.

## Architektur-Übersicht

### Frontend (Tauri + Vue 3)
- **Desktop-App** mit Tauri (ressourcenschonender als Electron)
- **Vue 3** mit Composition API und TypeScript
- **Vuetify 3** für Material Design Komponenten
- **Pinia** für State Management
- **Vite** für Build-System

### Backend (FastAPI + Python)
- **FastAPI** als REST-API Server
- **Celery** für asynchrone PDF-Generierung
- **SQLite/SQLAlchemy** für Datenbank
- **Legacy-Kompatibilität** mit bestehendem Streamlit-Code

## Struktur

```
├── backend/                    # FastAPI Backend
│   ├── api/                   # API Router (input, calculate, pdf, admin, crm)
│   ├── services/              # Business Logic (calculations, pdf_generator, database)
│   ├── main.py               # FastAPI App
│   ├── models.py             # Pydantic Models
│   ├── tasks.py              # Celery Tasks
│   └── requirements.txt      # Python Dependencies
│
├── frontend/                   # Vue 3 Frontend
│   ├── src/
│   │   ├── views/            # Seiten-Komponenten
│   │   ├── components/       # Wiederverwendbare Komponenten
│   │   ├── store/            # Pinia Stores
│   │   ├── services/         # API Services
│   │   ├── types/            # TypeScript Types
│   │   └── router/           # Vue Router
│   ├── src-tauri/            # Tauri Desktop App
│   │   ├── src/main.rs       # Rust Backend
│   │   └── tauri.conf.json   # Tauri Konfiguration
│   └── package.json          # Node.js Dependencies
│
└── [Legacy Files]             # Bestehender Streamlit-Code (als Referenz)
```

## Installation & Setup

### Voraussetzungen
- **Python 3.11+**
- **Node.js 18+**
- **Rust** (für Tauri)
- **Redis** (für Celery, optional)

### Backend Setup

1. **Virtual Environment erstellen:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # oder: venv\Scripts\activate  # Windows
   ```

2. **Dependencies installieren:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Backend starten:**
   ```bash
   python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

4. **Celery Worker starten (optional):**
   ```bash
   celery -A tasks worker --loglevel=info
   ```

### Frontend Setup

1. **Dependencies installieren:**
   ```bash
   cd frontend
   npm install
   ```

2. **Tauri CLI installieren:**
   ```bash
   npm install -g @tauri-apps/cli
   ```

3. **Development Server starten:**
   ```bash
   npm run tauri:dev
   ```

4. **Production Build:**
   ```bash
   npm run tauri:build
   ```

## API-Endpunkte

### Projekt-Management
- `POST /api/project` - Projekt speichern
- `GET /api/project/{id}` - Projekt laden
- `GET /api/projects` - Projekte auflisten

### Berechnungen
- `POST /api/calculate` - Hauptberechnung (PV/HP)
- `POST /api/calculate_quick` - Schnellkalkulation
- `POST /api/live_pricing` - Live-Preisberechnung
- `POST /api/scenarios` - Szenario-Berechnungen

### PDF-Generierung
- `POST /api/generate_pdf` - PDF-Erstellung starten
- `GET /api/task_status/{task_id}` - Task-Status abfragen
- `GET /api/download_pdf/{task_id}` - PDF herunterladen

### Admin & CRM
- `GET/POST /api/company_info` - Firmen-Informationen
- `GET/POST /api/products` - Produktdatenbank
- `GET/POST /api/customers` - Kundenverwaltung
- `POST /api/upload_price_matrix` - Preismatrix hochladen

## Legacy-Kompatibilität

Das neue Backend kann nahtlos mit dem bestehenden Streamlit-Code arbeiten:

```python
# In backend/services/calculations.py
from calculations import perform_calculations  # Original Streamlit-Code

def calculate_project(project_data):
    # Legacy-Funktion aufrufen
    results = perform_calculations(project_data, texts={}, errors=[])
    return results
```

### Fallback-System
- Wenn Legacy-Module nicht verfügbar → automatischer Fallback
- PDF-Generierung ohne Templates → 4-Seiten-Standard-PDF
- Celery nicht verfügbar → FastAPI BackgroundTasks

## Seiten-Mapping (Streamlit → Vue)

| Streamlit Seite | Vue Route | Komponente | Status |
|----------------|-----------|------------|---------|
| `/` (Eingabe) | `/input` | `DataInputPage.vue` | ✅ Implementiert |
| Analyse | `/analysis` | `AnalysisPage.vue` | 🚧 In Entwicklung |
| PDF-Generierung | `/pdf` | `PdfOutputPage.vue` | 🚧 In Entwicklung |
| Schnellkalkulation | `/quick-calc` | `QuickCalcPage.vue` | 🚧 Geplant |
| Wärmepumpe | `/heatpump` | `HeatpumpPage.vue` | 🚧 Geplant |
| CRM | `/crm` | `CrmPage.vue` | 🚧 Geplant |
| Admin | `/admin` | `AdminPanelPage.vue` | 🚧 Geplant |

## Features

### ✅ Implementiert
- FastAPI Backend mit vollständiger API
- Tauri Desktop-App mit System-Integration
- Vue 3 Frontend mit Vuetify UI
- Vollständige Datentypen (TypeScript/Pydantic)
- Legacy-Code-Integration
- Projekt-State-Management (Pinia)
- Grundlegende Eingabe-Seite
- Dashboard mit System-Status

### 🚧 In Entwicklung
- Berechnungs-Seite mit Charts
- PDF-Konfiguration und -Generierung
- CRM-Integration
- Admin-Panel

### 🔄 Migration Status
- **Backend:** ~90% vollständig
- **Frontend:** ~30% vollständig
- **Legacy Integration:** ✅ Vollständig
- **PDF System:** 🚧 Basis implementiert
- **Testing:** 🚧 In Planung

## Development

### Hot Reload
- **Backend:** `uvicorn main:app --reload`
- **Frontend:** `npm run tauri:dev`

### Debugging
- **Backend API:** `http://localhost:8000/docs` (Swagger UI)
- **Frontend:** Vue DevTools
- **Tauri:** Integrierte DevTools

### State Management
```typescript
// Projekt-Daten
const projectStore = useProjectStore()
projectStore.updateCustomerData({ email: 'test@example.com' })

// Berechnungen
const calculationStore = useCalculationStore()
calculationStore.setResults(results)

// App-Status
const appStore = useAppStore()
appStore.checkBackendStatus()
```

## Deployment

### Development
```bash
# Backend
cd backend && python -m uvicorn main:app --reload

# Frontend
cd frontend && npm run tauri:dev
```

### Production
```bash
# Build Desktop App
cd frontend && npm run tauri:build

# Backend als Service
cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

## Nächste Schritte

1. **Analyse-Seite** mit Chart-Integration
2. **PDF-Seite** mit Vorschau-Funktion
3. **CRM-Seite** mit Tabellen und Formularen
4. **Admin-Panel** mit File-Uploads
5. **Testing** und Qualitätssicherung
6. **Deployment** und Installer-Erstellung

## Support

Bei Fragen zur neuen Architektur oder Migration-Problemen:
- API-Dokumentation: `http://localhost:8000/docs`
- Frontend-Entwicklung: Vue 3 + Vuetify 3 Dokumentation
- Backend-Entwicklung: FastAPI + Pydantic Dokumentation