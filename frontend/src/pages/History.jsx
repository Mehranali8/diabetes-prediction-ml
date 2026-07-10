import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { storage } from '../utils/storage';

const History = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('All');
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

  // Perform search and dropdown checks
  const filteredRecords = records.filter((record) => {
    const searchLower = searchTerm.toLowerCase();
    
    // Check if search matches result tags, timestamps, or clinical indicators
    const matchesSearch =
      record.result.toLowerCase().includes(searchLower) ||
      record.timestamp.toLowerCase().includes(searchLower) ||
      String(record.inputs.age).includes(searchTerm) ||
      String(record.inputs.bmi).includes(searchTerm) ||
      String(record.inputs.glucose).includes(searchTerm);

    // Apply outcome classification filters
    if (filterValue === 'Diabetic') {
      return matchesSearch && record.prediction === 1;
    }
    if (filterValue === 'Non-Diabetic') {
      return matchesSearch && record.prediction === 0;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Diagnostics Audit Logs
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Audit history of all localized diabetes risk calculations completed on this client.
          </p>
        </div>
        
        {/* Clear logs action button */}
        {records.length > 0 && !showClearConfirm && (
          <Button
            variant="secondary"
            onClick={() => setShowClearConfirm(true)}
            className="text-red-600 dark:text-red-400 hover:text-red-750 dark:hover:text-red-300 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 active:scale-[0.98]"
          >
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Database Logs
          </Button>
        )}
      </div>

      {/* Double confirmation inline warning alert (Amber/Red) */}
      {showClearConfirm && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="text-xs text-amber-800 dark:text-amber-400 leading-normal">
              <p className="font-bold">Are you absolutely sure you want to delete these records?</p>
              <p className="mt-0.5 text-amber-700/80 dark:text-amber-400/80">This action will permanently purge all {records.length} saved diagnostic assessment logs from this browser session.</p>
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

      {records.length === 0 ? (
        /* EMPTY STATE RENDER */
        <Card className="p-16 text-center max-w-2xl mx-auto flex flex-col items-center justify-center space-y-4 hover:shadow-md transition-shadow duration-300">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-inner">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Assessment Records</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Diagnostic assessment histories will be cataloged here once you execute risk evaluations on the clinical form panel.
            </p>
          </div>
        </Card>
      ) : (
        /* LOGS TABLE VIEW PANEL */
        <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
          
          {/* Table Toolbar controls: Search and Filter Tabs */}
          <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input Box */}
            <div className="max-w-xs w-full relative">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <Input
                placeholder="Search logs (e.g. Diabetic, Age...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs"
              />
            </div>

            {/* Filter tab buttons */}
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200/50 dark:border-slate-800/80 self-start md:self-auto">
              {['All', 'Diabetic', 'Non-Diabetic'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterValue(tab)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    filterValue === tab
                      ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Audit Logs Responsive Table */}
          <div className="overflow-x-auto">
            {filteredRecords.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-medium">
                No records matched the selected query.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/30 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-3">Timestamp</th>
                    <th className="px-4 py-3">Age</th>
                    <th className="px-4 py-3">Glucose</th>
                    <th className="px-4 py-3">Blood Press.</th>
                    <th className="px-4 py-3">BMI</th>
                    <th className="px-4 py-3">Pedigree</th>
                    <th className="px-4 py-3 text-center">Prediction</th>
                    <th className="px-6 py-3 text-right">Result Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium text-slate-600 dark:text-slate-400">
                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/25 transition-colors duration-150"
                    >
                      {/* Timestamp */}
                      <td className="px-6 py-4 whitespace-nowrap text-[11px] text-slate-400">
                        {record.timestamp}
                      </td>
                      {/* Age */}
                      <td className="px-4 py-4 whitespace-nowrap font-semibold text-slate-700 dark:text-slate-300">
                        {record.inputs.age} yrs
                      </td>
                      {/* Glucose */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {record.inputs.glucose} <span className="text-[10px] text-slate-400">mg/dL</span>
                      </td>
                      {/* Blood Pressure */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {record.inputs.bloodPressure} <span className="text-[10px] text-slate-400">mmHg</span>
                      </td>
                      {/* BMI */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {record.inputs.bmi}
                      </td>
                      {/* Pedigree */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {record.inputs.diabetesPedigree}
                      </td>
                      {/* Prediction Code */}
                      <td className="px-4 py-4 whitespace-nowrap text-center font-bold text-slate-500">
                        {record.prediction}
                      </td>
                      {/* Outcome Badge */}
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
            )}
          </div>

          {/* Table footer paging metrics details */}
          <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 flex justify-between items-center">
            <span>SHOWING {filteredRecords.length} OF {records.length} ENTRIES</span>
            <span>Local DB Session</span>
          </div>

        </Card>
      )}
    </div>
  );
};

export default History;
