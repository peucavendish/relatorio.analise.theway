
import React from 'react';
import { cn } from '@/lib/utils';
// Import directly from shadcn/ui
import {
  Card as ShadcnCard,
  CardContent as ShadcnCardContent,
  CardDescription as ShadcnCardDescription,
  CardFooter as ShadcnCardFooter,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle
} from "../ui/card.tsx"; // Keep the import path but fix the naming

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
    <ShadcnCard
      className={cn(
        'financial-card',
        highlight && 'bg-accent/10 border-accent/30',
        interactive && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </ShadcnCard>
  );
};

// Export the components directly instead of creating aliases that cause circular references
export {
  Card,
  ShadcnCardContent as CardContent,
  ShadcnCardDescription as CardDescription,
  ShadcnCardFooter as CardFooter,
  ShadcnCardHeader as CardHeader,
  ShadcnCardTitle as CardTitle
};

export default Card;
