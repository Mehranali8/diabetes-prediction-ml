# Project Architecture

## Overview

The **Diabetes Prediction System** is a lightweight, decoupled web platform designed to assist clinicians in estimating diabetes risk. The application follows a classic client-server architecture:
- **Frontend SPA**: A single-page React app bundled with Vite and styled via Tailwind CSS v4. It manages local UI state, routes pages dynamically via React state, and persists screening histories in local browser storage.
- **Backend API**: An asynchronous FastAPI service that exposes a serialized machine learning model.
- **Machine Learning Engine**: A classification pipeline powered by a Scikit-Learn `LogisticRegression` model, pre-trained on the Pima Indians dataset and persisted using Joblib.

These components coordinate through a stateless JSON-over-HTTP RESTful interface, keeping data operations fast, lightweight, and simple.

---

# High-Level Architecture

The operational workflow and communication boundaries between system elements are structured as follows:

```
[ User (Clinician) ]
         │
         ▼ (Physiological parameters)
┌────────────────────────────────────────────────────────┐
│                    React Frontend                      │
│                                                        │
│   [ Patient Intake Form ] ──► [ Client useForm check ] │
│            ▲                              │ (Passes)   │
│            │                              ▼            │
│     [ Result Panel ] ◄──  [ API Fetch client dispatch] │
│            │                              │            │
│            ▼                              │            │
│   [ LocalStorage Cache ]                  │            │
└───────────────────────────────────────────┼────────────┘
                                            │
                                            ▼ (POST /predict JSON)
┌───────────────────────────────────────────┼────────────┐
│                    FastAPI Backend        │            │
│                                           ▼            │
│                       [ Pydantic Schema Validation ]   │
│                                           │            │
│                                           ▼ (Pandas DataFrame)
│                       [ Joblib Model Inference ]       │
│                                           │            │
│                                           ▼ (0 / 1 outcome)
│                       [ JSON response mapping ]        │
└───────────────────────────────────────────┬────────────┘
                                            │
                                            └─► (Returns JSON response)
```

---

# System Components

### 1. Frontend SPA
- **Responsibility**: Manages form input, client validation, navigation routes, responsive design transitions, connection status pulses, and local history cache logging.
- **Key Modules**: React 19 core, custom form hooks (`useForm`), API service clients (`predictionService`), and local cache helpers (`storage`).

### 2. Backend API
- **Responsibility**: Manages ASGI routing, handles API request payloads, validates input data formats, handles runtime exceptions, and routes parameters to the model.
- **Key Modules**: FastAPI router, Pydantic data schemas, and Uvicorn server processes.

### 3. Machine Learning Engine
- **Responsibility**: Processes patient feature variables, scales data inputs inside Pandas matrices, performs predictive classification, and serializes trained estimators.
- **Key Modules**: Scikit-Learn `LogisticRegression` classifier, Pandas data processing, and Joblib serialization helpers.

### 4. LocalStorage Cache
- **Responsibility**: Caches diagnostic calculations in the browser to maintain history records without database overhead.
- **Key Modules**: Browser Web Storage APIs, configured under the key `gluco_predict_history`.

---

# Project Directory Structure

```text
diabetes-prediction/
├── backend/            # FastAPI Python Backend App
│   └── app/            # Source codes (main.py, preprocessing, training)
├── datasets/           # Datasets folder
│   └── diabetes.csv    # Pima Indians CSV dataset file
├── docs/               # Technical architectural documentation
│   ├── API_DOCUMENTATION.md
│   ├── BACKEND_DOCUMENTATION.md
│   ├── FRONTEND_DOCUMENTATION.md
│   └── PROJECT_ARCHITECTURE.md # (This file)
├── frontend/           # React + Vite + Tailwind CSS v4 Frontend App
│   ├── public/         # Static assets
│   ├── src/            # Core React SPA code
│   └── dist/           # Production-compiled assets folder
├── models/             # Serialized Machine Learning models
│   └── diabetes_model.joblib # Persistent trained classifier binary file
├── screenshots/        # UI dashboards assets placeholders
├── tests/              # Test suites (backend API audits)
└── requirements.txt    # Python backend dependencies manifest
```

---

# Data Flow

The lifecycle of an evaluation data transaction traverses the following stages:

```
[ 1. User Entry ] ──► Clinician enters patient physiological markers in React UI
       │
       ▼
[ 2. form submit ] ──► useForm validates ranges; fires predictionService dispatch
       │
       ▼
[ 3. HTTP Request ] ──► POST request dispatched to http://127.0.0.1:8000/predict
       │
       ▼
[ 4. Schema Audit ] ──► Pydantic checks request parameters against schema rules
       │
       ▼
[ 5. Inference ] ──► NumPy/Pandas converts JSON to DataFrame; runs Joblib model
       │
       ▼
[ 6. HTTP Response] ──► Returns JSON outcome {"prediction": 0/1, "result": "..."}
       │
       ▼
[ 7. UI Mapping ] ──► React maps prediction status to risk meter and clinical tips
       │
       ▼
[ 8. Cache Commit ] ──► Commits record log to local browser LocalStorage array
```

---

# Frontend Architecture

- **Pages**: Views are modularized into independent functional pages:
  - `Dashboard`: Aggregates and renders metrics stats and recent history logs.
  - `Predict`: Displays intake form fields and dynamic AI assessment outputs.
  - `History`: Lists complete client histories, search inputs, and filters.
