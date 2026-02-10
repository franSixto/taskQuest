'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-sm font-semibold text-gray-200"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={id}
          className={cn(
            'flex h-12 w-full rounded-xl border-2 bg-surface-dark/80 px-4 py-2 text-sm text-white placeholder:text-gray-500',
            'border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            'transition-all duration-300 backdrop-blur-sm',
            'hover:border-primary/50 hover:bg-surface-dark',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error/50 focus:border-error focus:ring-error/20',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-error font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

// Textarea component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-sm font-semibold text-gray-200"
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          className={cn(
            'flex min-h-[100px] w-full rounded-xl border-2 bg-surface-dark/80 px-4 py-3 text-sm text-white placeholder:text-gray-500',
            'border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            'transition-all duration-300 resize-none backdrop-blur-sm',
            'hover:border-primary/50 hover:bg-surface-dark',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error/50 focus:border-error focus:ring-error/20',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-error font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select component
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-2 block text-sm font-semibold text-gray-200"
          >
            {label}
          </label>
        )}
        <select
          id={id}
          className={cn(
            'flex h-12 w-full rounded-xl border-2 bg-surface-dark/80 px-4 py-2 text-sm text-white',
            'border-primary/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
            'transition-all duration-300 backdrop-blur-sm cursor-pointer',
            'hover:border-primary/50 hover:bg-surface-dark',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error/50 focus:border-error focus:ring-error/20',
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-surface-dark">
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-xs text-error font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
