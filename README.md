🌾 AgriGuardian

AI-powered crop disease detection & farm advisory platform for smallholder farmers

Built by Team SPARK — International Innovation Challenge 3.0 (Theme: AgriTech)

📖 Table of Contents
About AgriGuardian
The Problem
Key Features
System Architecture
Tech Stack
Project Structure
Getting Started
Backend Setup & Cross-Platform OCR
🖥️ Frontend Setup
Environment Variables
Production Deployment Blueprints
API Reference
Roadmap
Team
License
🌱 About AgriGuardian

AgriGuardian is a full-stack, AI-driven farm advisory platform that helps small and marginal farmers sense, analyze, predict, and act on crop health and field conditions in real time.

A farmer photographs a leaf (or an ESP32 sensor node streams live soil/climate data), and AgriGuardian:

Detects crop disease instantly using an on-device CNN (EfficientNetB3, exported to ONNX) that runs entirely in the browser — no cloud round-trip, works even in low-connectivity rural areas.
Digitizes printed farm documents — soil health cards, fertilizer/pesticide labels, and agronomic reports — via an OCR pipeline on the backend, turning them into structured, searchable data.
Fuses sensor + vision data into a single risk score and generates plain-language, bilingual (English/Hindi) advisory with concrete treatment steps.
Alerts farmers proactively via SMS/notifications when conditions turn risky, and visualizes trends on a dashboard built for low-literacy, mobile-first use.

Our north star: make precision-agriculture-grade insight affordable, offline-capable, and accessible to the 86% of Indian farms that are small or marginal holdings.

🚨 The Problem
Stat	Insight
86%	of Indian farms are small & marginal holdings
15–25%	of crop yield is lost yearly to undetected disease
<30%	of farmers have access to real-time farm advisory tools

Our approach: 🌱 SENSE → 🧠 ANALYZE → ⚠️ PREDICT → 📱 ACT

✨ Key Features
Feature	Description
🔬 On-Device Disease Detection	Upload/capture a leaf photo — an EfficientNetB3 model (ONNX Runtime Web, WASM) classifies the crop disease client-side, offline-capable once loaded
📄 Cross-Platform OCR Engine	Backend OCR pipeline (Tesseract + OpenCV preprocessing) extracts text from soil health cards, fertilizer/pesticide labels and scanned agronomic reports
🌦️ Hyperlocal Weather & Irrigation Advisory	7-day hyperlocal forecast tied to a personalized irrigation plan
📡 ESP32 Live Sensor Feed	Soil moisture, temperature, humidity and rainfall streamed from a low-cost ESP32 node and visualized live
🧠 AI Advisory Engine	Combines vision + sensor + OCR outputs into a single risk level (normal / caution / urgent) with actionable, plain-language guidance
💊 Treatment Library	Curated, crop-specific treatment steps for 30+ PlantVillage disease classes
🔔 SMS/Push Alerts	Automatic farmer alerts the moment risk crosses a threshold
📊 Analytics & History	Track disease incidence, sensor trends and past scans over time
📑 Exportable Reports	Generate shareable/printable farm health reports
🌐 Bilingual UI (EN/हिं)	Every advisory, treatment and UI string is available in English and Hindi
📱 Mobile-First, Low-Bandwidth UI	Designed for patchy rural connectivity — critical inference runs on-device
🏗️ System Architecture
                          AGRIGUARDIAN
                               │
                ┌──────────────┴───────────────┐
                ↓                               ↓
          LEAF IMAGE                      ESP32 SENSORS
                │                               │
                ↓                               ↓
     On-device Preprocessing            Sensor Ingestion (API)
     (resize / normalize)                       │
                │                               ↓
                ↓                        Backend Processing
     ONNX Runtime Web (WASM)             (Python + OCR engine)
       EfficientNetB3 CNN                       │
                │                               │
                └───────────────┬───────────────┘
                                 ↓
                            AI ENGINE
                (Disease Class + Soil/Climate Risk + OCR Data)
                                 ↓
                      Recommendation Engine
                     (bilingual advisory + treatment)
                                 ↓
                        Farmer Dashboard
                    (web app + SMS/push alerts)

Pipeline: Data Acquisition → Preprocessing → Model Inference → Result Generation (confidence + class) → Human-readable Advisory + Treatment Output.

