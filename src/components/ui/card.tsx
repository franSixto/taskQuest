'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-2xl border-2 transition-all duration-300 relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-b from-surface to-surface-dark border-primary/30 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10',
        elevated: 'bg-gradient-to-br from-surface-light via-surface to-surface-dark border-primary/40 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/60',
        glass: 'bg-surface/30 backdrop-blur-xl border-white/10 shadow-xl hover:bg-surface/40 hover:border-white/20',
        quest: 'bg-gradient-to-br from-surface via-surface-dark to-surface border-primary/40 hover:border-primary/70 hover:shadow-xl hover:shadow-primary/20 gaming-card',
        boss: 'bg-gradient-to-br from-surface via-error/5 to-surface-dark border-error/50 hover:border-error/80 hover:shadow-xl hover:shadow-error/20 animate-pulse-subtle',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardVariants> { }

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-4 pb-2', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold text-white leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-400', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-4 pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
