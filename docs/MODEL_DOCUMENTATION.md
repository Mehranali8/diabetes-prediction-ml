# Model Documentation

## Overview

The machine learning component of the **Diabetes Prediction System** is a classification model designed to estimate the statistical likelihood of diabetes in patients. Based on eight key physiological parameters, the model performs binary classification, sorting patient outcomes into either a high-risk range (Diabetic) or a low-risk range (Non-Diabetic).

### Backend Integration
The pre-trained model is serialized and saved as a binary file (`diabetes_model.joblib`). During FastAPI startup, the backend server loads this model file once into memory using `joblib.load`. When a client calls the `/predict` endpoint with patient diagnostic parameters, the API converts the incoming JSON data to a Pandas DataFrame, passes the feature matrix to the loaded model instance, and runs the `predict()` function. This decoupled setup separates backend server logic from the model training process, ensuring predictions remain fast and efficient.

---

## Dataset

The model is trained on a localized subset of clinical diagnostic markers:
- **Dataset Name**: Pima Indians Diabetes Database
- **Source**: National Institute of Diabetes and Digestive and Kidney Diseases
- **Number of Features**: 8 physiological features
- **Target Variable**: `Outcome` (binary indicator)
- **Feature Names**: `Pregnancies`, `Glucose`, `BloodPressure`, `SkinThickness`, `Insulin`, `BMI`, `DiabetesPedigreeFunction`, `Age`
- **Target Classes**:
  - `0`: Non-Diabetic (Low-risk physiological parameters)
  - `1`: Diabetic (High-risk physiological parameters)

### Feature Descriptions
1. **Pregnancies**: Count of times the patient has been pregnant.
2. **Glucose**: Plasma glucose concentration tested 2 hours after an oral glucose tolerance test (mg/dL).
3. **BloodPressure**: Diastolic blood pressure reading (mmHg).
4. **SkinThickness**: Triceps skin fold thickness measurement (mm).
5. **Insulin**: 2-Hour serum insulin levels (mu U/ml).
6. **BMI**: Body Mass Index parameters, calculated as weight in kilograms divided by the square of height in meters.
7. **DiabetesPedigreeFunction**: Genetic risk score calculating diabetes history across generations.
8. **Age**: Patient age in years.

---

## Feature Description Table

| Feature | Data Type | Description | Example |
| :--- | :--- | :--- | :--- |
| **`Pregnancies`** | `Integer` | Count of times the patient has been pregnant. | `2` |
| **`Glucose`** | `Integer` | Plasma glucose concentration after 2-hour oral tolerance test (mg/dL). | `120` |
| **`BloodPressure`** | `Integer` | Diastolic blood pressure (mmHg). | `80` |
| **`SkinThickness`** | `Integer` | Triceps skin fold thickness (mm). | `20` |
| **`Insulin`** | `Integer` | 2-Hour serum insulin level (µU/mL). | `85` |
| **`BMI`** | `Float` | Body Mass Index (weight in kg / (height in m)²). | `28.4` |
| **`DiabetesPedigreeFunction`**| `Float` | Score indicating hereditary risk history. | `0.47` |
| **`Age`** | `Integer` | Patient age in years. | `35` |
| **`Outcome`** | `Integer` | Target variable: `1` = Diabetic, `0` = Non-Diabetic. | `1` |

---

## Data Preprocessing

Data preparation tasks are handled inside `data_preprocessing.py`:
1. **Dataset Loading**: Reads the Pima Indians CSV source file (`datasets/diabetes.csv`) using Pandas.
2. **Feature Selection & Target Extraction**: Separates independent variables (the 8 biomarkers) from the dependent target label (`Outcome`).
3. **Train/Test Split**: Partitions data into **80% Training** (614 samples) and **20% Testing** (154 samples) to evaluate performance on unseen data.
4. **Random State**: Uses a fixed random seed (`random_state=42`) and stratifies split samples (`stratify=y`) to maintain the ratio of outcomes in both subsets.

### Importance of Preprocessing
Raw datasets frequently contain invalid data types or outliers. Auditing datasets for missing parameters and duplicate rows ensures training scripts load high-quality samples. This step guarantees that split features preserve matching dimensional bounds, enabling proper model training.

---

## Model Selection

For the current clinical decision prototype, **Logistic Regression** was selected as the binary classification algorithm.

### Advantages
- **Simplicity**: Highly interpretable, mapping relationships between feature weights and prediction outcomes.
- **Low Resource Usage**: Extremely fast train times and negligible memory requirements.
- **Low Risk of Overfitting**: Ideal for small datasets like the Pima Indians subset.

### Limitations
- **Linear Boundaries**: Assumes linear relationships between inputs and outputs, which may struggle with complex interactions.
- **Feature Sensitivity**: Sensitive to multicollinearity if variables are closely correlated.

