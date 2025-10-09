import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInvestorType, PortfolioType } from '@/context/InvestorTypeContext';

export const PortfolioTypeToggle: React.FC = () => {
  const { portfolioType, setPortfolioType } = useInvestorType();

  const handleToggle = (checked: boolean) => {
    setPortfolioType(checked ? 'pension' : 'regular');
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Tipo de Carteira</CardTitle>
        <CardDescription>
          Escolha entre carteira regular ou carteira de Previdência
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="portfolio-type" className="text-sm font-medium">
              {portfolioType === 'pension' ? 'Carteira de Previdência' : 'Carteira Regular'}
            </Label>
            <p className="text-xs text-muted-foreground">
              {portfolioType === 'pension' 
                ? 'Carteiras específicas para Previdência com produtos XP Seg'
                : 'Carteiras tradicionais de investimento'
              }
            </p>
          </div>
          <Switch
            id="portfolio-type"
            checked={portfolioType === 'pension'}
            onCheckedChange={handleToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};
