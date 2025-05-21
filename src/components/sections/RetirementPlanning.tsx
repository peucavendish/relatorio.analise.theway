import React from 'react';
import { BarChart, Wallet, PiggyBank, LineChart, Calculator, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import HideableCard from '@/components/ui/HideableCard';
import StatusChip from "@/components/ui/StatusChip";
import { formatCurrency } from '@/utils/formatCurrency';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import RetirementProjectionChart from '@/components/charts/RetirementProjectionChart';
import { useCardVisibility } from '@/context/CardVisibilityContext';

interface RetirementPlanningProps {
  data: {
    patrimonioLiquido: number;
    excedenteMensal: number;
    totalInvestido: number;
    rendaMensalDesejada: number;
    idadeAposentadoria: number;
    patrimonioAlvo: number;
    idadeAtual: number;
    expectativaVida: number;
    cenarios: any[];
    perfilInvestidor: string;
    alocacaoAtivos: any[];
    anosRestantes: number;
    aporteMensalRecomendado: number;
    possuiPGBL: boolean;
    valorPGBL: number;
    taxaRetiradaSegura: number;
    taxaInflacao: number;
    taxaJurosReal: number;
  };
  hideControls?: boolean;
}

const RetirementPlanning: React.FC<RetirementPlanningProps> = ({ data, hideControls }) => {
  const headerRef = useScrollAnimation();
  const currentSituationRef = useScrollAnimation();
  const objetivoRef = useScrollAnimation();
  const projecaoRef = useScrollAnimation();
  const estrategiaRef = useScrollAnimation();

  const { isCardVisible, toggleCardVisibility } = useCardVisibility();

  // Calculate percentage of income that should be invested (aligned with spreadsheet)
  const percentualInvestir = () => {
    if (!data?.excedenteMensal || !data?.aporteMensalRecomendado) return 0;
    return Math.round((data.aporteMensalRecomendado / data.excedenteMensal) * 100);
  };

  // Get recommended monthly investment (aligned with spreadsheet)
  const getAporteRecomendado = () => {
    return data?.aporteMensalRecomendado || 0;
  };

  // Check if client fits the scenarios (aligned with spreadsheet)
  const adequaAosCenarios = () => {
    return data?.aporteMensalRecomendado <= (data?.excedenteMensal || 0);
  };

  // Calculate missing percentage (aligned with spreadsheet)
  const calcularPorcentagemFaltante = () => {
    if (!data?.aporteMensalRecomendado || !data.excedenteMensal) return 0;
    if (data.aporteMensalRecomendado <= data.excedenteMensal) return 0;

    const faltante = data.aporteMensalRecomendado - data.excedenteMensal;
    return Math.round((faltante / data.excedenteMensal) * 100);
  };

  // Calculate necessary income reduction (aligned with spreadsheet)
  const calcularReducaoRendaNecessaria = () => {
    if (!data?.rendaMensalDesejada || !data.excedenteMensal || !data?.aporteMensalRecomendado) return 0;

    if (data.aporteMensalRecomendado <= data.excedenteMensal) return 0;

    const porcentagemReducao = Math.round(
      (1 - (data.excedenteMensal / data.aporteMensalRecomendado)) * 100
    );
    return porcentagemReducao > 0 ? porcentagemReducao : 0;
  };

  return (
    <section className="min-h-screen py-16 px-4" id="retirement">
      <div className="max-w-4xl mx-auto">
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="mb-12 text-center animate-on-scroll"
        >
          <div className="inline-block">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-financial-success/30 p-3 rounded-full">
                <PiggyBank size={28} className="text-financial-success" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-3">Planejamento de Aposentadoria</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estratégias e projeções para garantir sua independência financeira e
              qualidade de vida na aposentadoria.
            </p>
          </div>
        </div>

        <div
          ref={currentSituationRef as React.RefObject<HTMLDivElement>}
          className="mb-8 animate-on-scroll delay-1"
        >
          <HideableCard
            id="situacao-financeira"
            isVisible={isCardVisible("situacao-financeira")}
            onToggleVisibility={() => toggleCardVisibility("situacao-financeira")}
            hideControls={hideControls}
          >
            <CardHeader>
              <CardTitle className="text-xl">Situação Financeira Atual</CardTitle>
              <CardDescription>
                Análise do seu patrimônio e fluxo financeiro
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <div className="text-sm text-muted-foreground mb-1">Patrimônio Líquido</div>
                <div className="text-2xl font-semibold">
                  {formatCurrency(data?.patrimonioLiquido || 0)}
                </div>
                <div className="mt-1">
                  <StatusChip
                    status={data?.patrimonioLiquido && data.patrimonioLiquido >= 0 ? "success" : "error"}
                    label={data?.patrimonioLiquido && data.patrimonioLiquido >= 0 ? "Positivo" : "Negativo"}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-sm text-muted-foreground mb-1">Excedente Mensal</div>
                <div className="text-2xl font-semibold">
                  {formatCurrency(data?.excedenteMensal || 0)}
                </div>
                <div className="mt-1">
                  <StatusChip
                    status={data?.excedenteMensal && data.excedenteMensal > 20000 ? "success" : "warning"}
                    label={`${data?.excedenteMensal ? Math.round((data.excedenteMensal / 50000) * 100) : 0}% da renda`}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-sm text-muted-foreground mb-1">Investimentos Financeiros Atual</div>
                <div className="text-2xl font-semibold">
                  {formatCurrency(data?.totalInvestido || 0)}
                </div>
                <div className="mt-1">
                  <StatusChip
                    status={data?.totalInvestido && data.totalInvestido > 2000000 ? "success" : "warning"}
                    label={`${data?.totalInvestido && data.patrimonioLiquido
                      ? Math.round((data.totalInvestido / Math.abs(data.patrimonioLiquido)) * 100)
                      : 0}% do patrimônio`}
                  />
                </div>
              </div>
            </CardContent>
          </HideableCard>
        </div>

        <div
          ref={objetivoRef as React.RefObject<HTMLDivElement>}
          className="mb-8 animate-on-scroll delay-2"
        >
          <HideableCard
            id="objetivo-aposentadoria"
            isVisible={isCardVisible("objetivo-aposentadoria")}
            onToggleVisibility={() => toggleCardVisibility("objetivo-aposentadoria")}
            hideControls={hideControls}
          >
            <CardHeader>
              <CardTitle className="text-xl">Objetivo de Aposentadoria</CardTitle>
              <CardDescription>
                Baseado nas suas preferências e estilo de vida
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                  <Calendar size={28} className="text-financial-info mb-2" />
                  <div className="text-sm text-muted-foreground">Idade Planejada</div>
                  <div className="text-xl font-semibold mt-1">
                    {data?.idadeAposentadoria || 0} anos
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    ({data?.anosRestantes || 0} anos restantes)
                  </div>
                </div>

                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                  <Calculator size={28} className="text-financial-success mb-2" />
                  <div className="text-sm text-muted-foreground">Renda Mensal Desejada</div>
                  <div className="text-xl font-semibold mt-1">
                    {formatCurrency(data?.rendaMensalDesejada || 0)}
                  </div>
                </div>

                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                  <PiggyBank size={28} className="text-financial-highlight mb-2" />
                  <div className="text-sm text-muted-foreground">Investimentos Financeiros Alvo</div>
                  <div className="text-xl font-semibold mt-1">
                    {formatCurrency(data?.patrimonioAlvo || 0)}
                  </div>
                </div>
              </div>

              <div className="bg-muted/10 border border-border/80 rounded-lg p-4">
                <h4 className="font-medium mb-2">Premissas Utilizadas (alinhadas com a planilha)</h4>
                <ul className="grid md:grid-cols-2 gap-2">
                  <li className="flex items-start text-sm">
                    <ArrowRight size={16} className="mt-1 mr-2 text-accent" />
                    <span>Taxa de juros real de {(data?.taxaJurosReal || 0.03) * 100}% a.a. (acumulação e consumo)</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <ArrowRight size={16} className="mt-1 mr-2 text-accent" />
                    <span>Inflação média de {(data?.taxaInflacao || 0.0345) * 100}% a.a.</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <ArrowRight size={16} className="mt-1 mr-2 text-accent" />
                    <span>Expectativa de vida até {data?.expectativaVida || 100} anos</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <ArrowRight size={16} className="mt-1 mr-2 text-accent" />
                    <span>Cálculo do capital necessário usando Valor Presente (PV) de saques mensais</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </HideableCard>
        </div>

        <div
          ref={projecaoRef as React.RefObject<HTMLDivElement>}
          className="mb-8 animate-on-scroll delay-2"
        >
          <HideableCard
            id="projecao-patrimonial"
            isVisible={isCardVisible("projecao-patrimonial")}
            onToggleVisibility={() => toggleCardVisibility("projecao-patrimonial")}
            hideControls={hideControls}
          >
            <CardHeader>
              <CardTitle className="text-xl">Projeção Patrimonial</CardTitle>
              <CardDescription>
                Análise da evolução do seu patrimônio ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RetirementProjectionChart
                currentAge={data?.idadeAtual || 0}
                retirementAge={data?.idadeAposentadoria || 65}
                lifeExpectancy={data?.expectativaVida || 100}
                currentPortfolio={data?.totalInvestido || 0}
                monthlyContribution={data?.excedenteMensal || 0}
                rendaMensalDesejada={data?.rendaMensalDesejada || 0}
                safeWithdrawalRate={data?.taxaRetiradaSegura || 0.03}
                inflationRate={data?.taxaInflacao || 0.0345}
                scenarios={data?.cenarios || []}
              />
            </CardContent>
          </HideableCard>
        </div>

        <div
          ref={estrategiaRef as React.RefObject<HTMLDivElement>}
          className="animate-on-scroll delay-3"
        >
          <HideableCard
            id="estrategia-recomendada"
            isVisible={isCardVisible("estrategia-recomendada")}
            onToggleVisibility={() => toggleCardVisibility("estrategia-recomendada")}
            hideControls={hideControls}
          >
            <CardHeader>
              <CardTitle className="text-xl">Estratégia Recomendada</CardTitle>
              <CardDescription>
                Plano para atingir seu objetivo de aposentadoria com segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Alocação de Investimentos</h4>
                  <ul className="space-y-3">
                    {data?.alocacaoAtivos?.map((ativo, index) => (
                      <li key={index} className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                        <span>{ativo.ativo}</span>
                        <span className="font-medium">{ativo.percentual}%</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-sm text-muted-foreground">
                    Perfil do investidor: <span className="font-medium">{data?.perfilInvestidor || "Moderado"}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Ações Recomendadas</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 p-2 bg-muted/30 rounded">
                      <div className="bg-financial-success/20 text-financial-success p-1 rounded mt-0.5">
                        <ArrowRight size={14} />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium block">Aumentar aportes mensais</span>
                        <span className="text-muted-foreground">
                          Investir {formatCurrency(getAporteRecomendado())}/mês ({percentualInvestir()}% do excedente)
                        </span>
                      </div>
                    </li>
                    {data?.possuiPGBL && (
                      <li className="flex items-start gap-2 p-2 bg-muted/30 rounded">
                        <div className="bg-financial-success/20 text-financial-success p-1 rounded mt-0.5">
                          <ArrowRight size={14} />
                        </div>
                        <div className="text-sm">
                          <span className="font-medium block">Otimizar PGBL</span>
                          <span className="text-muted-foreground">
                            Aplicar {formatCurrency(data?.valorPGBL || 0)} para redução fiscal
                          </span>
                        </div>
                      </li>
                    )}
                    <li className="flex items-start gap-2 p-2 bg-muted/30 rounded">
                      <div className="bg-financial-success/20 text-financial-success p-1 rounded mt-0.5">
                        <ArrowRight size={14} />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium block">Diversificar carteira</span>
                        <span className="text-muted-foreground">
                          Alinhar com perfil {data?.perfilInvestidor?.toLowerCase() || "moderado"}
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {adequaAosCenarios() ? (
                <div className="p-4 border border-financial-success/30 bg-financial-success/5 rounded-lg">
                  <h4 className="font-medium text-financial-success mb-2">Projeção da Estratégia</h4>
                  <p className="text-sm">
                    Seguindo o plano recomendado, com um aporte mensal de {formatCurrency(getAporteRecomendado())},
                    você pode atingir seu objetivo de aposentadoria aos {data?.idadeAposentadoria || 0} anos com uma renda mensal de{' '}
                    {formatCurrency(data?.rendaMensalDesejada || 0)}.
                  </p>
                  <p className="text-sm mt-2">
                    Seu patrimônio deverá durar até os {data?.expectativaVida || 100} anos, conforme as premissas utilizadas.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 border border-financial-warning/30 bg-financial-warning/5 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <AlertCircle className="text-financial-warning h-5 w-5 mt-0.5 flex-shrink-0" />
                      <h4 className="font-medium text-financial-warning">Ajustes Necessários para Viabilização</h4>
                    </div>
                    <p className="text-sm mb-3">
                      Com base nas projeções, percebemos que será necessário realizar ajustes para
                      viabilizar seu plano de aposentadoria. O cenário atual exigiria um aporte mensal de{' '}
                      {formatCurrency(getAporteRecomendado())}, que é {calcularPorcentagemFaltante()}% maior que seu excedente atual.
                    </p>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Alternativas a considerar:</h5>
                      <div className="bg-white/40 p-3 rounded">
                        <p className="text-sm font-medium">1. Aumentar o tempo para aposentadoria</p>
                        <p className="text-xs text-muted-foreground">
                          Postergar a aposentadoria em 5 anos pode reduzir significativamente o aporte mensal necessário.
                        </p>
                      </div>
                      <div className="bg-white/40 p-3 rounded">
                        <p className="text-sm font-medium">2. Redução da renda desejada em {calcularReducaoRendaNecessaria()}%</p>
                        <p className="text-xs text-muted-foreground">
                          Reduzir a renda mensal desejada para {formatCurrency(data?.rendaMensalDesejada * (1 - (calcularReducaoRendaNecessaria() / 100)) || 0)} tornaria o plano viável.
                        </p>
                      </div>
                      <div className="bg-white/40 p-3 rounded">
                        <p className="text-sm font-medium">3. Aumentar o excedente mensal</p>
                        <p className="text-xs text-muted-foreground">
                          Aumentar sua capacidade de poupança em {calcularPorcentagemFaltante()}% tornaria o plano viável.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </HideableCard>
        </div>
      </div>
    </section>
  );
};

export default RetirementPlanning;