### Current Project Scope
Logistic Regression provides a solid baseline for local development, proof-of-concept SaaS layout designs, and API integration tests without the complexity of deep learning pipelines.

---

## Model Training

The training workflow is structured as follows:
1. **Dataset Loading**: Resolves paths to `diabetes.csv` and invokes `prepare_dataset` to split feature arrays.
2. **Model Training & Fitting**: Instantiates `LogisticRegression(random_state=42, max_iter=1000)` and fits the coefficients on the training set using `model.fit(X_train, y_train)`.
3. **Evaluation**: Predicts outcomes on test inputs (`X_test`), calculates accuracy, confusion matrices, and prints classification reports.
4. **Saving Model**: Serializes the Scikit-Learn estimator object to `models/diabetes_model.joblib`.

---

## Model Persistence

- **Joblib Serialization**: Persists model weights using the Joblib library, which is highly efficient for large NumPy arrays.
- **One-time Loading**: FastAPI loads the model once at startup (`joblib.load`) and keeps it in memory.
- **Benefits**:
  - Eliminates model compilation overhead during client calls.
  - Keeps endpoint response latency under 5ms.
  - Decouples server operations from ML training scripts.

---

## Evaluation Metrics

Below are the actual validation performance metrics logged by running the Scikit-Learn training pipeline:

### Summary Performance
- **Model Accuracy**: `71.43%` (Ratio of correctly classified patients on test data).
- **Test Dataset Size**: 154 patients.

---

### Confusion Matrix
```text
[[82 18]
 [26 28]]
```

- **True Negatives (TN) = 82**: Healthy patient parameters correctly classified as Non-Diabetic.
- **False Positives (FP) = 18**: Healthy patient parameters incorrectly flagged as Diabetic (Type I error).
- **False Negatives (FN) = 26**: Diabetic patient parameters missed and classified as Non-Diabetic (Type II error).
- **True Positives (TP) = 28**: Diabetic patient parameters correctly flagged as Diabetic.

---

### Classification Report

| Outcome Class | Precision | Recall | F1-Score | Support |
| :---: | :---: | :---: | :---: | :---: |
| **`0` (Non-Diabetic)** | `76%` | `82%` | `79%` | 100 |
| **`1` (Diabetic)** | `61%` | `52%` | `56%` | 54 |
| *Accuracy* | | | **`71%`** | 154 |
| *Macro Average* | `68%` | `67%` | `67%` | 154 |
| *Weighted Average*| `71%` | `71%` | `71%` | 154 |

### Metric Meanings
- **Precision**: Out of all patients flagged by the model as diabetic, the percentage who actually have diabetes (`TP / (TP + FP)`).
- **Recall (Sensitivity)**: Out of all diabetic patients in the test set, the percentage the model successfully identified (`TP / (TP + FN)`).
- **F1-Score**: The harmonic mean of Precision and Recall (`2 * (Precision * Recall) / (Precision + Recall)`), which is a key metric for imbalanced classes.

---

## Prediction Workflow

```
[ Clinician Input JSON ]
           │
           ▼
[ FastAPI POST /predict ]
           │
           ▼
[ Pydantic validation ]
           │
           ▼
[ Pandas DataFrame Transformation ]
           │
           ▼
[ loaded Logistic Regression Model ]
           │
           ▼ (model.predict)
  [ Binary Inference Output ] ────► Outcome 1 (Diabetic) or 0 (Non-Diabetic)
           │
           ▼
 [ JSON payload return ]
```

---

## Current Limitations

- **Small Dataset**: The model is trained on 768 samples, limiting its ability to generalize to broader clinical populations.
- **No Probability Calibration**: The API returns binary classifications (`0` or `1`) rather than probability scores (e.g., `85% risk`).
- **No Database Logs**: Logs are cached locally in browser local storage.
- **Local Deployment**: The server is designed for local developer hosting, with wildcard CORS configurations.

---

## Future Improvements

*Below are potential options to scale the system's machine learning capabilities:*

- **Model Exploration**: Test alternative classification algorithms like **Random Forest**, **XGBoost**, or **LightGBM** to capture complex non-linear feature relationships.
- **Hyperparameter Tuning**: Optimize model parameters (e.g., regularization strength `C` in Logistic Regression) using grid search cross-validation (`GridSearchCV`).
- **Cross-Validation**: Implement K-fold cross-validation on train splits to ensure more stable model evaluation.
- **Model Monitoring**: Track model predictions over time to detect data drift and ensure consistent performance.

---

## Conclusion

The Diabetes Prediction System uses a Scikit-Learn Logistic Regression model to classify patient diabetes risk. Preprocessed via Pandas and serialized using Joblib, the model integrates seamlessly with FastAPI, delivering fast predictions for local clinical screening simulations.
