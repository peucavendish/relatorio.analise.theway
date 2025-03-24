
import React, { useState } from 'react';
import { PiggyBank, Wallet, CalendarClock, TrendingUp, Calculator } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { Card } from "@/components/ui/card";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import StatusChip from '@/components/ui/StatusChip';
import ProgressBar from '@/components/ui/ProgressBar';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface RetirementData {
  currentAge: number;
  targetRetirementAge: number;
  monthlyTargetIncome: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedAnnualReturn: number;
  inflationRate: number;
  lifeExpectancy: number;
  scenarios: RetirementScenario[];
}

interface RetirementScenario {
  name: string;
  monthlyContribution: number;
  expectedReturn: number;
  inflationRate: number;
  targetAge: number;
  projectedSavings: number;
  projectedMonthlyIncome: number;
  capitalExhaustion: number;
  savingsProgress: number;
  status: 'success' | 'warning' | 'danger' | 'info';
}

// Mock retirement data
const retirementData: RetirementData = {
  currentAge: 43,
  targetRetirementAge: 60,
  monthlyTargetIncome: 25000,
  currentSavings: 750000,
  monthlyContribution: 5000,
  expectedAnnualReturn: 8,
  inflationRate: 4,
  lifeExpectancy: 90,
  scenarios: [
    {
      name: "Conservador",
      monthlyContribution: 5000,
      expectedReturn: 6,
      inflationRate: 4,
      targetAge: 60,
      projectedSavings: 3200000,
      projectedMonthlyIncome: 18000,
      capitalExhaustion: 82,
      savingsProgress: 23,
      status: 'warning'
    },
    {
      name: "Base",
      monthlyContribution: 7000,
      expectedReturn: 8,
      inflationRate: 4,
      targetAge: 60,
      projectedSavings: 5100000,
      projectedMonthlyIncome: 28000,
      capitalExhaustion: 88,
      savingsProgress: 38,
      status: 'success'
    },
    {
      name: "Agressivo",
      monthlyContribution: 10000,
      expectedReturn: 10,
      inflationRate: 4,
      targetAge: 58,
      projectedSavings: 6800000,
      projectedMonthlyIncome: 36000,
      capitalExhaustion: 90,
      savingsProgress: 58,
      status: 'success'
    }
  ]
};

// Calculate years to retirement
const yearsToRetirement = retirementData.targetRetirementAge - retirementData.currentAge;

