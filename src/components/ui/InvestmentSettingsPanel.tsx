import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InvestorTypeToggle } from './InvestorTypeToggle';
import { PortfolioTypeToggle } from './PortfolioTypeToggle';
import { useInvestorType } from '@/context/InvestorTypeContext';

export const InvestmentSettingsPanel: React.FC = () => {
  const { investorType, portfolioType } = useInvestorType();

  return (
    <div className="space-y-4">
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-primary">Configurações de Investimento</CardTitle>
          <CardDescription>
            Personalize as recomendações de acordo com seu perfil e objetivos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InvestorTypeToggle />
          <PortfolioTypeToggle />
          
          {/* Status Display */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium text-muted-foreground mb-1">Configuração Atual:</div>
            <div className="text-sm">
              <span className="font-medium">
                {investorType === 'qualified' ? 'Investidor Qualificado' : 'Investidor Geral'}
              </span>
              {' • '}
              <span className="font-medium">
                {portfolioType === 'pension' ? 'Carteira de Previdência' : 'Carteira Regular'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
