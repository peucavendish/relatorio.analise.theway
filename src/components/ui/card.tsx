
import React from 'react';
import { cn } from '@/lib/utils';
// Import shadcn components directly
import {
  Card as ShadcnCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card.shadcn"; // This is a placeholder - we need to identify the original import

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

// Export our custom Card component and re-export the shadcn components
export { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
};

export default Card;
