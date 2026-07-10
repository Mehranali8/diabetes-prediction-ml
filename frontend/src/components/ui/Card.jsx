import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/85 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200/80 dark:hover:border-slate-700/80 overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
