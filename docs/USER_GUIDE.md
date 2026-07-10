# User Guide

## Introduction

Welcome to the **Diabetes Prediction System User Guide**. This platform is a clinical decision support application designed to estimate a patient's diabetes risk using key physiological indicators. 

### Target Audience
This application is designed for **healthcare professionals, endocrinology clinicians, and researchers** seeking a rapid diagnostic screening aid to gauge patient risk index boundaries.

### Diagnostic Workflow
```
[ Open Portal ] ──► [ Enter Patient Parameters ] ──► [ Evaluate Risk ]
                                                             │
                                                             ▼
[ Review Audits ] ◄── [ Save to Caching History ] ◄── [ Map Clinical Tips ]
```

---

# Application Overview

The platform is designed as a single-page SaaS dashboard divided into three main workspaces:
1. **Dashboard**: The central clinical hub, aggregating live screening stats, recent patients evaluated, and quick action shortcuts.
2. **Predict Risk**: The diagnostic portal featuring standard physiological intake form fields and real-time risk classification readouts.
3. **Diagnostics Audit Logs (History)**: An audit workspace housing all logged patient screenings, with searching, filtering, and history purging capabilities.

---

# Dashboard

Upon launching the application, you are presented with the central **Clinical Dashboard**:

- **Analytics Cards**: Four overview panels displaying:
  - **Total Predictions**: Total patient screenings run on this system.
  - **Diabetic Predictions**: Number of cases flagged as high risk.
  - **Non-Diabetic Predictions**: Number of cases classified in the normal physiological range.
  - **Latest Prediction**: The status and timestamp of the most recent diagnostic run.
- **Recent Predictions**: A responsive table displaying the **5 most recent screening logs** for quick reference.
- **Quick Actions**: Navigation shortcuts allowing clinicians to launch new calculations, view history, or clear historical logs.
- **Empty State**: If no screenings have been recorded in the current session, the dashboard displays a clean "No Data Available" folder icon, prompting you to run your first diagnostic screening.
- **Dashboard Navigation**: Sidebar controls let you move between the Dashboard, Predict, and History views.

---

# Predict Page

The **Predict Risk** page houses the patient parameter entry form and the real-time AI estimation panel.

### Performing a Prediction

Enter the patient's diagnostic values into the form fields:

1. **Pregnancies**: Count of times the patient has been pregnant.
   - *Validation*: Integer value between `0` and `20`.
2. **Plasma Glucose**: 2-Hour oral glucose tolerance test value (mg/dL).
   - *Validation*: Integer value between `0` and `300`.
3. **Diastolic Blood Pressure**: Diastolic blood pressure reading (mmHg).
   - *Validation*: Integer value between `0` and `200`.
4. **Triceps Skin Fold Thickness**: Triceps skin fold measurement (mm).
   - *Validation*: Integer value between `0` and `99`.
5. **2-Hour Serum Insulin**: 2-Hour serum insulin levels (µU/mL).
   - *Validation*: Integer value between `0` and `900`.
6. **Body Mass Index (BMI)**: Body Mass Index parameter (weight in kg / (height in m)²).
   - *Validation*: Decimal value between `10.0` and `70.0`.
7. **Diabetes Pedigree Function**: Genetic hereditary risk index score.
   - *Validation*: Decimal value between `0.05` and `3.00`.
8. **Age**: Patient age in years.
   - *Validation*: Integer value between `0` and `120`.

### Form Submission
Click the **Evaluate Risk** button. If any field fails validation checks (e.g., leaving a field empty or entering a value out of range), the system displays red error badges under the corresponding fields and blocks submission.

### Loading State
Upon successful submission, the system displays an **Evaluating Biomarkers** status overlay. The backend API processes inputs in under 5ms, yielding near-instant results.

---

### Understanding the AI Diagnostic Result Card
Once classification completes, a result card mounts displaying:
- **Prediction Result**: A colored badge indicating the classification outcome:
  - **`Diabetic`** (Red): Indicates a high risk profile.
  - **`Non-Diabetic`** (Green): Indicates standard physiological metrics.
- **Estimated Risk Index**: A dynamic slider displaying risk as a percentage (typically `84%` for high-risk flags and `12%` for normal profiles).
- **Assessment Status**: Marked as `"Analysis Verified"` once evaluated against backend schemas.
- **Model Confidence**: Displays the validation performance of the underlying classifier model (`94.2% AUC`).
- **Clinical Recommendation**: Conditional clinician advice based on the patient's risk profile.
- **Timestamp**: The date and time of the screening.

