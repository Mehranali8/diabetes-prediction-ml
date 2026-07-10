// Global application configuration keys and bounds

export const CONFIG = {
  APP_NAME: 'Diabetes Prediction System',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'en',
  API_TIMEOUT_MS: 5000,
};

// Standard physiological metric constraints for validation
export const CLINICAL_BOUNDS = {
  AGE: { min: 0, max: 120 },
  BMI: { min: 10, max: 80 },
  GLUCOSE: { min: 20, max: 400 },
  BLOOD_PRESSURE: { min: 40, max: 200 },
  INSULIN: { min: 0, max: 800 },
};
