import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { storage } from '../utils/storage';

const Dashboard = ({ onNavigate }) => {
  const [records, setRecords] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Load records from local storage on component mount
  useEffect(() => {
    setRecords(storage.getHistory());
  }, []);

  const handleClearHistory = () => {
    storage.clearHistory();
    setRecords([]);
    setShowClearConfirm(false);
  };

  const totalPredictions = records.length;
  const diabeticPredictions = records.filter((r) => r.prediction === 1).length;
  const nonDiabeticPredictions = records.filter((r) => r.prediction === 0).length;
  const latestPrediction = records.length > 0 ? records[0] : null;

  // Analytics cards configurations
  const metrics = [
    {
      title: 'Total Predictions',
      value: totalPredictions,
      change: 'All-time assessment count',
      colorClass: 'text-blue-600 dark:text-blue-400',
      bgClass: 'bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50',
      icon: (
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: 'Diabetic Predictions',
      value: diabeticPredictions,
      change: 'High-risk flags detected',
      colorClass: 'text-red-600 dark:text-red-400',
      bgClass: 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50',
      icon: (
        <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      title: 'Non-Diabetic Predictions',
      value: nonDiabeticPredictions,
      change: 'Normal range results',
      colorClass: 'text-emerald-600 dark:text-emerald-400',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50',
      icon: (
        <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Latest Prediction',
      value: latestPrediction ? latestPrediction.result : 'N/A',
      change: latestPrediction ? latestPrediction.timestamp : 'No records yet',
      colorClass: latestPrediction
        ? latestPrediction.prediction === 1
          ? 'text-red-600 dark:text-red-400'
          : 'text-emerald-600 dark:text-emerald-400'
        : 'text-slate-400',
      bgClass: latestPrediction
        ? latestPrediction.prediction === 1
          ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50'
          : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50'
        : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800',
      icon: (
        <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18.5" />
        </svg>
      ),
    },
  ];

  // Latest 5 predictions
  const recentPredictions = records.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Title area */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Clinical Overview
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Real-time patient screening statistics, risk classification metrics, and diagnostic tracking logs.
        </p>
      </div>

      {records.length === 0 ? (
        /* Empty State Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Centered Empty State Card */}
          <div className="lg:col-span-2">
            <Card className="p-16 text-center h-full flex flex-col items-center justify-center space-y-6 hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-inner">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div className="space-y-2 max-w-sm">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Assessment Records</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Diagnostic assessment histories will be cataloged here once you execute risk evaluations on the clinical form panel.
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => onNavigate('/predict')}
                className="px-6 py-2.5 shadow-md shadow-blue-500/20 active:scale-[0.98]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Create First Prediction
              </Button>
            </Card>
          </div>

          {/* Side Panel: Quick Actions */}
          <div className="space-y-6">
            <Card className="p-6 space-y-4 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Actions
              </h3>
              <div className="border-t border-slate-150 dark:border-slate-800 pt-4 flex flex-col gap-3">
                <Button
                  variant="primary"
                  onClick={() => onNavigate('/predict')}
                  className="w-full text-xs font-semibold py-2.5 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  New Prediction
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => onNavigate('/history')}
                  className="w-full text-xs font-semibold py-2.5 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  View Prediction History
                </Button>
              </div>
            </Card>

            {/* Model Info block */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                </svg>
                Predictive Model Operations
              </h3>
              <div className="border-t border-slate-150 dark:border-slate-800 pt-4 space-y-4 text-xs text-slate-600 dark:text-slate-400">
                <p>
                  The system predicts patient outcomes by processing diagnostic data (e.g. Glucose Levels, Insulin Counts, BMI) against a pre-trained predictive classification model.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Model Name</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">XGBoost Classifier v1.2</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Dataset Split Accuracy</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">89.4% F1-Score (94.2% AUC)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Populated State Layout */
        <>
          {/* Analytics Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, i) => (
              <Card
                key={i}
                className="p-6 flex items-start justify-between gap-4 transition-all duration-350 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="space-y-2 min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block truncate">
                    {metric.title}
                  </span>
                  <span className={`text-3xl font-extrabold block truncate ${metric.colorClass}`}>
                    {metric.value}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium truncate">
                    {metric.change}
                  </span>
                </div>
                <div className={`p-3 rounded-xl border ${metric.bgClass} flex items-center justify-center shrink-0`}>
                  {metric.icon}
                </div>
              </Card>
            ))}
          </div>

          {/* Clear History Inline Double Confirmation */}
          {showClearConfirm && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="text-xs text-amber-800 dark:text-amber-400 leading-normal">
                  <p className="font-bold">Are you absolutely sure you want to clear prediction history?</p>
                  <p className="mt-0.5 text-amber-750 dark:text-amber-400/80">This action will permanently purge all {records.length} saved diagnostic assessment logs from this browser session.</p>
                </div>
              </div>
              <div className="flex gap-2 self-end sm:self-auto">
                <Button
                  variant="danger"
                  onClick={handleClearHistory}
                  className="text-xs py-1.5 px-3 active:scale-[0.98]"
                >
                  Confirm Purge
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowClearConfirm(false)}
                  className="text-xs py-1.5 px-3 active:scale-[0.98]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Main Grid content blocks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Predictions table card (span-2) */}
            <div className="lg:col-span-2">
              <Card className="hover:shadow-md transition-shadow duration-300">
                <div className="p-4 border-b border-slate-150 dark:border-slate-800/80 flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                      Recent Predictions
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Latest 5 risk assessment results.
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => onNavigate('/history')}
                    className="text-[11px] py-1 px-2.5 font-bold tracking-wide active:scale-[0.98]"
                  >
                    View History
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 dark:bg-slate-900/30 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-150 dark:border-slate-800/80">
                        <th className="px-6 py-3.5">Date & Time</th>
                        <th className="px-4 py-3.5">Glucose</th>
                        <th className="px-4 py-3.5">Age</th>
                        <th className="px-6 py-3.5 text-right">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60 text-xs font-medium text-slate-600 dark:text-slate-350">
                      {recentPredictions.map((record) => (
                        <tr
                          key={record.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-850/30 transition-colors duration-150"
                        >
                          {/* Date & Time */}
                          <td className="px-6 py-4 whitespace-nowrap text-[11px] text-slate-400">
                            {record.timestamp}
                          </td>
                          {/* Glucose */}
                          <td className="px-4 py-4 whitespace-nowrap font-normal">
                            {record.inputs.glucose} <span className="text-[10px] text-slate-400">mg/dL</span>
                          </td>
                          {/* Age */}
                          <td className="px-4 py-4 whitespace-nowrap font-semibold text-slate-700 dark:text-slate-300">
                            {record.inputs.age} yrs
                          </td>
                          {/* Outcome Result Badge */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wide uppercase border ${
                              record.prediction === 1
                                ? 'bg-red-50/50 border-red-200/50 text-red-600 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400'
                                : 'bg-emerald-50/50 border-emerald-200/50 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400'
                            }`}>
                              {record.result}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 flex justify-between items-center">
                  <span>SHOWING {recentPredictions.length} OF {records.length} ENTRIES</span>
                  <span>Active Session</span>
                </div>
              </Card>
            </div>

            {/* Quick Actions (span-1) */}
            <div className="space-y-6">
              <Card className="p-6 space-y-4 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Actions
                </h3>
                <div className="border-t border-slate-150 dark:border-slate-800 pt-4 flex flex-col gap-3">
                  <Button
                    variant="primary"
                    onClick={() => onNavigate('/predict')}
                    className="w-full text-xs font-semibold py-2.5 active:scale-[0.98]"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    New Prediction
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => onNavigate('/history')}
                    className="w-full text-xs font-semibold py-2.5 active:scale-[0.98]"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    View Prediction History
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowClearConfirm(true)}
                    className="w-full text-xs font-semibold py-2.5 text-red-650 dark:text-red-400 hover:text-red-750 dark:hover:text-red-300 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 active:scale-[0.98]"
                  >
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear Prediction History
                  </Button>
                </div>
              </Card>

              {/* Model Info block */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                  </svg>
                  Predictive Model Operations
                </h3>
                <div className="border-t border-slate-150 dark:border-slate-800 pt-4 space-y-4 text-xs text-slate-600 dark:text-slate-400">
                  <p>
                    The system predicts patient outcomes by processing diagnostic data (e.g. Glucose Levels, Insulin Counts, BMI) against a pre-trained predictive classification model.
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Model Name</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">XGBoost Classifier v1.2</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Dataset Split Accuracy</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">89.4% F1-Score (94.2% AUC)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
