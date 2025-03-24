
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'success' | 'warning' | 'danger';
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className,
  showValue = false,
  size = 'md',
  color = 'default',
  label
}) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  const colorClasses = {
    default: 'bg-accent',
    success: 'bg-financial-success',
    warning: 'bg-financial-warning',
    danger: 'bg-financial-danger'
  };
  
  return (
    <div className={cn('w-full', className)}>
      {label && <div className="text-sm font-medium mb-1 flex justify-between">
        <span>{label}</span>
        {showValue && <span>{percentage}%</span>}
      </div>}
      <div className="w-full bg-muted rounded-full overflow-hidden">
        <div 
          className={cn(
            'transition-all duration-500 ease-out rounded-full',
            sizeClasses[size],
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
