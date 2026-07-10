# Frontend Documentation

## Overview

The frontend of the **Diabetes Prediction System** is built as a single-page application (SPA) using React, Vite, and Tailwind CSS v4. Its primary purpose is to provide clinicians with a SaaS-style dashboard interface for patient screening, live diagnostics, and history audit logs.

### Backend Communication
The frontend communicates asynchronously with the FastAPI backend over a REST API. Intake values are captured via React states, transformed into a PascalCase JSON request payload, and dispatched using standard HTTP fetch requests. Response payloads are mapped directly into visual components (such as risk sliders, clinical explanations, and suggested next steps) and cached instantly.

### User Workflow
1. **Clinical Intake**: The clinician enters patient parameters (e.g., blood pressure, glucose) in the **Predict Risk** view.
2. **REST Estimation**: The client submits the payload, receives the model outcome, and renders the result panel.
3. **Local Caching**: The client parses the result and stores the evaluation details in browser local storage.
4. **Overview Tracking**: The **Dashboard** metrics (Total runs, Diabetic count, Non-Diabetic count, and Latest outcome) and the Recent Predictions list update dynamically.
5. **Audit Trail**: The clinician reviews, searches, and filters prediction records in the **Diagnostics Audit Logs** view.

---

# Frontend Folder Structure

The frontend application code is situated in the `frontend` folder under the `src` directory:

```text
frontend/src/
├── assets/     # Static visual assets (illustrations, icons)
├── components/ # Reusable UI component library
│   ├── common/ # Fail-safes and spinner elements (ErrorBoundary)
│   ├── layout/ # Structural layout components (Header, Footer, MainLayout)
│   └── ui/     # Standard visual inputs and selectors (Button, Card, Input)
├── constants/  # Static key codes, options, and system arrays
├── hooks/      # Custom state managers (useForm)
├── pages/      # View layouts (Dashboard, Predict, History, NotFound)
├── routes/     # Route navigation switchboard (AppRoutes)
├── services/   # REST request configurations (api, predictionService)
├── styles/     # Core styling system (index.css)
└── utils/      # Client helpers (storage)
```

---

# Layout Architecture

The overall layout follows a SaaS dashboard blueprint, managed by structural layout components:

- **Header (`Header.jsx`)**: Stays sticky at the top, housing branding logos, client status tags, and user clinician profiles.
- **Sidebar (`MainLayout.jsx`)**: Contains the primary portal navigation buttons. In desktop views, it remains docked on the left; in mobile views, it slides out dynamically via a menu hamburger toggle.
- **Main Content**: A responsive container nested on the right of the sidebar, incorporating page margins (`max-w-7xl mx-auto space-y-6`).
- **Footer (`Footer.jsx`)**: Renders at the bottom of the content container, detailing HL7 integration standards, HIPAA compliance tags, and clinical liability disclaimers.
- **Responsive Layout**: Adapts automatically. Columns collapse into single-column layouts on mobile viewports, grid paddings adjust, and connection indicators transition smoothly.

---

# Pages

## Dashboard

The **Dashboard** serves as the central clinical workspace:
- **Analytics Cards**: Four card modules illustrating total screenings, diabetic flags, normal range outcomes, and the latest prediction result. Uses the polished `Card` component with visual hover translations (`hover:-translate-y-1`).
- **Recent Predictions**: Renders a table of the latest 5 screening logs, detailing timestamp, glucose levels, age, and classification badges.
- **Quick Actions**: Provides direct navigation access to "New Prediction" and "View History," alongside a "Clear Prediction History" action featuring an inline double-confirmation alert.
- **Empty State**: Automatically replaces metrics and history listings with a diagnostic folder icon, a short message, and a call-to-action button to execute the first prediction when storage is empty.

---

## Predict

The **Predict** page acts as the intake console:
- **Patient Form**: Collects 8 patient physiological biomarkers using standardized form inputs.
- **Validation**: Integrates validation parameters on submit (required states, integer boundaries, float metrics) to prevent API mismatches.
- **Backend Integration**: Calls `predictionService.predictRisk` asynchronously to send input values.
- **Loading State**: Displays a spin loading indicator and an "Evaluating Biomarkers" status overlay during backend API calculations.
- **Result Card**: Displays the classification result with a color-coded badge.
- **Risk Indicator**: Features a gradient progress bar tracking the estimated risk level (`bg-gradient-to-r from-emerald-500 to-green-500` or `bg-gradient-to-r from-red-500 to-orange-500`).
- **Recommendation**: Displays suggested clinical actions based on the outcome.

---

## History

The **History** page is the client-side audit panel:
- **Prediction History**: Lists all patient evaluations in a dense responsive data table.
- **LocalStorage**: Loads stored history arrays on component mount.
- **Search**: A live search bar filtering logs dynamically by result strings, glucose levels, age, or timestamps.
- **Filter**: Dropdown buttons to filter logs by risk classification categories ("All", "Diabetic", "Non-Diabetic").
- **Clear History**: A purge control button with inline warning prompts to prevent accidental database deletes.
- **Empty State**: Renders a medical checklist folder illustration when no records match filter query terms.

---

# Components

Reusable components are structured inside `src/components`:

