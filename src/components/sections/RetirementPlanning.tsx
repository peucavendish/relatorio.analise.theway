
import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { formatCurrency } from '@/utils/formatCurrency';
import StatusChip from '@/components/ui/StatusChip';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PiggyBank, TrendingUp, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';

const RetirementPlanning: React.FC = () => {
  const headerRef = useScrollAnimation();
  const summaryCardRef = useScrollAnimation();
  const scenariosCardRef = useScrollAnimation();
  const recommendationsCardRef = useScrollAnimation();
  
  // Mock data for the retirement planning
  const retirementData = {
    currentAge: 43,
    retirementAge: 60,
    yearsToRetirement: 17,
    currentMonthlyIncome: 35000,
    desiredRetirementIncome: 25000,
    currentSavings: 750000,
    requiredSavings: 5000000,
    currentProgress: 15, // percentage
    scenarios: [
      {
        name: "Conservador",
        monthlySavings: 8000,
        expectedReturn: 0.08,
        projectedSavings: 3800000,
        sufficient: false
      },
      {
        name: "Moderado",
        monthlySavings: 12000,
        expectedReturn: 0.10,
        projectedSavings: 5100000,
        sufficient: true
      },
      {
        name: "Arrojado",
        monthlySavings: 15000,
        expectedReturn: 0.12,
        projectedSavings: 6400000,
        sufficient: true
      }
    ],
    recommendations: [
      {
        title: "Aumentar aportes mensais",
        description: "Elevar os aportes para PGBL/VGBL para R$ 12.000 mensais",
        impact: "Alto",
        priority: "Alta"
      },
      {
        title: "Ajustar carteira de investimentos",
        description: "Alocar 40% em Renda Variável, 30% em Fundos Imobiliários, 30% em Renda Fixa",
        impact: "Médio",
        priority: "Média"
      },
      {
        title: "Utilizar PGBL para eficiência fiscal",
        description: "Aumentar contribuições para PGBL para reduzir base de IR",
        impact: "Médio",
        priority: "Alta"
      }
    ]
  };
  
  // Helper function to get status color
  const getStatusColor = (sufficient: boolean) => {
    return sufficient ? "success" : "warning";
  };
  
  // Helper function to get priority status
  const getPriorityStatus = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "alta":
        return "danger";
      case "média":
        return "warning";
      default:
        return "success";
    }
  };
  
  // Helper function to get impact status
  const getImpactStatus = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "alto":
        return "danger";
      case "médio":
        return "warning";
      default:
        return "success";
    }
  };
  
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div 
          ref={headerRef as React.RefObject<HTMLDivElement>} 
          className="mb-12 text-center animate-on-scroll"
        >
          <div className="inline-block">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-accent/10 p-3 rounded-full">
                <PiggyBank size={28} className="text-accent" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-3">Planejamento para Aposentadoria</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estratégias e projeções para garantir sua independência financeira e o padrão de vida desejado na aposentadoria.
            </p>
          </div>
        </div>
        
        {/* Retirement Summary */}
        <div 
          ref={summaryCardRef as React.RefObject<HTMLDivElement>} 
          className="mb-10 animate-on-scroll delay-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center">
                <BarChart3 size={22} className="mr-2 text-accent" />
                Resumo da Aposentadoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Situação Atual</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Idade atual:</span>
                      <span className="font-medium">{retirementData.currentAge} anos</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Idade desejada para aposentadoria:</span>
                      <span className="font-medium">{retirementData.retirementAge} anos</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Tempo até a aposentadoria:</span>
                      <span className="font-medium">{retirementData.yearsToRetirement} anos</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Renda mensal atual:</span>
                      <span className="font-medium">{formatCurrency(retirementData.currentMonthlyIncome)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Renda desejada na aposentadoria:</span>
                      <span className="font-medium">{formatCurrency(retirementData.desiredRetirementIncome)}</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Projeções</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Patrimônio atual para aposentadoria:</span>
                      <span className="font-medium">{formatCurrency(retirementData.currentSavings)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Patrimônio necessário (estimado):</span>
                      <span className="font-medium">{formatCurrency(retirementData.requiredSavings)}</span>
                    </li>
                    <li className="mt-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Progresso atual:</span>
                        <span className="font-medium">{retirementData.currentProgress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-4">
                        <div 
                          className="bg-accent h-4 rounded-full"
                          style={{ width: `${retirementData.currentProgress}%` }}
                        ></div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Retirement Scenarios */}
        <div 
          ref={scenariosCardRef as React.RefObject<HTMLDivElement>} 
          className="mb-10 animate-on-scroll delay-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center">
                <TrendingUp size={22} className="mr-2 text-accent" />
                Cenários de Acumulação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {retirementData.scenarios.map((scenario, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-medium">{scenario.name}</h3>
                      <StatusChip 
                        status={getStatusColor(scenario.sufficient)}
                        label={scenario.sufficient ? "Suficiente" : "Insuficiente"}
                      />
                    </div>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Aporte mensal:</span>
                        <span className="font-medium">{formatCurrency(scenario.monthlySavings)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Retorno esperado:</span>
                        <span className="font-medium">{(scenario.expectedReturn * 100).toFixed(1)}% a.a.</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Patrimônio projetado:</span>
                        <span className="font-medium">{formatCurrency(scenario.projectedSavings)}</span>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recommendations */}
        <div 
          ref={recommendationsCardRef as React.RefObject<HTMLDivElement>} 
          className="animate-on-scroll delay-3"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold flex items-center">
                <CheckCircle size={22} className="mr-2 text-accent" />
                Recomendações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-1 gap-6">
                {retirementData.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start border-b border-border last:border-0 pb-4 last:pb-0">
                    <div className="bg-accent/10 p-2 rounded-full mt-1 mr-4">
                      <AlertTriangle size={16} className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium mb-1">{recommendation.title}</h3>
                        <div className="flex space-x-2">
                          <StatusChip 
                            status={getPriorityStatus(recommendation.priority)}
                            label={`Prioridade: ${recommendation.priority}`}
                          />
                          <StatusChip 
                            status={getImpactStatus(recommendation.impact)}
                            label={`Impacto: ${recommendation.impact}`}
                          />
                        </div>
                      </div>
                      <p className="text-muted-foreground">{recommendation.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RetirementPlanning;