- **Components**: Separated into generic atomic UI elements (`Button`, `Card`, `Input`) and layout wrapper assets (`Header`, `Footer`, `MainLayout`).
- **Services**: Network calls are decoupled into `api.js` (fetch wrapper) and `predictionService.js` (predict requests).
- **Routing**: Lightweight, custom state-based router controlled by `currentRoute` and `onNavigate` callbacks.
- **State Flow**: Unidirectional React props mapping, utilizing local hooks to bind DOM events.
- **LocalStorage**: Storage wrapper (`storage.js`) parses, writes, and clears history array states under the key `gluco_predict_history`.

---

# Backend Architecture

- **FastAPI**: Main application instance manages ASGI request routing and CORS setups.
- **Endpoints**:
  - `GET /health`: Diagnostic API heartbeat status check.
  - `POST /predict`: Handles patient parameter evaluation requests.
- **Model Loading**: Absolute path resolution loads `diabetes_model.joblib` once at startup using `joblib.load`.
- **Prediction Flow**: Translates JSON body arrays into a Pandas DataFrame to preserve training feature order, passes the dataframe into the model, and returns predicted class names.
- **Error Handling**: Implements validation catches (HTTP 422 for bad schema bodies) and server exceptions (HTTP 500 for runtime or file errors).

---

# Machine Learning Pipeline

The backend implements a classic batch-offline ML pipeline:

```
[ Pima Indians CSV (datasets/) ]
               │
               ▼
[ Preprocessing (data_preprocessing.py) ] ──► Nulls check, drops Outcome, splits train/test
               │
               ▼
  [ Fit Training (model_training.py) ] ────► Train Logistic Regression (max_iter=1000)
               │
               ▼
 [ Model Persistence (models/) ]       ────► joblib.dump (diabetes_model.joblib)
               │
               ▼
 [ Live Inference API (main.py) ]      ────► joblib.load & model.predict DataFrame
```

---

# Communication Flow

The frontend client communicates with the backend API via stateless HTTP REST requests:
1. **Request Header**: The frontend sends headers defining `Content-Type: application/json`.
2. **Request Body**: Sends a JSON object with PascalCase parameters mapping to the Pydantic schema model.
3. **Response Body**: The backend outputs standard JSON parameters (`prediction`, `result`) and status code `200 OK`.
4. **CORS Headers**: The backend API sends origin clearance tags to bypass browser boundary blocks.

---

# Error Handling Architecture

- **Frontend Validation**: Captures missing variables, float type errors, and range discrepancies locally before sending requests, reducing network load.
- **Backend Validation**: Pydantic schemas catch bad payloads and return standard `HTTP 422 Unprocessable Entity` validation responses.
- **API Errors**: If connection drops or API requests fail, the client catches the error and displays a descriptive alert box in the UI.
- **Prediction Errors**: Boundary validation handles model failures and outputs structured error messages.

---

# Performance Considerations

- **Model Loaded Once**: Loading the model object into memory once during Uvicorn server startup ensures subsequent API prediction latency remains under 5ms.
- **Fast API Response**: Decoupled, stateless routing maximizes API throughput.
- **LocalStorage Efficiency**: Reading and writing records locally avoids database roundtrips and optimizes search/filtering operations.
- **Production Build**: Vite generates minified chunks, removing development logs and unused files for optimal loading performance.

---

# Security Considerations

- **Cross-Origin Resource Sharing (CORS)**: Configured to allow all origins (`"*"`) for local development, which must be restricted to standard client domain paths for production.
- **Authentication**: Local development versions bypass authorization rules. Production versions must run behind JWT access controllers.
- **Input Sanitization**: Pydantic and React form hooks sanitize values to prevent injection scripts.

---

# Scalability

To transition the project from local prototyping to institutional enterprise scale:
- **Authentication**: Integrate secure login interfaces (such as Auth0 or OAuth2) to protect endpoint access.
- **Databases**: Replace LocalStorage with PostgreSQL, MongoDB, or MySQL instances for secure, persistent audit trails.
- **Cloud Deployment**: Set up pipelines to deploy FastAPI to cloud container services (AWS ECS, Google Cloud Run) with auto-scaling rules.
- **Dockerization**: Create Dockerfile images for backend and frontend apps to unify deployment states.
- **CI/CD**: Configure GitHub Actions to test, build, and deploy changes automatically.
- **Monitoring**: Add monitoring hooks to track request traffic and monitor prediction models.

---

# Future Architecture (Version 2)

```
                       ┌────────────────────────┐
                       │   React Frontend Client │
                       └───────────┬────────────┘
                                   │
                                   ▼ (HTTPS, JWT Auth)
                       ┌────────────────────────┐
                       │    NGINX Reverse Proxy │
                       └───────────┬────────────┘
                                   │
                                   ▼
                       ┌────────────────────────┐
                       │   FastAPI Web Cluster  │
                       └─────┬────────────┬─────┘
                             │            │
                             │ (Cache)    ▼ (Write Logs)
                             │          ┌──────────────────────┐
                             │          │   PostgreSQL Database│
                             │          └──────────────────────┘
                             ▼
                       ┌────────────────────────┐
                       │      Redis Cache       │
                       └────────────────────────┘
```

The next architectural iteration (Version 2) will implement:
- **PostgreSQL Database**: Relational storage to catalog patient records, clinican actions, and diagnostic metrics securely.
- **JWT Authentication**: Enforces secure login states for clinical access.
- **Redis Cache**: Caches recent calculation requests to reduce ML model processing overhead.
- **Docker & Kubernetes**: Containerizes app services to manage cluster scaling and high availability.
- **Cloud Hosting**: Deploys backend API layers on scalable container platforms.

---

# Conclusion

The Diabetes Prediction System implements a lightweight, decoupled system architecture. By separating the React frontend client from the FastAPI backend and incorporating serialized Scikit-Learn Logistic Regression estimators, the platform ensures rapid local responses, simple database configurations, and highly modular code maintenance.
