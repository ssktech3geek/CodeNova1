import React from 'react';

interface PriceDisplayProps {
  amount: number;
  label?: string;
  originalAmount?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  subtitle?: string;
  className?: string;
  delta?: number;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  amount,
  label,
  originalAmount,
  size = 'md',
  subtitle,
  className = '',
  delta,
}) => {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

  const formattedOriginal = originalAmount
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(originalAmount)
    : null;

  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-base font-bold',
    lg: 'text-xl font-extrabold',
    xl: 'text-2xl lg:text-3xl font-black',
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <span className="text-xs text-content-secondary uppercase tracking-wider font-medium">{label}</span>}
      <div className="flex items-baseline gap-2">
        <span className={`${sizeClasses[size]} text-content-primary tracking-tight`}>
          {formatted}
        </span>
        {formattedOriginal && (
          <span className="text-xs text-content-tertiary line-through">
            {formattedOriginal}
          </span>
        )}
        {delta !== undefined && (
          <span
            className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
              delta > 0
                ? 'bg-amber-100 text-amber-800'
                : delta < 0
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {delta > 0 ? `+₹${delta}` : delta < 0 ? `-₹${Math.abs(delta)} refund` : '₹0 net'}
          </span>
        )}
      </div>
      {subtitle && <span className="text-xs text-content-secondary mt-0.5">{subtitle}</span>}
    </div>
  );
};
