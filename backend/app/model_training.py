import os
import sys
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# Add the current directory to sys.path to allow importing from data_preprocessing.py
# when running this script directly from the project root directory.
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from data_preprocessing import prepare_dataset

def train_logistic_regression(dataset_path: str):
    """
    Loads preprocessed dataset, trains a Logistic Regression model,
    and evaluates its performance on the test dataset.
    """
    # 2. & 3. Load and preprocess the dataset
    X_train, X_test, y_train, y_test = prepare_dataset(dataset_path)
    
    print("\n" + "="*40)
    print("--- Training Logistic Regression Model ---")
    print("="*40)
    
    # 4. Initialize Logistic Regression model with default parameters and random_state=42
    # Note: max_iter is kept default (100) as per requirements, but random_state is set.
    model = LogisticRegression(
    random_state=42,
    max_iter=1000,
)
    
    # Train/Fit the model on the training data
    model.fit(X_train, y_train)
    print("Model training completed successfully.")
    
    # Save the trained model using Joblib
    # Define models directory path relative to this script (../../models/)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.abspath(os.path.join(current_dir, "..", "..", "models"))
    
    # Create the models folder if it does not exist
    os.makedirs(models_dir, exist_ok=True)
        
    model_path = os.path.join(models_dir, "diabetes_model.joblib")
    joblib.dump(model, model_path)
    
    print("\nModel saved successfully.")
    print("Saved Location:")
    print(model_path)
    
    # 5. Predict outcomes for the test dataset
    y_pred = model.predict(X_test)
    
    # 6. Evaluate and print model performance metrics
    # Calculate accuracy
    accuracy = accuracy_score(y_test, y_pred)
    
    # Calculate confusion matrix
    conf_matrix = confusion_matrix(y_test, y_pred)
    
    # Generate classification report
    class_report = classification_report(y_test, y_pred)
    
    print("\n[Model Performance Evaluation]")
    print(f"Model Accuracy: {accuracy:.4f} ({accuracy * 100:.2f}%)")
    
    print("\n[Confusion Matrix]")
    print(conf_matrix)
    print("\nLegend:")
    print("  [True Negatives (TN)   False Positives (FP)]")
    print("  [False Negatives (FN)  True Positives (TP) ]")
    
    print("\n[Classification Report]")
    print(class_report)

if __name__ == "__main__":
    # Resolve the path to datasets/diabetes.csv relative to this file
    # This file is in: backend/app/
    # The datasets folder is at: backend/app/../../datasets/
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, "..", "..", "datasets", "diabetes.csv")
    dataset_path = os.path.abspath(dataset_path)
    
    # Run the training and evaluation pipeline
    train_logistic_regression(dataset_path)
