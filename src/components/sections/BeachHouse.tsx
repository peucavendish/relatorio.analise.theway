
import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { formatCurrency } from '@/utils/formatCurrency';
import StatusChip from '@/components/ui/StatusChip';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"; // Fixed import path with correct casing
import { Home, Umbrella, Calculator, Check, X, PiggyBank, ArrowRight, TrendingDown, Calendar } from 'lucide-react';

interface Strategy {
  estrategia: string;
  parcelaMensal: number;
  totalPago: number;
}

interface BeachHouseProps {
  data?: {
    casaPraia: {
      objetivo: {
        valorImovel: number;
        prazoDesejado: number;
      };
      comparativoEstrategias: Strategy[];
      estrategiaRecomendada: string;
      vantagens: string[];
      desvantagens: string[];
      impactoFinanceiro: {
        excedenteMensalAtual: number;
        parcelaConsorcio: number;
        excedenteMensalApos: number;
        observacao: string;
      };
    };
  };
}

// Mock data if none provided
const defaultData = {
  casaPraia: {
    objetivo: {
      valorImovel: 800000,
      prazoDesejado: 5
    },
    comparativoEstrategias: [
      {estrategia: "Consórcio", parcelaMensal: 5000, totalPago: 960000},
      {estrategia: "Financiamento", parcelaMensal: 6500, totalPago: 1290000},
      {estrategia: "Reserva Livre", parcelaMensal: 11000, totalPago: 800000}
    ],
    estrategiaRecomendada: "Consórcio",
    vantagens: [
      "Sem juros",
      "Menor custo total",
      "Flexibilidade para lance"
    ],
    desvantagens: [
      "Tempo de contemplação incerto",
      "Taxa administrativa"
    ],
    impactoFinanceiro: {
      excedenteMensalAtual: 17000,
      parcelaConsorcio: 5000,
      excedenteMensalApos: 12000,
      observacao: "O consórcio permite manter um excedente mensal significativo para outros objetivos financeiros, principalmente a aposentadoria."
    }
  }
};

