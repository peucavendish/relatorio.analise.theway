import React from 'react';
import { BarChart, Wallet, PiggyBank, LineChart, Calculator, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import HideableCard from '@/components/ui/HideableCard';
import StatusChip from "@/components/ui/StatusChip";
import { formatCurrency } from '@/utils/formatCurrency';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import RetirementProjectionChart from '@/components/charts/RetirementProjectionChart';
import useCardVisibility from '@/hooks/useCardVisibility';

interface RetirementPlanningProps {
  data?: {
    patrimonioLiquido: number;
    excedenteMensal: number;
    totalInvestido: number;
    rendaMensalDesejada: number;
    idadeAtual: number;
    idadeAposentadoria: number;
    patrimonioAlvo: number;
    expectativaVida: number;
    anosRestantes: number;
    aporteMensalRecomendado: number;
    taxaRetiradaSegura: number;
    taxaInflacao: number;
    taxaJurosReal: number;
    perfilInvestidor: string;
    alocacaoAtivos: Array<{
      ativo: string;
      percentual: number;
    }>;
    cenarios: Array<{
      idade: number;
      aporteMensal: number;
      capitalNecessario: number;
    }>;
    possuiPGBL: boolean;
    valorPGBL: number;
  };
}

const RetirementPlanning: React.FC<RetirementPlanningProps> = ({ data }) => {
  const headerRef = useScrollAnimation();
  const currentSituationRef = useScrollAnimation();
  const objetivoRef = useScrollAnimation();
  const projecaoRef = useScrollAnimation();
  const estrategiaRef = useScrollAnimation();

  const { isCardVisible, toggleCardVisibility } = useCardVisibility();

  // Calculate percentage of income that should be invested correctly
  const percentualInvestir = () => {
    if (!data?.excedenteMensal || !data?.cenarios || data.cenarios.length < 2) return 0;
    
    const aporteCenarioSecundario = data.cenarios[1]?.aporteMensal || 0;
    return Math.round((aporteCenarioSecundario / data.excedenteMensal) * 100);
  };

  // Determine which aporte to use based on conditions
  const getAporteRecomendado = () => {
    if (!data?.cenarios || !data.excedenteMensal) {
      return data?.aporteMensalRecomendado || 0;
    }
    // Get value from the second scenario (if exists)
    const aporteCenarioSecundario = data.cenarios[1]?.aporteMensal || 0;
    
    // If it's greater than the excedente, use excedente
    if (aporteCenarioSecundario > data.excedenteMensal) {
      return data.excedenteMensal;
    }
    
    // Otherwise use the value from cenarios[1]
    return aporteCenarioSecundario;
  };

  // Verifica se o cliente se adequa a algum dos cenários
  const adequaAosCenarios = () => {
    if (!data?.cenarios || !data.excedenteMensal || data.cenarios.length < 2) return false;
    
    // Verifica se o aporte do segundo cenário é viável com o excedente mensal
    const aporteCenarioSecundario = data.cenarios[1]?.aporteMensal || 0;
    return aporteCenarioSecundario <= data.excedenteMensal;
  };

  // Calcula a porcentagem adicional necessária para atingir o cenário mais viável
  const calcularPorcentagemFaltante = () => {
    if (!data?.cenarios || !data.excedenteMensal || data.cenarios.length < 2) return 0;
    
    const aporteCenarioSecundario = data.cenarios[1]?.aporteMensal || 0;
    
    if (aporteCenarioSecundario <= data.excedenteMensal) return 0;
    
    const faltante = aporteCenarioSecundario - data.excedenteMensal;
    return Math.round((faltante / data.excedenteMensal) * 100);
  };

  // Calcular redução necessária na renda mensal desejada
  const calcularReducaoRendaNecessaria = () => {
    if (!data?.rendaMensalDesejada || !data.excedenteMensal || !data?.cenarios || data.cenarios.length < 2) return 0;
    
    const aporteCenarioSecundario = data.cenarios[1]?.aporteMensal || 0;
    
    // Se o aporte for viável, não é necessária redução
    if (aporteCenarioSecundario <= data.excedenteMensal) return 0;
    
    // Estimativa básica: quanto precisaria reduzir a renda desejada para que o aporte fosse viável
    const porcentagemReducao = Math.round((1 - (data.excedenteMensal / aporteCenarioSecundario)) * 100);
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
                <div className="text-sm text-muted-foreground mb-1">Total Investido</div>
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
                  <Calculator size={28} className="text-financial-success mb-2" />
                  <div className="text-sm text-muted-foreground">Renda Mensal Desejada</div>
                  <div className="text-xl font-semibold mt-1">
                    {formatCurrency(data?.rendaMensalDesejada || 50000)}
                  </div>
                </div>

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
                  <PiggyBank size={28} className="text-financial-highlight mb-2" />
                  <div className="text-sm text-muted-foreground">Patrimônio Alvo</div>
                  <div className="text-xl font-semibold mt-1">
                    {formatCurrency(data?.patrimonioAlvo || 13068655.02)}
                  </div>
                </div>
              </div>

              <div className="bg-muted/10 border border-border/80 rounded-lg p-4">
                <h4 className="font-medium mb-2">Premissas Utilizadas</h4>
                <ul className="grid md:grid-cols-2 gap-2">
                  <li className="flex items-start text-sm">
                    <ArrowRight size={16} className="mt-1 mr-2 text-accent" />
                    <span>Taxa de juros real de {(data?.taxaJurosReal || 0) * 100}% a.a.</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <ArrowRight size={16} className="mt-1 mr-2 text-accent" />
                    <span>Inflação média de 3,5 % a.a.</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <ArrowRight size={16} className="mt-1 mr-2 text-accent" />
                    <span>Expectativa de vida até {data?.expectativaVida || 0} anos</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <ArrowRight size={16} className="mt-1 mr-2 text-accent" />
                    <span>Taxa de retirada segura de {(data?.taxaRetiradaSegura || 0) * 100}%</span>
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
          >
            <CardHeader>
              <CardTitle className="text-xl">Projeção Patrimonial</CardTitle>
              <CardDescription>
                Análise da evolução do seu patrimônio ao longo do tempo em diferentes cenários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RetirementProjectionChart
                currentAge={data?.idadeAtual || 30}
                retirementAge={data?.idadeAposentadoria || 65}
                lifeExpectancy={data?.expectativaVida || 100}
                currentPortfolio={data?.totalInvestido || 1000000}
                monthlyContribution={data?.excedenteMensal || 10000}
                targetAmount={data?.patrimonioAlvo || 5000000}
                safeWithdrawalRate={data?.taxaRetiradaSegura || 0.04}
                inflationRate={data?.taxaInflacao || 0.035}
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
                          Investir {percentualInvestir()}% do excedente ({formatCurrency(getAporteRecomendado())}/mês)
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
                // Caso o cliente se adeque aos cenários
                <div className="p-4 border border-financial-success/30 bg-financial-success/5 rounded-lg">
                  <h4 className="font-medium text-financial-success mb-2">Projeção da Estratégia</h4>
                  <p className="text-sm">
                    Seguindo o plano recomendado, você tem <span className="font-medium">alta probabilidade</span> de
                    atingir seu objetivo de aposentadoria até os {data?.idadeAposentadoria || 0} anos com a renda mensal desejada de{' '}
                    {formatCurrency(data?.rendaMensalDesejada || 0)} por {data?.expectativaVida && data.idadeAposentadoria
                      ? data.expectativaVida - data.idadeAposentadoria
                      : 35} anos. Revisões anuais são recomendadas para ajustes conforme necessário.
                  </p>
                </div>
              ) : (
                // Caso o cliente NÃO se adeque aos cenários
                <div className="space-y-4">
                  <div className="p-4 border border-financial-warning/30 bg-financial-warning/5 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <AlertCircle className="text-financial-warning h-5 w-5 mt-0.5 flex-shrink-0" />
                      <h4 className="font-medium text-financial-warning">Ajustes Necessários para Viabilização</h4>
                    </div>
                    <p className="text-sm mb-3">
                      Com base nas projeções, percebemos que será necessário realizar ajustes para 
                      viabilizar seu plano de aposentadoria. O cenário atual exigiria um aporte mensal {calcularPorcentagemFaltante()}% 
                      maior do que seu excedente atual permite.
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
                        <p className="text-sm font-medium">2. Consumo de patrimônio</p>
                        <p className="text-xs text-muted-foreground">
                          Considerar a venda de ativos não essenciais para complementar a renda na aposentadoria.
                        </p>
                      </div>
                      <div className="bg-white/40 p-3 rounded">
                        <p className="text-sm font-medium">3. Redução da renda desejada</p>
                        <p className="text-xs text-muted-foreground">
                          Reduzir a renda mensal desejada em aproximadamente {calcularReducaoRendaNecessaria()}% tornaria 
                          o plano mais viável com seus recursos atuais.
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