import { apiClient } from './api';

export const predictionService = {
  // Submit diagnostics data to receive risk estimation
  predictRisk: async (camelCaseData) => {
    // Translate camelCase string values into correct numerical data types and PascalCase keys
    const apiPayload = {
      Pregnancies: parseInt(camelCaseData.pregnancies, 10),
      Glucose: parseInt(camelCaseData.glucose, 10),
      BloodPressure: parseInt(camelCaseData.bloodPressure, 10),
      SkinThickness: parseInt(camelCaseData.skinThickness, 10),
      Insulin: parseInt(camelCaseData.insulin, 10),
      BMI: parseFloat(camelCaseData.bmi),
      DiabetesPedigreeFunction: parseFloat(camelCaseData.diabetesPedigree),
      Age: parseInt(camelCaseData.age, 10),
    };

    return apiClient.post('/predict', apiPayload);
  },
};
