import os
import pandas as pd
from sklearn.model_selection import train_test_split

def prepare_dataset(filepath: str):
    """
    Loads, analyzes, and splits the diabetes dataset for machine learning.
    
    Parameters:
    - filepath (str): The absolute or relative path to the diabetes.csv file.
    
    Returns:
    - X_train, X_test, y_train, y_test: The split features and target datasets.
    """
    print(f"--- Loading Dataset from {filepath} ---")
    
    # Check if the file exists before attempting to load
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset file not found at: {filepath}")
    
    # 2. Load the dataset using pandas
    df = pd.read_csv(filepath)
    
    # 3. Display basic dataset information
    print("\n[Dataset Shape]")
    print(f"Rows: {df.shape[0]}, Columns: {df.shape[1]}")
    
    print("\n[First 5 Rows]")
    print(df.head())
    
    print("\n[Column Names]")
    print(df.columns.tolist())
    
    print("\n[Data Types]")
    print(df.dtypes)
    
    # 4. Check for missing values and duplicate rows
    print("\n[Checking Missing Values]")
    missing_values = df.isnull().sum()
    print(missing_values)
    
    print("\n[Checking Duplicate Rows]")
    duplicates_count = df.duplicated().sum()
    print(f"Number of duplicate rows found: {duplicates_count}")
    
    # 5. Separate features (X) and target (y)
    # The target column is 'Outcome' (1 for diabetic, 0 for non-diabetic)
    X = df.drop(columns=["Outcome"])
    y = df["Outcome"]
    
    # 6. Split the dataset: 80% Training, 20% Testing, random_state = 42
    # We do a random split to ensure reproducibility
    X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
    )
    
    print("\n[Train/Test Split Shapes]")
    print(f"X_train (Training features): {X_train.shape}")
    print(f"X_test (Testing features): {X_test.shape}")
    print(f"y_train (Training targets): {y_train.shape}")
    print(f"y_test (Testing targets): {y_test.shape}")
    
    return X_train, X_test, y_train, y_test

if __name__ == "__main__":
    # Resolve the path to datasets/diabetes.csv relative to this file
    # This file is in: backend/app/
    # The datasets folder is at: backend/app/../../datasets/
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, "..", "..", "datasets", "diabetes.csv")
    dataset_path = os.path.abspath(dataset_path)
    
    # Run preprocessing to print metrics
    prepare_dataset(dataset_path)
