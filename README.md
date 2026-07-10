# Diabetes Prediction System 🩺

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Scikit-Learn](https://img.shields.io/badge/scikit_learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

A professional, clinical-grade decision support platform designed to estimate patient diabetes risk. The system incorporates an offline machine learning classifier model trained on the Pima Indians Dataset, exposed via a fast **FastAPI** backend, and managed with a premium SaaS-style **React + Vite** dashboard styled using **Tailwind CSS v4**.

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Installation](#-installation)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
6. [API Endpoints](#-api-endpoints)
7. [Machine Learning Model](#-machine-learning-model)
8. [Screenshots](#-screenshots)
9. [Documentation Directory](#-documentation-directory)
10. [Future Improvements](#-future-improvements)
11. [License](#-license)
12. [Author](#-author)

---

## 🔍 Project Overview

The **Diabetes Prediction System** serves as a clinical screening aid. Clinicians can enter physiological diagnostic parameters (such as Glucose levels, Insulin count, and BMI) through an intuitive UI. The system processes these attributes through a machine learning classification pipeline, visualizes the risk indexes dynamically, and caches historical data in local storage for auditing and review.

> [!IMPORTANT]
> **Clinical Disclaimer**: This application is a decision support tool utilizing statistical estimations. Diagnostic outcomes are predictive indexes and should not be used as the sole criteria for medical diagnoses, treatment planning, or prescriptions.

---

## ✨ Features

- **📊 Clinical SaaS Dashboard**: Displays real-time statistics (Total predictions, Diabetic vs. Non-diabetic outcomes, Latest prediction metadata).
- **📋 Interactive Intake Form**: Full validation of input parameters (ranges, numerical types, required states) to ensure data sanity.
- **🧬 AI Assessment Panel**: Real-time evaluation feedback containing calculated risk levels, model metrics, clinical explanations, and suggested medical steps.
- **🔍 Audit Logs & Search**: A diagnostic history panel to filter, search, and view historical records directly.
- **⚡ Tactile Micro-Animations**: Elegant transitions, glowing focus states, Connection-status pulses, and click scaling animations.
- **💾 Zero-loss Session Storage**: Automatic caching using the client browser's `LocalStorage` with safe recovery and history wipe confirmations.
- **📱 Responsive Layout**: Designed for optimal rendering across smartphone, tablet, and widescreen desktop displays.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React (v19.2), HTML5, ES6 | SPA framework & reactive rendering |
| **Frontend Style** | Tailwind CSS v4 | SaaS Layout, Dark Mode, Transitions |
| **Frontend Bundler**| Vite (v8.1) | Hot Module Replacement (HMR) & build compiling |
| **Backend Framework**| FastAPI (v0.139) | High-performance async REST API endpoints |
| **WSGI/ASGI Server** | Uvicorn (v0.51) | Serving backend APIs locally |
| **Machine Learning** | Logistic Regression, Scikit-Learn | Binary classification model & ML pipeline |
| **Data & Serialization**| Pandas, Joblib | Dataframe mappings and model persistence |
| **Environment** | Python (v3), Node.js, LocalStorage | System runtime & Client caching |

---

## 📂 Project Structure

```text
diabetes-prediction/
├── backend/                  # FastAPI Python Backend
│   └── app/
│       ├── __init__.py
│       ├── main.py           # REST endpoints, CORS & Uvicorn config
│       ├── model_training.py # Model fitting script (Logistic Regression)
│       └── data_preprocessing.py # Preprocessing & scaling utilities
├── datasets/                 # Datasets
│   └── diabetes.csv          # Pima Indians Dataset source
├── docs/                     # Technical Documentation Directory
│   ├── API_DOCUMENTATION.md  # Detailed API specs
│   ├── BACKEND_DOCUMENTATION.md # Backend architecture details
│   ├── FRONTEND_DOCUMENTATION.md # Frontend codebase structure
│   ├── PROJECT_ARCHITECTURE.md # High-level architecture mapping
│   └── USER_GUIDE.md         # Clinician user guide & troubleshooting
├── frontend/                 # React SPA Frontend
│   ├── public/               # Public assets
│   ├── src/                  # App source
│   ├── index.html
│   ├── package.json          # Node dependencies
│   └── vite.config.js
├── models/                   # Serialized Models
│   └── diabetes_model.joblib # Persistent trained classifier file
├── requirements.txt          # Python dependencies
└── README.md                 # Root documentation (this file)
```

---

## ⚙️ Installation

Follow these steps to set up and run the Diabetes Prediction System locally.

### Prerequisites
- **Python 3.8+** installed on your system.
- **Node.js 18+** and `npm` installed.

---

### Backend Setup
1. Open a terminal and navigate to the project root:
   ```bash
   cd diabetes-prediction
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # On Windows
   python -m venv .venv
   .venv\Scripts\activate
   
   # On macOS/Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI backend server:
   ```bash
   # From root using Python module execution
   python backend/app/main.py
   ```
The backend API server will start, listening on `http://127.0.0.1:8000`. You can access the automatic interactive API documentation (Swagger UI) at `http://127.0.0.1:8000/docs`.

---

### Frontend Setup
1. Open a new terminal session and navigate to the `frontend` directory:
   ```bash
   cd diabetes-prediction/frontend
   ```
2. Install the frontend Node dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web interface in your browser:
   Open [http://localhost:5173](http://localhost:5173) to view the SaaS dashboard portal.

---

## 🔌 API Endpoints

The backend exposes two REST endpoints on port `8000`:

| Method | Endpoint | Description | Sample Response |
| :---: | :--- | :--- | :--- |
| **`GET`** | `/health` | Heartbeat status check of FastAPI and loaded model status. | `{"status": "healthy", "project": "..."}` |
| **`POST`**| `/predict` | Calculates risk categorization using diagnostic metrics. | `{"prediction": 0, "result": "Non-Diabetic"}` |

### Predict Payload Example:
```json
{
  "Pregnancies": 2,
  "Glucose": 120,
  "BloodPressure": 80,
  "SkinThickness": 20,
  "Insulin": 85,
  "BMI": 28.4,
  "DiabetesPedigreeFunction": 0.47,
  "Age": 35
}
```

---

## 🧠 Machine Learning Model

- **Algorithm**: **Logistic Regression** (Scikit-Learn).
- **Validation Accuracy**: `71.43%` on test data split.
- **Serialization**: Saved as `models/diabetes_model.joblib` and loaded once at API startup to minimize latency.
- **Model Re-training**:
  To fit new model weights on the Pima Indians dataset:
  ```bash
  python backend/app/model_training.py
  ```

---

## 📸 Screenshots

*Below are placeholders for the interface dashboard pages. Visual assets can be stored in the `/screenshots` folder.*

### A. Clinical SaaS Dashboard Overview
*Placeholder for Dashboard view featuring analytics summary cards, connection indicators, and recent screening logs.*
`![Dashboard Portal View](/screenshots/dashboard_mockup.png)`

### B. Intake Calculator & Result Panels
*Placeholder for the interactive intake form panel and real-time classification meter readout.*
`![Risk Calculator Form](/screenshots/predict_mockup.png)`

---

## 📖 Documentation Directory

We have written detailed markdown manuals for developers and clinicians inside the `docs` folder:
- 🔌 **[API Documentation](file:///d:/ML-Projects/diabetes-prediction/docs/API_DOCUMENTATION.md)**: REST endpoints request/response schemas, validation rules, cURL, and Postman examples.
- ⚙️ **[Backend Documentation](file:///d:/ML-Projects/diabetes-prediction/docs/BACKEND_DOCUMENTATION.md)**: Python scripts analysis, preprocessing models, and dependency tables.
- 💻 **[Frontend Documentation](file:///d:/ML-Projects/diabetes-prediction/docs/FRONTEND_DOCUMENTATION.md)**: Component architectures, routing systems, design tokens, and local cache specs.
- 🏗️ **[Project Architecture](file:///d:/ML-Projects/diabetes-prediction/docs/PROJECT_ARCHITECTURE.md)**: High-level client-server layouts, data flows, validation boundaries, and future microservice designs.
- 📘 **[Clinician User Guide](file:///d:/ML-Projects/diabetes-prediction/docs/USER_GUIDE.md)**: Portal layouts guide, input validation ranges, clinical tips, FAQs, and diagnostic troubleshooting steps.

---

## 🚀 Future Improvements

- **Secure Clinician Authentication**: Adding JSON Web Token (JWT) secure role-based portals for login/logout workflows.
- **Database Logs**: Replace local storage cache loops with PostgreSQL database logs.
- **Visual Analytics Charts**: Introducing responsive graphs to track patient indicators over time.
- **Exporting Options**: Enable printing or exporting PDF summaries of patient outcomes.

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## ✍️ Author

**Mehran Ali**  
Endocrinology Decision Support Systems Development  
*For clinical feedback, technical integrations, or issues, open a GitHub project issue.*
