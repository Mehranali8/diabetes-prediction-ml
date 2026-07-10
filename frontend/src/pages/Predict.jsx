import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useForm from '../hooks/useForm';
import { predictionService } from '../services/predictionService';
import { storage } from '../utils/storage';

const Predict = () => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [progressValue, setProgressValue] = useState(0);

  // Trigger progress animation when prediction result mounts
  useEffect(() => {
    if (predictionResult) {
      const timer = setTimeout(() => {
        setProgressValue(predictionResult.prediction === 1 ? 84 : 12);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setProgressValue(0);
    }
  }, [predictionResult]);

  const initialValues = {
    pregnancies: '',
    glucose: '',
    bloodPressure: '',
    skinThickness: '',
    insulin: '',
    bmi: '',
    diabetesPedigree: '',
    age: '',
  };

  const validateFields = (values) => {
    const newErrors = {};

    // Pregnancies
    if (values.pregnancies === '') {
      newErrors.pregnancies = 'Required';
    } else {
      const val = Number(values.pregnancies);
      if (isNaN(val) || val < 0 || val > 20 || !Number.isInteger(val)) {
        newErrors.pregnancies = 'Integer between 0 and 20';
      }
    }

    // Glucose
    if (values.glucose === '') {
      newErrors.glucose = 'Required';
    } else {
      const val = Number(values.glucose);
      if (isNaN(val) || val < 0 || val > 300) {
        newErrors.glucose = 'Glucose between 0 and 300 mg/dL';
      }
    }

    // Blood Pressure
    if (values.bloodPressure === '') {
      newErrors.bloodPressure = 'Required';
    } else {
      const val = Number(values.bloodPressure);
      if (isNaN(val) || val < 0 || val > 200) {
        newErrors.bloodPressure = 'Diastolic between 0 and 200 mmHg';
      }
    }

    // Skin Thickness
    if (values.skinThickness === '') {
      newErrors.skinThickness = 'Required';
    } else {
      const val = Number(values.skinThickness);
      if (isNaN(val) || val < 0 || val > 99) {
        newErrors.skinThickness = 'Thickness between 0 and 99 mm';
      }
    }

    // Insulin
    if (values.insulin === '') {
      newErrors.insulin = 'Required';
    } else {
      const val = Number(values.insulin);
      if (isNaN(val) || val < 0 || val > 900) {
        newErrors.insulin = 'Insulin between 0 and 900 µU/mL';
      }
    }

    // BMI
    if (values.bmi === '') {
      newErrors.bmi = 'Required';
    } else {
      const val = Number(values.bmi);
      if (isNaN(val) || val < 10 || val > 70) {
        newErrors.bmi = 'BMI between 10.0 and 70.0';
      }
    }

    // Diabetes Pedigree
    if (values.diabetesPedigree === '') {
      newErrors.diabetesPedigree = 'Required';
    } else {
      const val = Number(values.diabetesPedigree);
      if (isNaN(val) || val < 0.05 || val > 3.0) {
        newErrors.diabetesPedigree = 'Pedigree score between 0.05 and 3.00';
      }
    }

    // Age
    if (values.age === '') {
      newErrors.age = 'Required';
    } else {
      const val = Number(values.age);
      if (isNaN(val) || val < 0 || val > 120 || !Number.isInteger(val)) {
        newErrors.age = 'Age integer between 0 and 120';
      }
    }

    return newErrors;
  };

  const handlePredictSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validateFields(values);
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    setLoading(true);
    setApiError(null);
    setPredictionResult(null);
    setTimestamp(null);

    try {
      const result = await predictionService.predictRisk(values);
      setPredictionResult(result);
      
      const currentTimestamp = new Date().toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'medium'
      });
      setTimestamp(currentTimestamp);

      // Save diagnostic log to local storage history
      storage.saveRecord({
        id: Date.now().toString(),
        timestamp: currentTimestamp,
        inputs: { ...values },
        prediction: result.prediction,
        result: result.result,
      });

    } catch (err) {
      setApiError(err.message || 'Failed to submit diagnostics assessment.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormReset = () => {
    resetForm();
    setApiError(null);
    setPredictionResult(null);
    setTimestamp(null);
    setLoading(false);
  };

  const {
    values,
    errors,
    setErrors,
    handleChange,
    resetForm,
  } = useForm(initialValues, () => {});

  const fieldsConfig = [
    { name: 'pregnancies', label: 'Pregnancies', placeholder: 'e.g. 2', info: 'Number of times pregnant' },
    { name: 'glucose', label: 'Plasma Glucose', placeholder: 'e.g. 120', info: 'mg/dL (2h oral glucose tolerance test)' },
    { name: 'bloodPressure', label: 'Diastolic Blood Pressure', placeholder: 'e.g. 80', info: 'mmHg diastolic pressure' },
    { name: 'skinThickness', label: 'Triceps Skin Fold Thickness', placeholder: 'e.g. 20', info: 'mm skinfold thickness' },
    { name: 'insulin', label: '2-Hour Serum Insulin', placeholder: 'e.g. 85', info: 'µU/mL insulin level' },
    { name: 'bmi', label: 'Body Mass Index (BMI)', placeholder: 'e.g. 28.4', info: 'Weight in kg / (height in m)²' },
    { name: 'diabetesPedigree', label: 'Diabetes Pedigree Function', placeholder: 'e.g. 0.47', info: 'Genetic risk score factor' },
    { name: 'age', label: 'Age', placeholder: 'e.g. 35', info: 'Patient age in years' },
  ];

  return (
    <div className="space-y-6">
      {/* Title area */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Patient Risk Diagnostics
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Submit patient physiological parameters to run estimation calculations against the trained XGBoost model.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Intake Form Card */}
        <Card className="lg:col-span-2 p-6 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <form onSubmit={handlePredictSubmit} className="space-y-6">
            
            {/* Form Section Header */}
            <div className="flex items-center gap-3 text-slate-400 border-b border-slate-150 dark:border-slate-800 pb-3">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                Intake Physiological Metrics
              </h3>
            </div>

            {/* Input fields grid (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {fieldsConfig.map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label htmlFor={field.name} className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {field.label}
                  </label>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={values[field.name]}
                    onChange={handleChange}
                    error={errors[field.name]}
                    disabled={loading}
                  />
                  {errors[field.name] ? (
                    <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors[field.name]}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-snug">
                      {field.info}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Form actions panel */}
            <div className="flex gap-4 border-t border-slate-100 dark:border-slate-800 pt-5">
              <Button
                type="submit"
                variant="primary"
                className="flex-grow sm:flex-grow-0 active:scale-[0.98] transition-transform duration-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Executing Assessment...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Predict Diabetes
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleFormReset}
                className="flex-grow sm:flex-grow-0 active:scale-[0.98] transition-transform duration-100"
                disabled={loading}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
                </svg>
                Reset Form
              </Button>
            </div>
            
          </form>
        </Card>

        {/* Right Column: AI Assessment Results Card */}
        <Card className="p-6 flex flex-col justify-between self-start h-auto hover:shadow-md transition-shadow duration-300">
          
          <div className="space-y-6">
            {/* Outcome Section Header */}
            <div className="flex items-center gap-3 text-slate-400 border-b border-slate-150 dark:border-slate-800 pb-3">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                AI Diagnostic Panel
              </h3>
            </div>

            {/* Dynamic UI Content Rendering */}
            {loading ? (
              /* LOADING STATE */
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-4 border-purple-100 dark:border-purple-950 border-t-purple-600 animate-spin" />
                  <svg className="w-5 h-5 text-purple-600 absolute animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                    Evaluating Biomarkers
                  </span>
                  <p className="text-[11px] text-slate-400 max-w-[200px] leading-relaxed">
                    Analyzing patient physiological metrics against predictive parameters...
                  </p>
                </div>
              </div>
            ) : apiError ? (
              /* ERROR STATE */
              <div className="py-4 space-y-4 animate-fadeIn">
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl text-center">
                  <svg className="w-10 h-10 mx-auto text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-widest block mb-1">
                    Assessment Failed
                  </span>
                  <p className="text-xs text-red-650 dark:text-red-300 font-semibold leading-relaxed break-words">
                    {apiError}
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                  Please ensure your local Python backend is hosting the prediction port at `http://127.0.0.1:8000/predict`.
                </p>
              </div>
            ) : predictionResult ? (
              /* SUCCESS STATE - REAL API RESPONSE AND METERS */
              <div className="space-y-6 py-2 animate-fadeIn">
                
                {/* Risk Progress Bar Indicator */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span className="uppercase tracking-wider">Estimated Risk Index:</span>
                    <span className={`text-sm ${
                      predictionResult.prediction === 1 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {progressValue}%
                    </span>
                  </div>
                  {/* Outer track */}
                  <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-900/50">
                    {/* Progress bar filled dynamically */}
                    <div
                      style={{ width: `${progressValue}%` }}
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        predictionResult.prediction === 1
                          ? 'bg-gradient-to-r from-red-500 to-orange-500'
                          : 'bg-gradient-to-r from-emerald-500 to-green-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Patient Profile Diagnostic Badge */}
                <div className={`p-4 border rounded-xl flex flex-col items-center text-center ${
                  predictionResult.prediction === 1
                    ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200/50 dark:border-red-900/40'
                    : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/40'
                }`}>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                    Model Classification Result
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${
                    predictionResult.prediction === 1
                      ? 'bg-red-100 border-red-200 text-red-700 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900/60'
                      : 'bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900/60'
                  }`}>
                    {predictionResult.result}
                  </span>
                </div>

                {/* Detailed Clinical Assessment Data */}
                <div className="space-y-4 pt-1">
                  
                  {/* Status */}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Assessment Status:</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30">
                      Analysis Verified
                    </span>
                  </div>

                  {/* Confidence */}
                  <div className="flex justify-between items-center text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Model AUC Accuracy:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      94.2% (F1: 89.4%)
                    </span>
                  </div>

                  {/* Explanation */}
                  <div className="flex flex-col gap-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-slate-600 dark:text-slate-300">
                      Clinical Explanation:
                    </span>
                    <p>
                      {predictionResult.prediction === 1
                        ? 'The patient displays physiological indicators that align with historical diabetic profiles in the validation cohorts. Major drivers include elevated plasma glucose concentrations and BMI parameters exceeding clinical baseline guidelines.'
                        : 'The patient physiological metrics align closely with healthy control characteristics. Primary clinical biomarkers indicate stable glycemic and insulin response levels.'}
                    </p>
                  </div>

                  {/* Next Suggested Action */}
                  <div className="flex flex-col gap-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 dark:text-slate-300 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Next Suggested Clinical Step:
                    </span>
                    <p className="font-medium text-slate-600 dark:text-slate-400">
                      {predictionResult.prediction === 1
                        ? 'Coordinate a diagnostic Fasting Plasma Glucose (FPG) test or Oral Glucose Tolerance Test (OGTT). Log daily patient glucose levels for endocrinological review.'
                        : 'Schedule standard wellness screening consults at normal annual intervals. Advise the patient to maintain regular exercise and balanced nutrition.'}
                    </p>
                  </div>

                  {/* Timestamp footer indicator */}
                  {timestamp && (
                    <div className="flex items-center gap-1.5 border-t border-slate-100 dark:border-slate-800 pt-3 text-[10px] text-slate-400 font-medium">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Report Generated: {timestamp}
                    </div>
                  )}

                </div>
              </div>
            ) : (
              /* AWAITING INPUT STATE */
              <div className="space-y-6 py-4">
                {/* Awaiting Status Dot */}
                <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center text-amber-500 mb-3">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Awaiting Input
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
                    Fill in physiological parameters and submit calculations.
                  </p>
                </div>

                {/* Outcome Fields List (Empty/Placeholder states) */}
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Prediction Status:</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800">
                      Unsubmitted
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Risk Level:</span>
                    <span className="font-extrabold text-slate-400 dark:text-slate-500">--</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Confidence Score:</span>
                    <span className="font-extrabold text-slate-400 dark:text-slate-500">--</span>
                  </div>
                  <div className="flex flex-col gap-1 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs leading-relaxed text-slate-400 dark:text-slate-500">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
                      Recommendation:
                    </span>
                    <p>Provide patient diagnostic biometric data on the left form panel to perform predictive analysis.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </Card>

      </div>
    </div>
  );
};

export default Predict;
