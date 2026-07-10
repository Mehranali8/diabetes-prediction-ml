import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  variant = 'primary',
  ...props
}) => {
  const baseStyle = "px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white focus:ring-blue-500 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/25",
    secondary: "bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 focus:ring-slate-550 shadow-sm",
    danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white focus:ring-red-500 shadow-md shadow-red-500/10 hover:shadow-lg hover:shadow-red-500/25",
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
