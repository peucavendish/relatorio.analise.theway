
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface StatusChipProps {
  status: StatusType;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ 
  status, 
  label, 
  icon, 
  className 
}) => {
  return (
    <span 
      className={cn(
        'status-chip',
        `status-chip-${status}`,
        className
      )}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </span>
  );
};

export default StatusChip;