| Component | Category | Purpose |
| :--- | :--- | :--- |
| **`Header`** | Layout | Branding, portal status, profile avatar, menu triggers. |
| **`Sidebar`** | Layout | Core navigation buttons with active link gradients. |
| **`Footer`** | Layout | Liability disclaimers, HIPAA and HL7 certification badges. |
| **`Card`** | UI | Rounded-2xl container panel supporting hover shadow transitions. |
| **`Button`** | UI | Standard button component with click scale-down effects. |
| **`Input`** | UI | Rounded-xl input text fields with validation error feedback. |
| **`AppRoutes`** | Routes | Switchboard executing zero-dependency routing state maps. |
| **`ErrorBoundary`** | Common | Catches React runtime faults and displays a polished reload panel. |

---

# Routing

The application employs a **custom, state-based routing model** without `react-router-dom` to optimize performance and bundle sizes:
- Navigation is controlled by the `currentRoute` state inside `App.jsx`.
- The `AppRoutes.jsx` handler intercepts `currentRoute` changes and mounts pages conditionally inside `MainLayout`:
  - **Dashboard**: Mapped to `/` or `/dashboard`.
  - **Predict**: Mapped to `/predict`.
  - **History**: Mapped to `/history`.
- Page buttons transition pages programmatically by invoking the `onNavigate` state prop.

---

# LocalStorage

### Purpose
LocalStorage is used to cache patient screening history on the client side without database overhead, ensuring immediate reads, zero server database setup, and offline accessibility.

### Data Structure
History records are stored as an array of JSON objects under the storage key `gluco_predict_history`:
```json
[
  {
    "id": "1720632468000",
    "timestamp": "Jul 10, 2026, 10:47:48 AM",
    "inputs": {
      "pregnancies": "2",
      "glucose": "135",
      "bloodPressure": "82",
      "skinThickness": "24",
      "insulin": "90",
      "bmi": "29.4",
      "diabetesPedigree": "0.38",
      "age": "32"
    },
    "prediction": 0,
    "result": "Non-Diabetic"
  }
]
```

### Advantages
- **Instant Writes & Reads**: Zero backend network calls needed to load logs.
- **Persistence**: Retains patient data across tab and browser closures.
- **Privacy**: Patient diagnostic inputs never leave the clinician's machine unless a prediction request is actively sent.

### Limitations
- **Storage Limit**: Capped by browsers at ~5MB of data space.
- **Lack of Access Control**: Data is unencrypted on the client device.
- **Data Volatility**: Susceptible to data loss if browser caches are cleared.

---

# API Integration

The API client layer is defined in `src/services/api.js` and `predictionService.js`:

```
   [ Predict Form ]
          │
          ▼ (Intake Submit validation)
[ predictionService.predictRisk ]
          │
          ▼ (POST request via fetch)
    [ API Server ] 
          │
          ▼ (Processes response JSON)
  [ predictionResult ] ───► Mapped to: Outcome badge, risk slider, suggestions
```

---

# Responsive Design

Responsive layout break points are implemented using standard Tailwind media selectors:
- **Desktop (md/lg)**: Left sidebar remains docked (`md:pl-64`); grid margins adapt for multi-column panels.
- **Tablet (sm/md)**: Form inputs split into 2 columns; table records show horizontal scroll bars.
- **Mobile (xs/sm)**: Sidebars hide into slide-out drawers; intake forms collapse into a single-column block; tables hide secondary columns.

---

# Design System

The application design is built on visual styles configured via Tailwind CSS v4:

- **Color Palette**:
  - *Main Background*: `bg-slate-50` (light mode), `bg-slate-950` (dark mode).
  - *Accent Accents*: `bg-blue-600` (primary actions), `bg-emerald-600` (safe outcomes), `bg-red-600` (high risk).
- **Typography**: Uses modern sans-serif (`font-sans`) font stacks, standard weight settings, and tracking modifiers (`tracking-tight`).
- **Cards**: Configured with `rounded-2xl` corners, subtle borders (`border-slate-150`), and shadow transitions (`hover:shadow-md`).
- **Buttons**: Configured with `rounded-xl` corners and click-scaling properties (`active:scale-[0.98]`).
- **Shadows**: Soft client shadows (`shadow-sm`, `shadow-md`) with custom opacity definitions.
- **Transitions**: Smooth animations on interactive elements (`transition-all duration-200`).

---

# Performance Optimizations

- **Reusable Component Architecture**: UI inputs, cards, and buttons are built as standalone reusable units to keep code DRY.
- **Optimized Rendering**: Routing states are lightweight and avoid re-rendering entire layout wrappers.
- **Minimal Dependencies**: The project depends strictly on React core modules, keeping compiled scripts small.
- **Vite Bundler**: Generates optimized production assets through chunk compression.

---

# Future Frontend Improvements

- **Dark Mode Switch**: Add a header button to toggle light/dark modes.
- **Visual Analytics Charts**: Add line graphs (using Recharts or Chart.js) to track patient glucose and BMI trends.
- **Exporting Options**: Enable printing or exporting PDF summaries of patient outcomes.
- **Clinician Portals**: Integrate authentication screens.
- **Real-Time Alerts**: Implement pop-up toast notifications.
- **Cloud Syncing**: Sync localStorage arrays to a secure backend database automatically.

---

# Conclusion

The Diabetes Prediction System frontend is a responsive Single Page Application. By utilizing utility managers, client storage caches, and decoupled REST APIs, it provides an intuitive, high-performance portal for clinical diagnostics.
