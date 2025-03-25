
import React from 'react';
import { cn } from '@/lib/utils';
// Import using relative path to avoid casing issues
import {
  Card as ShadcnCard,
  CardContent as ShadcnCardContent,
  CardDescription as ShadcnCardDescription,
  CardFooter as ShadcnCardFooter,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle
} from "./card"; // Using relative path with correct casing

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

// Re-export the components with correct names
const CardContent = ShadcnCardContent;
const CardDescription = ShadcnCardDescription;
const CardFooter = ShadcnCardFooter;
const CardHeader = ShadcnCardHeader;
const CardTitle = ShadcnCardTitle;

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
};

export default Card;
