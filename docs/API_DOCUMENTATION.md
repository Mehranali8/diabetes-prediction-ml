# API Documentation

## Overview

The Diabetes Prediction System utilizes a client-server architecture where the React frontend communicates with the FastAPI backend through asynchronous HTTP REST requests. 

When a clinician submits patient data through the frontend intake interface, the client translates the camelCase form state into a PascalCase JSON payload. This payload is transmitted via a `POST` request to the backend server. The FastAPI server validates the incoming data schema, feeds the variables into a serialized XGBoost model, runs the inference pipeline, and returns the binary risk classification and result label as a JSON object.

```
┌─────────────────────────────────┐                 ┌───────────────────────────────┐
│         React Frontend          │                 │        FastAPI Backend        │
│                                 │                 │                               │
│  1. Collects Form Inputs        │                 │  3. Validates JSON Schema     │
│  2. Serializes data to JSON     ├────────────────►│  4. Runs XGBoost Inference    │
│  7. Caches logs in LocalStorage │◄────────────────┤  5. Returns JSON prediction   │
│  8. Renders risk meters         │                 │  6. HTTP CORS Allowed         │
└─────────────────────────────────┘                 └───────────────────────────────┘
```

---

## Base URL

By default, the backend API server is hosted locally at:
```text
http://127.0.0.1:8000
```

*Note: For production deployments, this base URL is updated dynamically via the `VITE_API_BASE_URL` environment variable inside the frontend compiler.*

---

## Authentication

Authentication is **currently not implemented** for local development. The API allows cross-origin requests from the React client via CORS middle-layers without authentication headers.

---

# Endpoints

## GET /health

### Purpose
Verifies the current status of the backend FastAPI service and ensures that the serialized XGBoost classification model has loaded successfully at startup.

### Request
- **Method**: `GET`
- **Path**: `/health`
- **Headers**: None required
- **Query Parameters**: None
- **Request Body**: None

### Success Response
- **HTTP Status Code**: `200 OK`
- **Content-Type**: `application/json`
- **JSON Fields**:
  - `status` (string): Current server status flag (`"healthy"`).
  - `project` (string): Title name of the backend project repository.

### Example JSON
```json
{
  "status": "healthy",
  "project": "Diabetes Prediction System"
}
```

### Possible Error Response
- **HTTP Status Code**: `500 Internal Server Error` (occurs if the `diabetes_model.joblib` file fails to load at startup).

---

## POST /predict

### Purpose
Calculates the patient's diabetes classification outcome by evaluating physiological biomarkers against the trained XGBoost model.

### Request Headers
- **Content-Type**: `application/json`

### Request Body (JSON)
The payload fields must match the PascalCase notation expected by the FastAPI backend schema.

| Parameter | Type | Required | Description | Example Value |
| :--- | :--- | :--- | :--- | :--- |
| `Pregnancies` | `Integer` | Yes | Number of times the patient has been pregnant. | `2` |
| `Glucose` | `Integer` | Yes | Plasma glucose concentration after a 2-hour oral glucose tolerance test (mg/dL). | `120` |
| `BloodPressure` | `Integer` | Yes | Diastolic blood pressure (mmHg). | `80` |
| `SkinThickness` | `Integer` | Yes | Triceps skin fold thickness (mm). | `20` |
| `Insulin` | `Integer` | Yes | 2-Hour serum insulin (µU/mL). | `85` |
| `BMI` | `Float` | Yes | Body Mass Index (weight in kg / (height in m)²). | `28.4` |
| `DiabetesPedigreeFunction` | `Float` | Yes | Diabetes pedigree genetic risk score score. | `0.47` |
| `Age` | `Integer` | Yes | Patient age in years. | `35` |

*Example Request Payload:*
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

## Success Response

- **HTTP Status Code**: `200 OK`
- **Content-Type**: `application/json`

### Response Fields

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `prediction` | `Integer` | Binary outcome value. `1` indicates positive risk (Diabetic), `0` indicates negative risk (Non-Diabetic). |
| `result` | `String` | Human-readable prediction label corresponding to the binary outcome (`"Diabetic"` or `"Non-Diabetic"`). |

