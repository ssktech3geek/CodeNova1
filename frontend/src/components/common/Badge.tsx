import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'success' | 'danger' | 'warning' | 'neutral' | 'disruption';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon,
}) => {
  const variantStyles = {
    primary: 'bg-primary-light dark:bg-primary/20 text-primary dark:text-primary-bright border border-primary/20 dark:border-primary/40',
    accent: 'bg-accent-light dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-accent/30 dark:border-amber-800/60',
    success: 'bg-success-light dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60',
    danger: 'bg-danger-light dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60',
    warning: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60',
    disruption: 'bg-orange-50 dark:bg-orange-950/70 text-orange-900 dark:text-orange-200 border border-orange-300 dark:border-disruption font-semibold disruption-pulse',
    neutral: 'bg-gray-100 dark:bg-[#1C252A] text-gray-700 dark:text-dark-text border border-gray-200 dark:border-white/10',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium rounded-full',
    md: 'px-2.5 py-1 text-xs font-medium rounded-full',
    lg: 'px-3.5 py-1.5 text-sm font-semibold rounded-full',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 transition-all ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="inline-block">{icon}</span>}
      {children}
    </span>
  );
};
