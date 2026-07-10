const STORAGE_KEY = 'gluco_predict_history';

export const storage = {
  // Retrieve the full prediction history log array
  getHistory: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('Failed to parse prediction history:', err);
      return [];
    }
  },

  // Save a new diagnostic screening record at the beginning of the list
  saveRecord: (record) => {
    try {
      const history = storage.getHistory();
      const updated = [record, ...history];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save prediction record:', err);
    }
  },

  // Purge all records from local storage
  clearHistory: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear prediction history:', err);
    }
  },
};
