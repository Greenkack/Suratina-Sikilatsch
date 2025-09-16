#!/bin/bash

# Solar Configurator - Setup Script für neue Architektur
# Dieses Script richtet die Entwicklungsumgebung ein

set -e

echo "🌟 Solar Configurator - Entwicklungsumgebung Setup"
echo "=================================================="

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Funktion zum Prüfen ob Command existiert
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Voraussetzungen prüfen
echo
log_info "Prüfe Voraussetzungen..."

# Python
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    log_success "Python $PYTHON_VERSION gefunden"
else
    log_error "Python 3 nicht gefunden. Bitte installieren: https://python.org"
    exit 1
fi

# Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    log_success "Node.js $NODE_VERSION gefunden"
else
    log_error "Node.js nicht gefunden. Bitte installieren: https://nodejs.org"
    exit 1
fi

# Rust (für Tauri)
if command_exists rustc; then
    RUST_VERSION=$(rustc --version | cut -d' ' -f2)
    log_success "Rust $RUST_VERSION gefunden"
else
    log_warning "Rust nicht gefunden. Installiere automatisch..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source ~/.cargo/env
    log_success "Rust installiert"
fi

# Backend Setup
echo
log_info "Richte Backend ein..."

cd backend

# Virtual Environment
if [ ! -d "venv" ]; then
    log_info "Erstelle Python Virtual Environment..."
    python3 -m venv venv
    log_success "Virtual Environment erstellt"
else
    log_success "Virtual Environment bereits vorhanden"
fi

# Aktiviere Virtual Environment
log_info "Aktiviere Virtual Environment..."
source venv/bin/activate || source venv/Scripts/activate

# Requirements installieren
log_info "Installiere Python Dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
log_success "Python Dependencies installiert"

# Prüfe ob Redis verfügbar ist
if command_exists redis-server; then
    log_success "Redis gefunden - Celery kann verwendet werden"
else
    log_warning "Redis nicht gefunden - Celery wird im Fallback-Modus laufen"
fi

cd ..

# Frontend Setup
echo
log_info "Richte Frontend ein..."

cd frontend

# NPM Dependencies
log_info "Installiere Node.js Dependencies..."
npm install
log_success "Node.js Dependencies installiert"

# Tauri CLI
if ! command_exists tauri; then
    log_info "Installiere Tauri CLI..."
    npm install -g @tauri-apps/cli
    log_success "Tauri CLI installiert"
else
    log_success "Tauri CLI bereits verfügbar"
fi

cd ..

# Datenbank Setup
echo
log_info "Richte Datenbank ein..."

# Erstelle data Directory falls nicht vorhanden
mkdir -p data

# Prüfe ob Legacy-Datenbank vorhanden
if [ -f "data/app_data.db" ]; then
    log_success "Legacy-Datenbank gefunden"
else
    log_info "Erstelle neue Datenbank..."
    cd backend
    source venv/bin/activate || source venv/Scripts/activate
    python -c "
from services.database import init_db
init_db()
print('Datenbank initialisiert')
"
    cd ..
    log_success "Neue Datenbank erstellt"
fi

# Legacy-Ressourcen prüfen
echo
log_info "Prüfe Legacy-Ressourcen..."

if [ -d "coords" ] && [ -d "pdf_templates_static" ]; then
    log_success "PDF-Templates und Koordinaten verfügbar"
    
    # Kopiere Ressourcen ins Backend
    mkdir -p backend/resources
    cp -r coords backend/resources/ 2>/dev/null || log_warning "Coords konnten nicht kopiert werden"
    cp -r coords_wp backend/resources/ 2>/dev/null || log_warning "HP-Coords konnten nicht kopiert werden"
    cp -r pdf_templates_static backend/resources/ 2>/dev/null || log_warning "PDF-Templates konnten nicht kopiert werden"
    
    log_success "Ressourcen ins Backend kopiert"
else
    log_warning "PDF-Templates/Koordinaten nicht vollständig - Fallback-System wird verwendet"
fi

# Erstelle Start-Scripts
echo
log_info "Erstelle Start-Scripts..."

# Backend Start Script
cat > start_backend.sh << 'EOF'
#!/bin/bash
cd backend
source venv/bin/activate || source venv/Scripts/activate
echo "🚀 Starte FastAPI Backend auf http://localhost:8000"
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
EOF

# Frontend Start Script  
cat > start_frontend.sh << 'EOF'
#!/bin/bash
cd frontend
echo "🚀 Starte Tauri Desktop App..."
npm run tauri:dev
EOF

# Celery Start Script
cat > start_celery.sh << 'EOF'
#!/bin/bash
cd backend
source venv/bin/activate || source venv/Scripts/activate
echo "🚀 Starte Celery Worker..."
celery -A tasks worker --loglevel=info
EOF

# Development Start Script
cat > start_dev.sh << 'EOF'
#!/bin/bash
echo "🌟 Solar Configurator - Development Start"
echo "========================================"

# Terminal 1: Backend
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && ./start_backend.sh"' 2>/dev/null || {
    gnome-terminal -- bash -c "cd $(pwd) && ./start_backend.sh" 2>/dev/null || {
        echo "Backend manuell starten: ./start_backend.sh"
    }
}

# Warte kurz
sleep 2

# Terminal 2: Frontend  
osascript -e 'tell app "Terminal" to do script "cd '$(pwd)' && ./start_frontend.sh"' 2>/dev/null || {
    gnome-terminal -- bash -c "cd $(pwd) && ./start_frontend.sh" 2>/dev/null || {
        echo "Frontend manuell starten: ./start_frontend.sh"
    }
}

echo "✅ Development Server gestartet"
echo "📝 Backend API: http://localhost:8000/docs"
echo "🖥️  Desktop App startet automatisch"
EOF

# Scripts ausführbar machen
chmod +x start_backend.sh start_frontend.sh start_celery.sh start_dev.sh

log_success "Start-Scripts erstellt"

# Zusammenfassung
echo
echo "🎉 Setup erfolgreich abgeschlossen!"
echo "=================================="
echo
echo "📋 Nächste Schritte:"
echo "1. Development starten:     ./start_dev.sh"
echo "2. Nur Backend:            ./start_backend.sh"
echo "3. Nur Frontend:           ./start_frontend.sh"
echo "4. Celery Worker:          ./start_celery.sh"
echo
echo "📍 URLs:"
echo "• Backend API:             http://localhost:8000"
echo "• API Dokumentation:      http://localhost:8000/docs"
echo "• Desktop App:             Startet automatisch"
echo
echo "📚 Dokumentation:         README_NEUE_ARCHITEKTUR.md"
echo

log_success "Solar Configurator Entwicklungsumgebung ist bereit! 🚀"