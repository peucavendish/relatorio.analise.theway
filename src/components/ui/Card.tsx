
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
  onClick?: () => void;
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className,
  highlight = false,
  onClick,
  interactive = false
}) => {
  return (
    <div 
      className={cn(
        'financial-card',
        highlight && 'bg-accent/10 border-accent/30',
        interactive && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
