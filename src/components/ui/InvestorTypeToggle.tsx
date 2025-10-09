import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInvestorType, InvestorType } from '@/context/InvestorTypeContext';

export const InvestorTypeToggle: React.FC = () => {
  const { investorType, setInvestorType } = useInvestorType();

  const handleToggle = (checked: boolean) => {
    setInvestorType(checked ? 'qualified' : 'general');
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Tipo de Investidor</CardTitle>
        <CardDescription>
          Selecione o tipo de investidor para personalizar as recomendações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="investor-type" className="text-sm font-medium">
              {investorType === 'qualified' ? 'Investidor Qualificado' : 'Investidor Geral'}
            </Label>
            <p className="text-xs text-muted-foreground">
              {investorType === 'qualified' 
                ? 'Acesso a produtos mais sofisticados e maior flexibilidade de alocação'
                : 'Produtos regulamentados com foco em segurança e liquidez'
              }
            </p>
          </div>
          <Switch
            id="investor-type"
            checked={investorType === 'qualified'}
            onCheckedChange={handleToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
};