const RetirementPlanning: React.FC = () => {
  // State for the active scenario
  const [activeScenario, setActiveScenario] = useState<string>("Base");
  const [viewMode, setViewMode] = useState<string>("overview");
  
  // Get active scenario data
  const currentScenario = retirementData.scenarios.find(
    (scenario) => scenario.name === activeScenario
  ) || retirementData.scenarios[1]; // Default to Base scenario
  
  // Animation refs
  const headerRef = useScrollAnimation();
  const summaryRef = useScrollAnimation({ threshold: 0.2 });
  const scenariosRef = useScrollAnimation({ threshold: 0.2 });
  const projectionRef = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="space-y-10">
        {/* Section Header */}
        <div ref={headerRef} className="animate-on-scroll space-y-3">
          <h2 className="section-title flex items-center">
            <PiggyBank className="mr-3 text-accent" />
            Planejamento para Aposentadoria
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Uma análise detalhada do seu caminho para a aposentadoria, com projeções baseadas em diferentes cenários e recomendações personalizadas para alcançar seus objetivos.
          </p>
        </div>

        {/* Retirement Summary */}
        <div ref={summaryRef} className="animate-on-scroll grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center p-2">
                <div className="bg-accent/10 p-4 rounded-full mb-4">
                  <CalendarClock className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Idade Atual</h3>
                <p className="text-3xl font-bold">{retirementData.currentAge} anos</p>
                <p className="text-muted-foreground mt-2">Meta: {retirementData.targetRetirementAge} anos</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center p-2">
                <div className="bg-accent/10 p-4 rounded-full mb-4">
                  <Wallet className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Poupança Atual</h3>
                <p className="text-3xl font-bold">{formatCurrency(retirementData.currentSavings)}</p>
                <p className="text-muted-foreground mt-2">
                  Contribuição: {formatCurrency(retirementData.monthlyContribution)}/mês
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center p-2">
                <div className="bg-accent/10 p-4 rounded-full mb-4">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Anos até a Meta</h3>
                <p className="text-3xl font-bold">{yearsToRetirement} anos</p>
                <p className="text-muted-foreground mt-2">
                  <StatusChip 
                    status={yearsToRetirement <= 10 ? "warning" : "info"} 
                    label={yearsToRetirement <= 10 ? "Médio Prazo" : "Longo Prazo"}
                    className="mt-1"
                  />
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center p-2">
                <div className="bg-accent/10 p-4 rounded-full mb-4">
                  <Calculator className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Renda Desejada</h3>
                <p className="text-3xl font-bold">{formatCurrency(retirementData.monthlyTargetIncome)}</p>
                <p className="text-muted-foreground mt-2">Renda mensal projetada</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scenario Selection & Projection */}
        <div ref={scenariosRef} className="animate-on-scroll">
          <Card className="border-accent/30">
            <CardHeader>
              <CardTitle>Cenários de Aposentadoria</CardTitle>
              <CardDescription>
                Selecione um cenário para visualizar as projeções correspondentes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ToggleGroup type="single" value={activeScenario} onValueChange={(value) => value && setActiveScenario(value)} className="justify-center mb-8">
                {retirementData.scenarios.map((scenario) => (
                  <ToggleGroupItem key={scenario.name} value={scenario.name} className="px-6 py-3">
                    <span className="mr-2">{scenario.name}</span>
                    <StatusChip 
                      status={scenario.status} 
                      label={scenario.status === 'success' ? 'Ótimo' : scenario.status === 'warning' ? 'Atenção' : 'Revisão'}
                      className="ml-2"
                    />
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-medium mb-4">Detalhes do Cenário</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Contribuição Mensal</TableCell>
                        <TableCell className="text-right">{formatCurrency(currentScenario.monthlyContribution)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Retorno Esperado</TableCell>
                        <TableCell className="text-right">{currentScenario.expectedReturn}% a.a.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Inflação Projetada</TableCell>
                        <TableCell className="text-right">{currentScenario.inflationRate}% a.a.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Idade para Aposentadoria</TableCell>
                        <TableCell className="text-right">{currentScenario.targetAge} anos</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4">Projeções</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Capital Projetado</TableCell>
                        <TableCell className="text-right font-bold text-lg">
                          {formatCurrency(currentScenario.projectedSavings)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Renda Mensal Projetada</TableCell>
                        <TableCell className="text-right font-bold text-lg">
                          {formatCurrency(currentScenario.projectedMonthlyIncome)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Exaustão do Capital</TableCell>
                        <TableCell className="text-right">Aos {currentScenario.capitalExhaustion} anos</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Suficiência da Renda</TableCell>
                        <TableCell className="text-right">
                          <StatusChip 
                            status={currentScenario.projectedMonthlyIncome >= retirementData.monthlyTargetIncome ? "success" : "warning"} 
                            label={currentScenario.projectedMonthlyIncome >= retirementData.monthlyTargetIncome ? "Adequada" : "Abaixo da Meta"}
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch">
              <div className="mb-2 space-y-2 w-full">
                <div className="flex justify-between text-sm">
                  <span>Progresso Para a Meta</span>
                  <span>{currentScenario.savingsProgress}%</span>
                </div>
                <ProgressBar 
                  value={currentScenario.savingsProgress} 
                  max={100} 
                  size="lg"
                  color={currentScenario.status}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Baseado na sua poupança atual, contribuições mensais e retorno esperado.
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* Recommendations */}
        <div ref={projectionRef} className="animate-on-scroll">
          <Card>
            <CardHeader>
              <CardTitle>Recomendações para Otimização</CardTitle>
              <CardDescription>
                Sugestões para melhorar suas projeções de aposentadoria.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 border rounded-lg border-financial-success/30 bg-financial-success/5">
                  <div className="mt-1 bg-financial-success/20 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-financial-success" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Aumente sua contribuição mensal</h4>
                    <p className="text-muted-foreground mt-1">
                      Aumentar sua contribuição mensal em R$ 2.000 pode melhorar significativamente suas projeções de aposentadoria, 
                      resultando em um adicional de aproximadamente R$ 7.000 em renda mensal.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg border-financial-info/30 bg-financial-info/5">
                  <div className="mt-1 bg-financial-info/20 p-2 rounded-full">
                    <PiggyBank className="h-5 w-5 text-financial-info" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Diversifique seus investimentos</h4>
                    <p className="text-muted-foreground mt-1">
                      Considere uma alocação mais diversificada para potencialmente aumentar seu retorno anual. 
                      Um aumento de 1% no retorno pode resultar em um capital adicional de aproximadamente R$ 800.000 ao se aposentar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border rounded-lg border-financial-warning/30 bg-financial-warning/5">
                  <div className="mt-1 bg-financial-warning/20 p-2 rounded-full">
                    <Wallet className="h-5 w-5 text-financial-warning" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Revise sua meta de renda</h4>
                    <p className="text-muted-foreground mt-1">
                      Sua meta de renda atual é elevada em comparação com sua poupança. Considere revisar suas expectativas
                      de estilo de vida na aposentadoria ou aumente significativamente suas contribuições.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RetirementPlanning;
