'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-primary to-primary-600 text-background hover:from-primary-400 hover:to-primary shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] border border-primary/50',
        secondary:
          'bg-gradient-to-r from-secondary to-secondary-600 text-white hover:from-secondary-400 hover:to-secondary shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/50 hover:scale-[1.02] active:scale-[0.98] border border-secondary/50',
        accent:
          'bg-gradient-to-r from-accent to-accent-600 text-background hover:from-accent-400 hover:to-accent shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/50 hover:scale-[1.02] active:scale-[0.98] border border-accent/50',
        outline:
          'border-2 border-primary text-primary hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20 backdrop-blur-sm',
        ghost:
          'text-primary hover:bg-primary/15 hover:text-primary-300 backdrop-blur-sm',
        danger:
          'bg-gradient-to-r from-error to-red-700 text-white hover:from-red-500 hover:to-error shadow-lg shadow-error/30 hover:shadow-xl hover:shadow-error/50 hover:scale-[1.02] active:scale-[0.98] border border-error/50',
        success:
          'bg-gradient-to-r from-success to-green-700 text-white hover:from-green-500 hover:to-success shadow-lg shadow-success/30 hover:shadow-xl hover:shadow-success/50 hover:scale-[1.02] active:scale-[0.98] border border-success/50',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-13 px-7 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
