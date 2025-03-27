import React from 'react';
import { BarChart, Wallet, PiggyBank, LineChart, Calculator, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import StatusChip from "@/components/ui/StatusChip";
import { formatCurrency } from '@/utils/formatCurrency';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// This is a simplified version of the retirement planning section
const RetirementPlanning = () => {
  const headerRef = useScrollAnimation();
  const currentSituationRef = useScrollAnimation();
  const objetivoRef = useScrollAnimation();
  const estrategiaRef = useScrollAnimation();
  
  return (
    <section className="min-h-screen py-16 px-4" id="retirement">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
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

        {/* Current Financial Situation */}
        <div 
          ref={currentSituationRef as React.RefObject<HTMLDivElement>}
          className="mb-8 animate-on-scroll delay-1"
        >
          <Card>
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
                  {formatCurrency(3650000)}
                </div>
                <div className="mt-1">
                  <StatusChip status="success" label="Acima da média" />
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-sm text-muted-foreground mb-1">Excedente Mensal</div>
                <div className="text-2xl font-semibold">
                  {formatCurrency(17000)}
                </div>
                <div className="mt-1">
                  <StatusChip status="info" label="48.5% da renda" />
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-sm text-muted-foreground mb-1">Total Investido</div>
                <div className="text-2xl font-semibold">
                  {formatCurrency(1000000)}
                </div>
                <div className="mt-1">
                  <StatusChip status="warning" label="27.4% do patrimônio" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Retirement Goal */}
        <div 
          ref={objetivoRef as React.RefObject<HTMLDivElement>}
          className="mb-8 animate-on-scroll delay-2"
        >
          <Card>
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
                    {formatCurrency(25000)}
                  </div>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                  <Calendar size={28} className="text-financial-info mb-2" />
                  <div className="text-sm text-muted-foreground">Idade Planejada</div>
                  <div className="text-xl font-semibold mt-1">
                    60 anos
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    (17 anos restantes)
                  </div>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                  <PiggyBank size={28} className="text-financial-highlight mb-2" />
                  <div className="text-sm text-muted-foreground">Patrimônio Alvo</div>
                  <div className="text-xl font-semibold mt-1">
                    {formatCurrency(5000000)}
                  </div>
                </div>
              </div>
              
              <div className="bg-muted/10 border border-border/80 rounded-lg p-4">
                <h4 className="font-medium mb-2">Premissas Utilizadas</h4>
                <ul className="grid md:grid-cols-2 gap-2">
                  <li className="flex items-start text-sm">
                    <ArrowRight size={16} className="mt-1 mr-2 text-accent" />
                    <span>Taxa de juros real de 4% a.a.</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <ArrowRight size={16} className="mt-1 mr-2 text-accent" />
                    <span>Inflação média de 3.5% a.a.</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <ArrowRight size={16} className="mt-1 mr-2 text-accent" />
                    <span>Expectativa de vida até 90 anos</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <ArrowRight size={16} className="mt-1 mr-2 text-accent" />
                    <span>Taxa de retirada segura de 4%</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Retirement Strategy */}
        <div 
          ref={estrategiaRef as React.RefObject<HTMLDivElement>}
          className="animate-on-scroll delay-3"
        >
          <Card>
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
                    <li className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                      <span>Renda Fixa</span>
                      <span className="font-medium">40%</span>
                    </li>
                    <li className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                      <span>Renda Variável</span>
                      <span className="font-medium">30%</span>
                    </li>
                    <li className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                      <span>Previdência Privada</span>
                      <span className="font-medium">20%</span>
                    </li>
                    <li className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                      <span>Investimentos Alternativos</span>
                      <span className="font-medium">10%</span>
                    </li>
                  </ul>
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
                          De R$ 5.000 para R$ 10.000 mensais
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2 p-2 bg-muted/30 rounded">
                      <div className="bg-financial-success/20 text-financial-success p-1 rounded mt-0.5">
                        <ArrowRight size={14} />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium block">Maximizar PGBL</span>
                        <span className="text-muted-foreground">
                          Aplicar 12% da renda tributável
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2 p-2 bg-muted/30 rounded">
                      <div className="bg-financial-success/20 text-financial-success p-1 rounded mt-0.5">
                        <ArrowRight size={14} />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium block">Diversificar carteira de ações</span>
                        <span className="text-muted-foreground">
                          Incluir ETFs e fundos internacionais
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 border border-financial-success/30 bg-financial-success/5 rounded-lg">
                <h4 className="font-medium text-financial-success mb-2">Projeção da Estratégia</h4>
                <p className="text-sm">
                  Seguindo o plano recomendado, você tem <span className="font-medium">91% de probabilidade</span> de 
                  atingir seu objetivo de aposentadoria até os 60 anos com a renda mensal desejada de 
                  {formatCurrency(25000)}. Revisões anuais são recomendadas para ajustes conforme necessário.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RetirementPlanning;