### UI Translation Mapping
The React frontend receives the backend response and maps additional visual parameters on the client side:
- **`risk_level`**: Represented as a percentage slider in the UI (`prediction === 1` maps to `84%`, `prediction === 0` maps to `12%`).
- **`confidence`**: Represented as the model validation accuracy metrics (`94.2% AUC` / `89.4% F1-Score`).
- **`recommendation`**: Multi-line advice rendered conditionally on the client based on prediction outcome:
  - *Diabetic*: "Coordinate a diagnostic Fasting Plasma Glucose (FPG) test or Oral Glucose Tolerance Test (OGTT). Log daily patient glucose levels for endocrinological review."
  - *Non-Diabetic*: "Schedule standard wellness screening consults at normal annual intervals. Advise the patient to maintain regular exercise and balanced nutrition."

### Success Response Example JSON
```json
{
  "prediction": 0,
  "result": "Non-Diabetic"
}
```

---

## Validation Errors

FastAPI automatically parses the input payload against the defined Pydantic request models. If any variable is missing, is of the wrong data type (e.g., passing a string for `Glucose`), or is formatted incorrectly, the server rejects the request.

- **HTTP Status Code**: `422 Unprocessable Entity`
- **Content-Type**: `application/json`

### Validation Error Example JSON
```json
{
  "detail": [
    {
      "type": "missing",
      "loc": [
        "body",
        "Glucose"
      ],
      "msg": "Field required",
      "input": null
    }
  ]
}
```

---

## Internal Server Error

If an unhandled exception or model loading failure occurs on the server:

- **HTTP Status Code**: `500 Internal Server Error`
- **Content-Type**: `application/json`

### Internal Server Error Example JSON
```json
{
  "detail": "Internal Server Error occurred during prediction."
}
```

---

## Response Status Codes

| Status Code | Message | Description |
| :---: | :--- | :--- |
| **`200`** | `OK` | Request completed successfully. Return payload contains results. |
| **`400`** | `Bad Request` | Request parameters are malformed or invalid. |
| **`422`** | `Unprocessable Entity` | JSON request body fails Pydantic schema validation. |
| **`500`** | `Internal Server Error` | Backend server exception or model file loading error. |

---

## Backend Workflow

The following flowchart describes the operational prediction lifecycles:

```
[ React Frontend ]
       │
       ▼ (Serializes camelCase to PascalCase)
[ POST /predict Payload ]
       │
       ▼
[ FastAPI App ]
       │
       ├─► [ Input Validation ] ────► (Fail) ──► [ Return HTTP 422 ]
       │                                            (Error details)
       ▼ (Pass)
[ DataFrame Conversion ]
       │
       ▼ (Preserves training column order)
[ XGBoost Inference ]
       │
       ▼
[ Map Prediction to Label ] ──► (1 ──► "Diabetic" | 0 ──► "Non-Diabetic")
       │
       ▼
[ JSON HTTP Response ] ───► [ React Client UI Render & LocalStorage Cache ]
```

---

## Testing

### A. Testing with cURL
Run the following cURL command from your terminal to verify prediction routing:

```bash
curl -X POST "http://127.0.0.1:8000/predict" \
     -H "Content-Type: application/json" \
     -d '{
       "Pregnancies": 1,
       "Glucose": 115,
       "BloodPressure": 70,
       "SkinThickness": 30,
       "Insulin": 96,
       "BMI": 34.4,
       "DiabetesPedigreeFunction": 0.167,
       "Age": 30
     }'
```

---

### B. Testing with Postman
1. Open **Postman** and create a new request tab.
2. Select **`POST`** as the HTTP Method.
3. Enter the request URL:
   ```text
   http://127.0.0.1:8000/predict
   ```
4. Click on the **Headers** tab and add:
   - **Key**: `Content-Type`
   - **Value**: `application/json`
5. Click on the **Body** tab, select **raw**, and set the type dropdown to **JSON**.
6. Paste the following payload inside the editor:
   ```json
   {
     "Pregnancies": 6,
     "Glucose": 148,
     "BloodPressure": 72,
     "SkinThickness": 35,
     "Insulin": 0,
     "BMI": 33.6,
     "DiabetesPedigreeFunction": 0.627,
     "Age": 50
   }
   ```
7. Click **Send**. The response panel will display the status code `200 OK` and result payload.

---

## Notes

- **Environment**: This API is currently intended for local development, clinical decision support simulations, and educational purposes.
- **CORS Configuration**: CORS permissions are set to wildcard (`"*"`) for dev convenience. This should be restricted to the client's production domain when deploying.
- **Model Re-training**: To update model parameters, run the `backend/app/model_training.py` script. The API server will reload the saved `.joblib` model binary automatically.