🛠️ Tech Stack
Layer	Technology	Purpose
Microcontroller	ESP32	Real-time field sensor acquisition (soil moisture, temp, humidity, rain)
Model Training	PyTorch / Keras (CNN)	Training the leaf-disease classification model
Model Runtime	ONNX + onnxruntime-web	Portable, in-browser inference — no server GPU needed
Frontend	React 19, TanStack Start, TanStack Router, TypeScript, Vite	Web app shell, routing, SSR
UI	Tailwind CSS v4, Radix UI / shadcn-style primitives, Framer Motion, Recharts	Design system, charts, motion
Backend	Python	Sensor ingestion API, OCR pipeline, alerting logic
OCR	Tesseract OCR (pytesseract) + OpenCV	Extracting text from soil/label/report images, cross-platform
Package Managers	Bun (frontend) · pip / venv (backend)	Dependency management
Deployment	Render (backend blueprint) + static/Node hosting (frontend)	Production deployment
📁 Project Structure
AgriGuardian_Project/
├── backend/                        # Python backend (OCR, sensor API, advisory logic)
│   ├── app/
│   │   ├── main.py                 # App entrypoint (FastAPI/Flask server)
│   │   ├── routes/
│   │   │   ├── sensor.py           # /api/sensor-data endpoint
│   │   │   ├── alerts.py           # /api/send-alert endpoint
│   │   │   └── ocr.py              # OCR extraction endpoint(s)
│   │   ├── services/
│   │   │   ├── ocr_engine.py       # Tesseract + OpenCV preprocessing pipeline
│   │   │   ├── advisory_engine.py  # Risk scoring + advisory generation
│   │   │   └── weather.py          # Forecast integration
│   │   └── models/                 # Pydantic / data schemas
│   ├── requirements.txt
│   ├── .env.example
│   └── render.yaml                 # Render Blueprint (backend deploy)
│
├── frontend/                       # TanStack Start web app (this repo root)
│   ├── src/
│   │   ├── routes/                 # File-based routes (pages)
│   │   │   ├── index.tsx           # Landing page
│   │   │   ├── dashboard.tsx       # Live field conditions dashboard
│   │   │   ├── detection.tsx       # Leaf disease scan (on-device ONNX)
│   │   │   ├── crops.tsx           # Crop selector / profiles
│   │   │   ├── weather.tsx         # Hyperlocal forecast + irrigation advisory
│   │   │   ├── advisor.tsx         # AI advisory chat/summary
│   │   │   ├── alerts.tsx          # Alert configuration (SMS/push)
│   │   │   ├── analytics.tsx       # Trends & incidence charts
│   │   │   ├── history.tsx         # Past scans & sensor history
│   │   │   └── reports.tsx         # Exportable farm health reports
│   │   ├── components/
│   │   │   ├── app/                # App shell, sidebar, top bar, status badges
│   │   │   └── ui/                 # Reusable design-system primitives
│   │   ├── context/AppContext.tsx  # Global app state (lang, crop, theme, alerts)
│   │   ├── lib/
│   │   │   ├── api.ts              # Backend API client
│   │   │   ├── leafModel.ts        # ONNX model loading + inference
│   │   │   ├── treatments.ts       # Disease → treatment mapping (EN/HI)
│   │   │   ├── farmData.ts         # Mock/demo farm data
│   │   │   └── i18n.ts             # Bilingual (EN/HI) translation strings
│   │   ├── assets/                 # Sample leaf images (demo mode)
│   │   ├── router.tsx / server.ts / start.ts
│   │   └── styles.css
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
└── README.md

The layout above reflects the full-stack project. This repository's frontend/ corresponds to the web app in this ZIP export; see backend/ for the Python service.

🚀 Getting Started
Prerequisites
Tool	Version	Notes
Bun	≥ 1.1	Frontend package manager & dev server (Node.js ≥ 18 also works via npm)
Python	≥ 3.10	Backend runtime
Tesseract OCR	≥ 5.0	Native OCR engine binary (see below)
Git	latest	Clone the repository
bash
git clone https://github.com/Bui9ldWithShaurya/AgriGuardian_Project.git
cd AgriGuardian_Project
⚙️ Backend Setup & Cross-Platform OCR

The backend exposes the sensor ingestion, alerting and OCR document-extraction APIs. Because OCR relies on a native Tesseract binary (not a pure-Python package), setup differs slightly by OS — follow the steps below.

1. Install Native Tesseract Binary

pytesseract is only a Python wrapper — it calls a native Tesseract engine that must be installed separately on your machine.

macOS (Homebrew):

bash
brew install tesseract

Windows:

bash
# Download and run the installer:
# https://github.com/UB-Mannheim/tesseract/wiki
# Then add the install directory (e.g. C:\Program Files\Tesseract-OCR)
# to your system PATH.

Linux (Debian/Ubuntu):

bash
sudo apt update
sudo apt install tesseract-ocr libtesseract-dev

Verify installation:

bash
tesseract --version

💡 If pytesseract can't find the binary automatically, set the path explicitly in your .env (see Environment Variables) or point to it directly in code via pytesseract.pytesseract.tesseract_cmd.

2. Create Virtual Environment & Install Dependencies
bash
cd backend

# Create an isolated virtual environment
python -m venv venv

# Activate it
source venv/bin/activate        # macOS / Linux
venv\Scripts\activate           # Windows

# Install Python dependencies
pip install -r requirements.txt

requirements.txt includes core packages such as:

