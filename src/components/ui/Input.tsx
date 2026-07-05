import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={`block w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm ${
              icon ? 'pl-10 pr-3.5 rtl:pr-10 rtl:pl-3.5' : 'px-3.5'
            } py-2.5 ${
              error ? 'border-danger focus:ring-danger' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-danger font-medium flex items-center">
            <span className="inline-block mr-1">●</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
