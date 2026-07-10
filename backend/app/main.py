import os
import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize FastAPI application
app = FastAPI(
    title="Diabetes Prediction System",
    description="Backend API for the Diabetes Prediction System",
    version="1.0.0"
)

# Enable CORS (Cross-Origin Resource Sharing) to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, we can restrict this in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all HTTP headers
)

# Define the Pydantic request model with appropriate data types for the 8 features
class DiabetesInput(BaseModel):
    Pregnancies: int
    Glucose: int
    BloodPressure: int
    SkinThickness: int
    Insulin: int
    BMI: float
    DiabetesPedigreeFunction: float
    Age: int

# Resolve the absolute path to the saved model file
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.abspath(os.path.join(current_dir, "..", "..", "models", "diabetes_model.joblib"))

# Load the saved model once at startup
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Trained model not found at: {model_path}. Please run model_training.py first.")

model = joblib.load(model_path)

@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify backend status.
    """
    return {
        "status": "healthy",
        "project": "Diabetes Prediction System"
    }

@app.post("/predict")
async def predict_diabetes(input_data: DiabetesInput):
    """
    Predicts the diabetes outcome based on patient metrics.
    """
    # Convert input data into a dictionary in the same format expected by the model
    data_dict = {
        "Pregnancies": [input_data.Pregnancies],
        "Glucose": [input_data.Glucose],
        "BloodPressure": [input_data.BloodPressure],
        "SkinThickness": [input_data.SkinThickness],
        "Insulin": [input_data.Insulin],
        "BMI": [input_data.BMI],
        "DiabetesPedigreeFunction": [input_data.DiabetesPedigreeFunction],
        "Age": [input_data.Age]
    }
    
    # Convert dictionary to Pandas DataFrame to preserve feature names and order
    input_df = pd.DataFrame(data_dict)
    
    # Run prediction using the loaded model
    prediction = int(model.predict(input_df)[0])
    
    # Map the prediction outcome (0 or 1) to a user-friendly result string
    result = "Diabetic" if prediction == 1 else "Non-Diabetic"
    
    return {
        "prediction": prediction,
        "result": result
    }

if __name__ == "__main__":
    import uvicorn
    # Allow running the app directly using Python
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
