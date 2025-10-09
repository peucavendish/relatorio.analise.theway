import React from 'react';
import { useInvestorType } from '@/context/InvestorTypeContext';
import AllocationDiagnosis from '@/components/sections/AllocationDiagnosis';
import { getPensionPortfolio } from '@/data/pensionPortfolios';

interface AllocationDiagnosisWrapperProps {
  userReports: any;
  mapModelToAllocationProps: (model: any, investorType: string, portfolioType: string) => any;
}

export const AllocationDiagnosisWrapper: React.FC<AllocationDiagnosisWrapperProps> = ({
  userReports,
  mapModelToAllocationProps
}) => {
  const { investorType, portfolioType } = useInvestorType();

  if (!userReports || !userReports?.posicao_atual) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h3 className="text-2xl font-semibold mb-4">Nenhum dado disponível</h3>
          <p className="text-muted-foreground">Por favor, carregue um relatório válido.</p>
        </div>
      </div>
    );
  }

  const mapped = mapModelToAllocationProps(userReports, investorType, portfolioType);

  return (
    <AllocationDiagnosis
      identificacao={mapped.identificacao}
      patrimonioTotal={mapped.patrimonioTotal}
      patrimonioCarteiraBrasil={mapped.patrimonioCarteiraBrasil}
      ativos={mapped.ativos}
      consolidado={mapped.consolidado}
      liquidez={mapped.liquidez}
      internacional={mapped.internacional}
      comparativo={mapped.comparativo}
      modeloIdeal={mapped.modeloIdeal}
      macro={mapped.macro}
    />
  );
};