const BeachHouse: React.FC<BeachHouseProps> = ({ data = defaultData }) => {
  const headerRef = useScrollAnimation();
  const objectiveCardRef = useScrollAnimation();
  const strategiesCardRef = useScrollAnimation();
  const impactCardRef = useScrollAnimation();
  
  const { casaPraia } = data;
  
  // Find details of recommended strategy
  const recommendedStrategy = casaPraia.comparativoEstrategias.find(
    s => s.estrategia === casaPraia.estrategiaRecomendada
  );
  
  return (
    <section className="py-16 px-4" id="beach-house">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div 
          ref={headerRef as React.RefObject<HTMLDivElement>} 
          className="mb-12 text-center animate-on-scroll"
        >
          <div className="inline-block">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-accent/10 p-3 rounded-full">
                <Umbrella size={28} className="text-accent" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-3">Casa de Praia</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estratégias para aquisição da casa de praia desejada, otimizando o investimento e preservando o planejamento financeiro.
            </p>
          </div>
        </div>
        
        {/* Objective Card */}
        <div 
          ref={objectiveCardRef as React.RefObject<HTMLDivElement>} 
          className="mb-10 animate-on-scroll delay-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center">
                <Home size={22} className="mr-2 text-accent" />
                Objetivo: Aquisição de Casa de Praia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48 bg-accent/5 rounded-full flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-dashed border-accent/20 animate-spin-slow"></div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent">
                        {formatCurrency(casaPraia.objetivo.valorImovel)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Valor do imóvel
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <h3 className="text-xl font-medium mb-4">Detalhes do Objetivo</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Calendar className="mr-3 text-accent mt-1" size={18} />
                      <div>
                        <div className="font-medium">Prazo Desejado</div>
                        <div className="text-muted-foreground">
                          {casaPraia.objetivo.prazoDesejado} anos
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <PiggyBank className="mr-3 text-accent mt-1" size={18} />
                      <div>
                        <div className="font-medium">Estratégia Recomendada</div>
                        <div className="text-muted-foreground">
                          {casaPraia.estrategiaRecomendada}
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Calculator className="mr-3 text-accent mt-1" size={18} />
                      <div>
                        <div className="font-medium">Valor Mensal</div>
                        <div className="text-muted-foreground">
                          {recommendedStrategy ? formatCurrency(recommendedStrategy.parcelaMensal) : '-'} / mês
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Strategies Comparison */}
        <div 
          ref={strategiesCardRef as React.RefObject<HTMLDivElement>} 
          className="mb-10 animate-on-scroll delay-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center">
                <Calculator size={22} className="mr-2 text-accent" />
                Comparativo de Estratégias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">Estratégia</th>
                      <th className="text-right py-3 px-4">Parcela Mensal</th>
                      <th className="text-right py-3 px-4">Total Pago</th>
                      <th className="text-right py-3 px-4">Diferença</th>
                    </tr>
                  </thead>
                  <tbody>
                    {casaPraia.comparativoEstrategias.map((strategy, index) => {
                      const isRecommended = strategy.estrategia === casaPraia.estrategiaRecomendada;
                      const difference = strategy.totalPago - casaPraia.objetivo.valorImovel;
                      const percentDifference = ((difference / casaPraia.objetivo.valorImovel) * 100).toFixed(1);
                      
                      return (
                        <tr 
                          key={index} 
                          className={`
                            border-b border-border last:border-0 
                            ${isRecommended ? 'bg-accent/5' : ''}
                          `}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              {isRecommended && (
                                <div className="bg-accent/10 p-1 rounded-full mr-2">
                                  <Check size={16} className="text-accent" />
                                </div>
                              )}
                              <span className={isRecommended ? 'font-medium' : ''}>
                                {strategy.estrategia}
                              </span>
                              {isRecommended && (
                                <span className="ml-2 text-sm bg-accent/10 text-accent px-2 py-1 rounded-full">
                                  Recomendado
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            {formatCurrency(strategy.parcelaMensal)}
                          </td>
                          <td className="py-4 px-4 text-right">
                            {formatCurrency(strategy.totalPago)}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end">
                              {difference > 0 ? (
                                <TrendingDown size={16} className="text-financial-danger mr-1" />
                              ) : (
                                <Check size={16} className="text-financial-success mr-1" />
                              )}
                              <span className={difference > 0 ? 'text-financial-danger' : 'text-financial-success'}>
                                {difference > 0 ? `+${formatCurrency(difference)}` : 'Ideal'}
                                {difference > 0 ? ` (+${percentDifference}%)` : ''}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Pros and Cons */}
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="border border-border rounded-lg p-5">
                  <h3 className="font-medium text-lg mb-4 flex items-center">
                    <Check size={18} className="text-financial-success mr-2" />
                    Vantagens do {casaPraia.estrategiaRecomendada}
                  </h3>
                  <ul className="space-y-2">
                    {casaPraia.vantagens.map((vantagem, i) => (
                      <li key={i} className="flex items-center">
                        <Check size={16} className="text-financial-success mr-2 shrink-0" />
                        <span>{vantagem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border border-border rounded-lg p-5">
                  <h3 className="font-medium text-lg mb-4 flex items-center">
                    <X size={18} className="text-financial-danger mr-2" />
                    Desvantagens do {casaPraia.estrategiaRecomendada}
                  </h3>
                  <ul className="space-y-2">
                    {casaPraia.desvantagens.map((desvantagem, i) => (
                      <li key={i} className="flex items-center">
                        <X size={16} className="text-financial-danger mr-2 shrink-0" />
                        <span>{desvantagem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Financial Impact */}
        <div 
          ref={impactCardRef as React.RefObject<HTMLDivElement>} 
          className="animate-on-scroll delay-3"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center">
                <TrendingDown size={22} className="mr-2 text-accent" />
                Impacto Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
                <div className="text-center">
                  <div className="text-muted-foreground mb-1">Excedente Mensal Atual</div>
                  <div className="text-2xl font-bold">{formatCurrency(casaPraia.impactoFinanceiro.excedenteMensalAtual)}</div>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <ArrowRight size={24} />
                </div>
                
                <div className="text-center">
                  <div className="text-muted-foreground mb-1">Parcela {casaPraia.estrategiaRecomendada}</div>
                  <div className="text-2xl font-bold text-financial-danger">
                    - {formatCurrency(casaPraia.impactoFinanceiro.parcelaConsorcio)}
                  </div>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <ArrowRight size={24} />
                </div>
                
                <div className="text-center">
                  <div className="text-muted-foreground mb-1">Excedente Mensal Após</div>
                  <div className="text-2xl font-bold text-financial-success">
                    {formatCurrency(casaPraia.impactoFinanceiro.excedenteMensalApos)}
                  </div>
                </div>
              </div>
              
              <div className="bg-accent/5 p-4 rounded-lg border border-accent/10">
                <h3 className="font-medium mb-2 flex items-center">
                  <Check size={18} className="text-accent mr-2" />
                  Observação
                </h3>
                <p>{casaPraia.impactoFinanceiro.observacao}</p>
              </div>
              
              <div className="mt-6">
                <StatusChip 
                  status="success"
                  label="Objetivo viável dentro do planejamento financeiro"
                  className="mx-auto"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BeachHouse;