fastapi
uvicorn
pytesseract
opencv-python
pillow
numpy
python-dotenv
pydantic
requests
3. Configure Environment Variables

Copy the example file and fill in your values:

bash
cp .env.example .env
ini
# .env
PORT=8000
HOST=0.0.0.0

# Only needed if Tesseract isn't on PATH
TESSERACT_CMD=/usr/bin/tesseract

# Weather / advisory integrations
WEATHER_API_KEY=your_weather_api_key

# SMS / alert provider (e.g. Twilio, Fast2SMS)
SMS_API_KEY=your_sms_provider_key
SMS_SENDER_ID=your_sender_id

# Allowed frontend origin(s) for CORS
CORS_ORIGIN=http://localhost:3000
4. Run the Backend
bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

The API will be live at http://localhost:8000 — interactive docs at http://localhost:8000/docs.

🖥️ Frontend Setup

The frontend is a TanStack Start (React 19 + Vite) web app.

bash
cd frontend        # repository root if you're working from this ZIP

# Install dependencies
bun install         # or: npm install

# Configure the backend URL
cp .env.example .env
# .env
# VITE_BACKEND_URL=http://localhost:8000

# Start the dev server
bun run dev          # or: npm run dev

The app runs at http://localhost:3000 by default.

Available scripts:

Script	Purpose
bun run dev	Start local dev server with HMR
bun run build	Production build
bun run preview	Preview the production build locally
bun run lint	Run ESLint
bun run format	Format code with Prettier
🔐 Environment Variables
Variable	Where	Description
VITE_BACKEND_URL	Frontend	Base URL of the deployed/local backend API
PORT / HOST	Backend	Bind address for the API server
TESSERACT_CMD	Backend	Explicit path to the Tesseract binary (if not on PATH)
WEATHER_API_KEY	Backend	Key for the weather/forecast provider
SMS_API_KEY / SMS_SENDER_ID	Backend	Credentials for the SMS/alert provider
CORS_ORIGIN	Backend	Allowed origin(s) for the deployed frontend
☁️ Production Deployment Blueprints
1. Backend (Render Blueprint)

Deploy the Python + OCR backend using a Render Blueprint (render.yaml) so infrastructure is defined as code:

yaml
# render.yaml
services:
  - type: web
    name: agriguardian-backend
    env: python
    region: singapore
    plan: free
    buildCommand: >
      apt-get update &&
      apt-get install -y tesseract-ocr libtesseract-dev &&
      pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: TESSERACT_CMD
        value: /usr/bin/tesseract
      - key: WEATHER_API_KEY
        sync: false
      - key: SMS_API_KEY
        sync: false
      - key: CORS_ORIGIN
        value: https://agriguardianproject1.lovable.app

Steps:

Push render.yaml to your repo root (or backend/).
In the Render Dashboard, select New → Blueprint and connect this repository.
Render provisions the web service automatically, installing the native Tesseract binary via buildCommand.
Add secret env vars (WEATHER_API_KEY, SMS_API_KEY) in the Render dashboard.
Note the deployed URL (e.g. https://agriguardian-backend.onrender.com) — you'll need it for the frontend.
2. Frontend

The frontend is a static/SSR-capable Vite build and can be deployed to Vercel, Netlify, or Render (Static Site).

bash
bun run build

Render Static Site:

yaml
  - type: web
    name: agriguardian-frontend
    env: static
    buildCommand: bun install && bun run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_BACKEND_URL
        value: https://agriguardian-backend.onrender.com

Vercel/Netlify: set the build command to bun run build (or npm run build), output directory dist, and add VITE_BACKEND_URL pointing to your live Render backend URL under project environment variables.

Our current live demo is hosted at agriguardianproject1.lovable.app.

📡 API Reference
Endpoint	Method	Description
/api/sensor-data	GET	Returns latest ESP32 sensor reading, advisory, history & forecast
/api/send-alert	POST	Sends a farmer SMS/push alert { phone, message, risk_level }
/api/ocr/extract	POST	Uploads a soil card/label image, returns extracted structured text
🗺️ Roadmap
 Native mobile app (React Native / Expo) for offline field use
 Multi-language expansion beyond English/Hindi
 Federated fine-tuning of the disease model on farmer-contributed images
 Marketplace integration for recommended fertilizers/pesticides
 Government scheme & subsidy matching via OCR'd land/soil documents
👥 Team SPARK

Manipal University Jaipur

Name	Role
Karthik Singh	ML & Edge AI
Piyush Parida	Research & Design
Shaleen Mathur	Frontend & UI/UX
Shaurya Mathur	Backend & Systems
📄 License

This project is licensed under the MIT License — see the LICENSE file for details.

<p align="center"> <b>Built with passion. Deployed for impact. AI for a healthier farming future. 🌾</b><br/> <sub>Smart insights for a better tomorrow — Team SPARK</sub> </p>
