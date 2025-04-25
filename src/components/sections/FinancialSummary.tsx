import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import HideableCard from '@/components/ui/HideableCard';
import StatusChip from '@/components/ui/StatusChip';
import DonutChart from '@/components/charts/DonutChart';
import ProgressBar from '@/components/ui/ProgressBar';
import { TrendingUp, TrendingDown, DollarSign, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { formatCurrency } from '@/utils/formatCurrency';
import useCardVisibility from '@/hooks/useCardVisibility';

interface FinanceSummary {
  patrimonioLiquido: number;
  excedenteMensal: number;
  rendas: Array<{ fonte: string; valor: number; tributacao: string }>;
  despesasMensais: number;
  composicaoPatrimonial: {
    imoveis: number;
    investimentos: number;
  };
  ativos: Array<{ tipo: string; valor: number }>;
  passivos: Array<{ tipo: string; valor: number }>;
}

interface FinancialSummaryProps {
  data: FinanceSummary;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ data }) => {
  const headerRef = useScrollAnimation();
  const summaryCardRef = useScrollAnimation();
  const incomeExpenseCardRef = useScrollAnimation();
  const assetsCardRef = useScrollAnimation();
  const liabilitiesCardRef = useScrollAnimation();

  const { isCardVisible, toggleCardVisibility } = useCardVisibility();

  // Calculate total income from all sources
  const totalIncome = data.rendas.reduce((sum, renda) => sum + renda.valor, 0);

  // Calculate total assets and liabilities
  const totalAssets = data.ativos.reduce((sum, asset) => sum + asset.valor, 0);
  const totalLiabilities = data.passivos.reduce((sum, liability) => sum + liability.valor, 0);

  // Calculate total composition for normalization
  const totalComposition = data.composicaoPatrimonial.imoveis + data.composicaoPatrimonial.investimentos;

  // Prepare data for the composition chart
  const compositionChartData = [
    {
      name: 'Imóveis',
      value: totalComposition > 0 ? Math.round((data.composicaoPatrimonial.imoveis / totalComposition) * 100) : 0,
      color: '#60A5FA',
      rawValue: formatCurrency(data.composicaoPatrimonial.imoveis)
    },
    {
      name: 'Investimentos',
      value: totalComposition > 0 ? Math.round((data.composicaoPatrimonial.investimentos / totalComposition) * 100) : 0,
      color: '#34D399',
      rawValue: formatCurrency(data.composicaoPatrimonial.investimentos)
    },
  ];

  // Get income by source for display
  const getIncomeBySource = (source: string) => {
    const renda = data.rendas.find(r => r.fonte === source);
    return renda ? renda.valor : 0;
  };

  return (
    <section className="py-16 px-4" id="summary">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="mb-12 text-center animate-on-scroll"
        >
          <div className="inline-block">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-financial-info/10 p-3 rounded-full">
                <DollarSign size={28} className="text-financial-info" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-3">Resumo Financeiro</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visão geral da sua situação financeira atual, incluindo patrimônio,
              renda, gastos e composição patrimonial.
            </p>
          </div>
        </div>

        {/* Financial Overview */}
        <div
          ref={summaryCardRef as React.RefObject<HTMLDivElement>}
          className="mb-10 animate-on-scroll"
        >
          <HideableCard
            id="patrimonio-resumo"
            isVisible={isCardVisible("patrimonio-resumo")}
            onToggleVisibility={() => toggleCardVisibility("patrimonio-resumo")}
          >
            <div className="grid md:grid-cols-3 gap-6 p-8">
              <div className="text-center">
                <h3 className="text-muted-foreground text-sm mb-1">Patrimônio Líquido</h3>
                <div className="text-3xl font-bold mb-1">
                  {formatCurrency(data.patrimonioLiquido)}
                </div>
                <StatusChip
                  status="success"
                  label="Sólido"
                  icon={<TrendingUp size={14} />}
                />
              </div>

              <div className="text-center">
                <h3 className="text-muted-foreground text-sm mb-1">Renda Mensal</h3>
                <div className="text-3xl font-bold mb-1">
                  {formatCurrency(totalIncome)}
                </div>
                <div className="flex justify-center gap-2 flex-wrap">
                  {data.rendas.map((renda, index) => (
                    <StatusChip
                      key={index}
                      status={renda.tributacao === 'Isento' ? 'success' : 'info'}
                      label={`${renda.fonte}: ${formatCurrency(renda.valor)}`}
                      className="text-xs"
                    />
                  ))}
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-muted-foreground text-sm mb-1">Excedente Mensal</h3>
                <div className="text-3xl font-bold mb-1">
                  {formatCurrency(data.excedenteMensal)}
                </div>
                <StatusChip
                  status={data.excedenteMensal > 0 ? "success" : "danger"}
                  label={data.excedenteMensal > 0 ? "Positivo" : "Negativo"}
                  icon={data.excedenteMensal > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                />
              </div>
            </div>
          </HideableCard>
        </div>

        {/* Income & Expenses */}
        <div
          ref={incomeExpenseCardRef as React.RefObject<HTMLDivElement>}
          className="mb-10 animate-on-scroll delay-1"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <HideableCard
              id="renda-despesas"
              isVisible={isCardVisible("renda-despesas")}
              onToggleVisibility={() => toggleCardVisibility("renda-despesas")}
            >
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-4">Renda vs. Despesas</h3>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span>Renda Total</span>
                    <span className="font-medium">{formatCurrency(totalIncome)}</span>
                  </div>
                  <ProgressBar
                    value={totalIncome}
                    max={totalIncome}
                    size="lg"
                    color="success"
                  />
                </div>

                <div className="mb-2">
                  <div className="flex justify-between mb-2">
                    <span>Despesas</span>
                    <span className="font-medium">{formatCurrency(data.despesasMensais)}</span>
                  </div>
                  <ProgressBar
                    value={data.despesasMensais}
                    max={totalIncome}
                    size="lg"
                    color={data.despesasMensais > totalIncome ? "danger" : "warning"}
                  />
                </div>

                <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                  <div>
                    <span className="text-sm text-muted-foreground">Excedente Mensal</span>
                    <div className="text-xl font-semibold">
                      {formatCurrency(data.excedenteMensal)}
                    </div>
                  </div>
                  <StatusChip
                    status={data.excedenteMensal > 0 ? "success" : "danger"}
                    label={`${Math.round((data.excedenteMensal / totalIncome) * 100)}% da renda`}
                  />
                </div>
              </div>
            </HideableCard>

            <HideableCard
              id="composicao-patrimonial"
              isVisible={isCardVisible("composicao-patrimonial")}
              onToggleVisibility={() => toggleCardVisibility("composicao-patrimonial")}
            >
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-4">Composição Patrimonial</h3>
                <DonutChart data={compositionChartData} />
              </div>
            </HideableCard>
          </div>
        </div>

        {/* Assets & Liabilities */}
        <div className="grid md:grid-cols-2 gap-6">
          <div
            ref={assetsCardRef as React.RefObject<HTMLDivElement>}
            className="animate-on-scroll delay-2"
          >
            <HideableCard
              id="ativos"
              isVisible={isCardVisible("ativos")}
              onToggleVisibility={() => toggleCardVisibility("ativos")}
            >
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-4">Ativos</h3>
                <div className="space-y-4">
                  {data.ativos.map((asset, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{asset.tipo}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{formatCurrency(asset.valor)}</span>
                        <span className="text-xs text-muted-foreground">
                          ({Math.round((asset.valor / totalAssets) * 100)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-border flex justify-between items-center">
                    <span className="font-semibold">Total de Ativos</span>
                    <span className="font-semibold">{formatCurrency(totalAssets)}</span>
                  </div>
                </div>
              </div>
            </HideableCard>
          </div>

          <div
            ref={liabilitiesCardRef as React.RefObject<HTMLDivElement>}
            className="animate-on-scroll delay-3"
          >
            <HideableCard
              id="passivos"
              isVisible={isCardVisible("passivos")}
              onToggleVisibility={() => toggleCardVisibility("passivos")}
            >
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-4">Passivos</h3>
                {data.passivos.length > 0 ? (
                  <div className="space-y-4">
                    {data.passivos.map((liability, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{liability.tipo}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{formatCurrency(liability.valor)}</span>
                          <span className="text-xs text-muted-foreground">
                            ({Math.round((liability.valor / totalLiabilities) * 100)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-border flex justify-between items-center">
                      <span className="font-semibold">Total de Passivos</span>
                      <span className="font-semibold">{formatCurrency(totalLiabilities)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-muted-foreground">Nenhum passivo registrado</p>
                  </div>
                )}
              </div>
            </HideableCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancialSummary;