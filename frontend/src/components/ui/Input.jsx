import React from 'react';

const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  error = null,
  ...props
}) => {
  return (
    <input
      type={type}
      className={`w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-4 transition-all duration-200 shadow-sm ${
        error
          ? 'border-red-500 dark:border-red-600 focus:ring-red-500/15 focus:border-red-500'
          : 'border-slate-200 dark:border-slate-850 focus:ring-blue-500/15 focus:border-blue-500 hover:border-slate-300 dark:hover:border-slate-700'
      } ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default Input;