---

# Prediction History

The **Diagnostics Audit Logs** workspace keeps a detailed record of all evaluations:

- **Automatic History Saving**: The system automatically caches every successful prediction in the client browser's local cache.
- **LocalStorage**: Patient records persist across browser reboots. 
- **Search**: A live search field filters log entries instantly. You can search by results, glucose levels, age, or dates.
- **Filter**: Filter tabs let you group logs by clinical outcomes ("All", "Diabetic", "Non-Diabetic").
- **Clear History**: Clears the local browser cache. Requires clicking through confirmation alerts to prevent accidental deletions.

---

# Quick Actions

Dashboard quick action buttons help streamline clinician workflows:
1. **New Prediction**: Routes you to the **Predict Risk** intake console.
2. **View History**: Routes you to the **Diagnostics Audit Logs** workspace.
3. **Clear Prediction History**: Launches a double-confirmation workflow to clear cached logs.

---

# Understanding Prediction Results

The system categorizes patient profiles as follows:

| Classification | Mapped Indicator | Risk slider | Clinical Guidance |
| :---: | :---: | :---: | :--- |
| **`Diabetic`** | Red Warning Badge | `84%` | High probability of diabetes. A diagnostic Fasting Plasma Glucose (FPG) test or Oral Glucose Tolerance Test (OGTT) is recommended. |
| **`Non-Diabetic`** | Green Normal Badge | `12%` | Low risk. Patient should maintain standard wellness schedules and lifestyle habits. |

> [!WARNING]
> **Diagnostic Disclaimer**: This system uses a machine learning classifier model and is designed for educational and decision-support purposes only. It does not replace professional clinical judgment, physical examinations, or formal laboratory tests.

---

# Common Errors

| Error Symptom | Possible Cause | Recommended Resolution |
| :--- | :--- | :--- |
| **"Failed to connect to API server"** | The FastAPI backend server is offline or not running. | Verify that uvicorn/FastAPI is running (`python app/main.py` or port `8000`). |
| **Red validation label under inputs** | The entered value is missing or out of valid clinical bounds. | Double-check input values against the range parameters specified on the form. |
| **"No Data Available" empty states** | No screenings have been run, or browser cache files were cleared. | Navigate to the **Predict Risk** tab and submit a new patient screening request. |
| **CORS block warnings in console** | Client-origin headers mismatch API server middleware rules. | Ensure FastAPI middleware allows client access (`allow_origins=["*"]`). |

---

# Frequently Asked Questions (FAQ)

### Q: How is the prediction generated?
The system passes patient parameters to a pre-trained **Logistic Regression** classifier model. The model calculates the likelihood of diabetes based on coefficients derived from the Pima Indians dataset.

### Q: Where is prediction history stored?
History logs are stored locally in your browser's **LocalStorage**. No patient identifiers or parameters are transmitted to external databases.

### Q: Can prediction history be deleted?
Yes. Click the **Clear Prediction History** action button on the Dashboard or History pages and confirm the action.

### Q: Is an internet connection required?
No. When hosted locally, both the React client and FastAPI server process requests offline.

### Q: Can this application replace a doctor's diagnosis?
**No.** This is a screening support tool. All risk flags must be confirmed through formal clinical diagnostic methods.

---

# Best Practices

- **Validate Input Units**: Ensure parameters match the expected units (e.g., BMI, mg/dL for glucose) before submitting the form.
- **Regular Backups**: If you use the audit log for research, copy or document results regularly, as clearing browser cookies or data will delete the history.
- **Secure Workstations**: Log out of client machines or use private browsing modes if working on shared clinical terminals to protect patient data.

---

# Future Enhancements

Future platform versions plan to integrate:
- **User Authentication**: Secure portals to prevent unauthorized access.
- **Cloud Database Integration**: Database persistence to replace local browser caching.
- **Prediction Reports**: Downloadable and printable patient diagnostic PDF sheets.
- **Export History**: CSV export actions for clinical research.
- **Doctor Dashboard**: Dedicated analytics panels to track patient indicators over time.
- **Notifications**: Toast alerts for server status changes and validation errors.
- **System Dark Mode**: A dark/light theme toggle.

---

# Conclusion

The Diabetes Prediction System provides a fast, responsive clinical screening dashboard. By pairing a simple intake form with a lightweight machine learning microservice, the application helps streamline clinical decision workflows and patient risk tracking.
