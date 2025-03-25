
import React from 'react';
import { cn } from '@/lib/utils';
// Use the absolute import to avoid casing issues
import { 
  Card as ShadcnCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

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

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
};

export default Card;
