# Backend Documentation

## Overview

The backend of the **Diabetes Prediction System** is structured as a light, high-performance microservice. Its primary objective is to serve real-time diagnostic classification outcomes by exposing a pre-trained machine learning model through a RESTful API.

### Key Backend Responsibilities
- **API Engine (FastAPI)**: Manages ASGI routing, handles request-response parsing, CORS cross-origin configuration, and runs input validation checks using Pydantic.
- **Machine Learning Inference**: Receives patient biomarkers, runs them through the serialized classifier model, maps the output, and returns the classification results.
- **Decoupled Frontend Communication**: Accepts standard JSON payloads from the React front-end client and outputs standardized HTTP response payloads on port `8000`.

---

# Backend Folder Structure

The backend source code is organized within a dedicated `backend` directory layout:

```text
backend/
├── app/
│   ├── __init__.py           # Declares app folder as a Python package
│   ├── main.py               # API routes, CORS configs, model loader, endpoints
│   ├── data_preprocessing.py # Dataset parsing, duplicate audits, train/test splitters
│   └── model_training.py     # Scikit-Learn training, scoring, joblib serializations
```

### File Purposes
1. **`main.py`**: The core operational file for the API. It handles server startup, loads the binary model file into memory once, maps CORS, and processes `/predict` payload submissions.
2. **`data_preprocessing.py`**: Contains data cleaning routines. It audits datasets for missing cells and duplicated rows, separates the target label column, and performs stratified test-train splits.
3. **`model_training.py`**: The ML engineering training pipeline. It runs preprocessing, fits a `LogisticRegression` model on the dataset splits, logs classification accuracy scores, and dumps the binaries using Joblib.

---

# Main Components

## main.py

The main program file initializes the REST server and maps the model prediction endpoints:
- **FastAPI Initialization**: Instantiated with custom title and metadata headers, running on Uvicorn.
- **CORS Configuration**: Configured using `CORSMiddleware` with wildcard rules (`"*"`) for local client access.
- **Loading ML Model**: Resolves absolute file system paths to `models/diabetes_model.joblib` and loads the binary into memory using `joblib.load(model_path)` during server startup.
- **Health Check Endpoint (`GET /health`)**: A baseline health checker that reports server and model connectivity details.
- **Prediction Endpoint (`POST /predict`)**: Takes validated Pydantic payloads (`DiabetesInput`), builds a Pandas DataFrame containing feature column headers, executes `model.predict(input_df)`, and returns the final mapped category.

---

## data_preprocessing.py

This module contains clean methods to load and preprocess datasets before ML training:
- **Dataset Loading**: Reads the Pima Indians dataset (`diabetes.csv`) using Pandas `read_csv` with path-existence checks.
- **Missing Value Auditing**: Calculates null cell tallies via `df.isnull().sum()` to prevent model fitting errors.
- **Duplicate Checking**: Scans rows using `df.duplicated().sum()` to identify data redundancy.
- **Feature Extraction**: Drops the binary `"Outcome"` target column from the features dataset (`X`) and extracts the outcome column as target (`y`).
- **Train/Test Split**: Executes a reproducible stratified train-test split using Scikit-Learn's `train_test_split` (`test_size=0.20`, `random_state=42`, `stratify=y`).

---

## model_training.py

This module executes the model fitting pipeline and serializes the classifier:
- **Loading Dataset**: Calls `prepare_dataset` to obtain preprocessed, stratified training and test data arrays.
- **Logistic Regression Initialization**: Instantiates Scikit-Learn's `LogisticRegression` classifier with reproducible random states (`random_state=42`, `max_iter=1000`).
- **Model Training**: Fits the Logistic Regression algorithm on the training features (`X_train`) and outcome vectors (`y_train`) using `model.fit`.
- **Evaluation**: Performs predictions on test splits and logs accuracy metrics, confusion matrices, and detailed classification reports (precision, recall, F1-scores).
- **Saving Trained Model**: Creates the target output folder path `models/` (if missing) and serializes the model object to `diabetes_model.joblib` using `joblib.dump`.

---

# Machine Learning Pipeline

The machine learning data flow is organized as follows:

```
[ Pima Indians Dataset (diabetes.csv) ]
                  │
                  ▼
    [ prepare_dataset (Pandas) ]
                  │
                  ├─► Checks for Missing Cells & Duplicates
                  ├─► Splits Features (X) & Targets (y)
                  └─► Stratified Train/Test Partition (80/20)
                  │
                  ▼
     [ model.fit (Scikit-Learn) ] ────► Train Logistic Regression (max_iter=1000)
                  │
                  ▼
    [ Model Evaluation Metrics ]  ────► Logs Accuracy & Confusion Matrix
                  │
                  ▼
  [ Serialization (joblib.dump) ] ────► Writes models/diabetes_model.joblib
                  │
                  ▼
        [ main.py API Server ]    ────► Loads model binary at startup
                  │
                  ▼
    [ POST /predict Inference ]   ────► Runs live predictions on patient payloads
```

---

# Request Lifecycle

The diagram below details the journey of a prediction request from the user interface:

```
  [ Clinician Frontend UI ]
              │
              ▼ (REST POST to http://127.0.0.1:8000/predict)
      [ FastAPI Routing ]
              │
              ▼
   [ Pydantic Input Check ] ────► (Invalid) ────► [ HTTP 422 Error Response ]
              │ (Valid)
              ▼
   [ Pandas DataFrame Map ] ────► Formats columns in training layout order
              │
              ▼
 [ Joblib Classifier Predict ] ──► Classifies feature matrix outcome (1 or 0)
              │
              ▼
    [ JSON Mapped Result ]  ────► Returns outcome result label and status index
```

---

# Error Handling

The API employs structured error handling to ensure service stability:

- **Missing Model Error**: During server initialization, `main.py` checks for the existence of `models/diabetes_model.joblib`. If missing, the app raises a descriptive `FileNotFoundError` and halts startup to prevent blank inferences.
- **Invalid Request Schema**: If request payload fields are missing, malformed, or mismatch defined schemas (e.g., age as a float), FastAPI's Pydantic module throws a validation exception and outputs an `HTTP 422 Unprocessable Entity` response with coordinate error traces.
- **Internal Server Exception**: Any unhandled backend exception during inference catches inside FastAPI's error middlewares, returning a clean `HTTP 500 Internal Server Error` block while printing stack traces to server logs for developer inspection.

---

# Dependencies

Backend operational dependencies are defined in `requirements.txt`:

| Package | Version | Purpose |
| :--- | :--- | :--- |
| **`fastapi`** | `0.139.0` | ASGI framework for REST API routing and endpoints. |
| **`uvicorn`** | `0.51.0` | Light ASGI server implementation to host FastAPI locally. |
| **`pydantic`** | `2.13.4` | Data validation schemas and serialization parser. |
| **`pandas`** | `3.0.3` | Structuring API requests into standard dataframes. |
| **`numpy`** | `2.5.1` | Scientific matrix mathematics support. |
| **`scikit-learn`**| `1.9.0` | Machine Learning algorithms, metrics, and splitting utilities. |
| **`joblib`** | `1.5.3` | Serializing and reloading persistent ML models. |

---

# Performance Notes

- **Startup Model Loading**: The persistent model binary (`diabetes_model.joblib`) is loaded into memory only **once** when the FastAPI application starts up.
- **Inference Latency Optimization**: By avoiding model reload loops during request routing, prediction endpoints require minimal processing overhead. Live inferences execute in under 5ms, optimized for real-time decision support systems.

---

# Security Considerations

- **Authentication Profile**: The current iteration contains **no user authentication layers** and is configured strictly for local development and testing.
- **Cross-Origin Resource Sharing (CORS)**: Allowed origins are set to wildcards (`"*"`) for local port testing convenience. This should be restricted to client domain headers in production.
- **Future Security Updates**: Production deployments must secure API ports by implementing SSL/TLS HTTPS certificates and enforcing authentication tokens (JWT).

---

# Future Backend Improvements

To scale this clinical platform for institutional deployment:
- **JWT Authentication**: Secure prediction endpoints behind JWT token access rules to prevent unauthorized queries.
- **Database Integration**: Set up PostgreSQL or MongoDB to log historical audit outputs rather than relying on local browser cache persistence.
- **Logging & Monitoring**: Add python logging outputs and metrics trackers (like Prometheus/Grafana) to trace model inference metrics.
- **Dockerization**: Containerize the FastAPI backend and React frontend with Docker to standardize environmental setup across developer stations.
- **Cloud Deployment**: Set up pipelines to deploy FastAPI to cloud providers (AWS, GCP, or Azure) with auto-scaling rules.

---

# Conclusion

The backend architecture of the Diabetes Prediction System provides a clean, modular python microservice. By isolating data preparation, model training, and API server runtime processes, the backend ensures simple code maintenance, robust schema validation, and high-performance inference operations.
