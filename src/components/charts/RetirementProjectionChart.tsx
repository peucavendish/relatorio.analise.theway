import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { formatCurrency } from '@/utils/formatCurrency';
import { ChartContainer } from '@/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

// Interface para as propriedades do componente
interface RetirementProjectionChartProps {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentPortfolio: number;
  monthlyContribution: number;
  targetAmount: number;
  safeWithdrawalRate: number;
  inflationRate: number;
  scenarios?: Array<{
    idade: number;
    aporteMensal: number;
    capitalNecessario: number;
  }>;
}

// Função para calcular o fluxo de capital baseado no script fornecido
const calculateRetirementProjection = (
  idade_atual: number,
  idade_para_aposentar: number,
  expectativa_de_vida: number,
  capitalDisponivelHoje: number,
  capital_disponivel_mensal: number,
  saque_mensal_desejado: number,
  rentabilidade_real_liquida_acumulacao: number = 0.03,
  rentabilidade_real_liquida_consumo: number = 0.02
) => {
  // Taxa mensal equivalente
  const taxa_mensal_real = Math.pow(1 + rentabilidade_real_liquida_acumulacao, 1/12) - 1;
  
  // Cálculos básicos
  const numero_meses_consumo_aposentadoria = (expectativa_de_vida - idade_para_aposentar) * 12;
  
  // Capital Necessário usando a fórmula do script
  const capitalNecessario = (saque_mensal_desejado * (1 - Math.pow(1 + taxa_mensal_real, -numero_meses_consumo_aposentadoria)) / taxa_mensal_real);
  
  // Cálculo para o cenário com aposentadoria 5 anos antes
  const idadeAposentadoria1 = idade_para_aposentar - 5;
  const meses_consumo_1 = (expectativa_de_vida - idadeAposentadoria1) * 12;
  const capitalNecessario1 = (saque_mensal_desejado * (1 - Math.pow(1 + taxa_mensal_real, -meses_consumo_1)) / taxa_mensal_real);
  
  // Cálculo para o cenário com aposentadoria no prazo desejado
  const idadeAposentadoria2 = idade_para_aposentar;
  const capitalNecessario2 = capitalNecessario;
  
  // Cálculo para o cenário com aposentadoria 5 anos depois
  const idadeAposentadoria3 = idade_para_aposentar + 5;
  const meses_consumo_3 = (expectativa_de_vida - idadeAposentadoria3) * 12;
  const capitalNecessario3 = (saque_mensal_desejado * (1 - Math.pow(1 + taxa_mensal_real, -meses_consumo_3)) / taxa_mensal_real);
  
  // Função para calcular a duração do capital
  const calcularDuracaoCapital = (idade_aposentadoria: number, capital: number, renda_mensal: number) => {
    // Calcula quantos anos o capital dura baseado no valor do capital e no valor anual de retirada
    const retirada_anual = renda_mensal * 12;
    const duracao_anos = Math.round(capital / retirada_anual);
    return idade_aposentadoria + duracao_anos;
  }
  
  // Calcular duração para cada cenário
  const duracaoCapital1 = calcularDuracaoCapital(idadeAposentadoria1, capitalNecessario1, saque_mensal_desejado);
  const duracaoCapital2 = calcularDuracaoCapital(idadeAposentadoria2, capitalNecessario2, saque_mensal_desejado);
  const duracaoCapital3 = calcularDuracaoCapital(idadeAposentadoria3, capitalNecessario3, saque_mensal_desejado);
    
  // Função PMT (equivalente ao PGTO do Excel)
  function PMT(taxa: number, periodos: number, vp: number, vf: number = 0, tipo: number = 0) {
    if (taxa === 0) return -(vp + vf) / periodos;
    const x = Math.pow(1 + taxa, periodos);
    return -(vp * x + vf) * taxa / ((x - 1) * (1 + taxa * tipo));
  }
  
  // Cálculo dos aportes mensais necessários para cada cenário
  // Cenário 1 (5 anos antes)
  const meses_acumulacao_1 = (idadeAposentadoria1 - idade_atual) * 12;
  const aporteMensal1 = meses_acumulacao_1 > 0 ? 
    Math.abs(PMT(taxa_mensal_real, meses_acumulacao_1, -capitalDisponivelHoje, capitalNecessario1)) : 0;
  
  // Cenário 2 (no prazo desejado)
  const meses_acumulacao_2 = (idadeAposentadoria2 - idade_atual) * 12;
  const aporteMensal2 = meses_acumulacao_2 > 0 ? 
    Math.abs(PMT(taxa_mensal_real, meses_acumulacao_2, -capitalDisponivelHoje, capitalNecessario2)) : 0;
  
  // Cenário 3 (5 anos depois)
  const meses_acumulacao_3 = (idadeAposentadoria3 - idade_atual) * 12;
  const aporteMensal3 = meses_acumulacao_3 > 0 ? 
    Math.abs(PMT(taxa_mensal_real, meses_acumulacao_3, -capitalDisponivelHoje, capitalNecessario3)) : 0;

  // Cálculo do fluxo de capital 
  const fluxoCapital = [];
  const ano_final = expectativa_de_vida;
  
  // Gerar dados de projeção para todos os anos
  for (let ano = 0, idade = idade_atual; idade <= ano_final; ano++, idade++) {
    // Calcular valor para cada cenário
    let capital1, capital2, capital3;
    
    // Iniciar com o valor atual
    if (ano === 0) {
      capital1 = capital2 = capital3 = capitalDisponivelHoje;
    } else {
      // Obter valores do ano anterior
      const prevYear = fluxoCapital[ano - 1];
      capital1 = prevYear.capital1;
      capital2 = prevYear.capital2;
      capital3 = prevYear.capital3;
      
      // Fase de acumulação: incremento com aportes e rendimentos
      if (idade < idadeAposentadoria1) {
        // Todos os cenários estão em fase de acumulação
        capital1 = capital1 * (1 + rentabilidade_real_liquida_acumulacao) + (capital_disponivel_mensal * 12);
        capital2 = capital2 * (1 + rentabilidade_real_liquida_acumulacao) + (capital_disponivel_mensal * 12);
        capital3 = capital3 * (1 + rentabilidade_real_liquida_acumulacao) + (capital_disponivel_mensal * 12);
      } else if (idade < idadeAposentadoria2) {
        // Cenário 1 está em consumo, 2 e 3 em acumulação
        capital1 = capital1 * (1 + rentabilidade_real_liquida_consumo) - (saque_mensal_desejado * 12);
        capital2 = capital2 * (1 + rentabilidade_real_liquida_acumulacao) + (capital_disponivel_mensal * 12);
        capital3 = capital3 * (1 + rentabilidade_real_liquida_acumulacao) + (capital_disponivel_mensal * 12);
      } else if (idade < idadeAposentadoria3) {
        // Cenários 1 e 2 estão em consumo, 3 em acumulação
        capital1 = capital1 * (1 + rentabilidade_real_liquida_consumo) - (saque_mensal_desejado * 12);
        capital2 = capital2 * (1 + rentabilidade_real_liquida_consumo) - (saque_mensal_desejado * 12);
        capital3 = capital3 * (1 + rentabilidade_real_liquida_acumulacao) + (capital_disponivel_mensal * 12);
      } else {
        // Todos os cenários estão em consumo
        capital1 = capital1 * (1 + rentabilidade_real_liquida_consumo) - (saque_mensal_desejado * 12);
        capital2 = capital2 * (1 + rentabilidade_real_liquida_consumo) - (saque_mensal_desejado * 12);
        capital3 = capital3 * (1 + rentabilidade_real_liquida_consumo) - (saque_mensal_desejado * 12);
      }
      
      // Garantir que capital não fique negativo
      capital1 = Math.max(0, capital1);
      capital2 = Math.max(0, capital2);
      capital3 = Math.max(0, capital3);
    }
    
    // Adicionar ao fluxo de capital
    fluxoCapital.push({
      age: idade,
      capital1: Math.round(capital1),
      capital2: Math.round(capital2),
      capital3: Math.round(capital3)
    });
  }
  
  return {
    fluxoCapital,
    idadeAposentadoria1,
    idadeAposentadoria2,
    idadeAposentadoria3,
    capitalNecessario1,
    capitalNecessario2,
    capitalNecessario3,
    aporteMensal1,
    aporteMensal2,
    aporteMensal3,
    duracaoCapital1,
    duracaoCapital2,
    duracaoCapital3
  };
};

const chartConfig = {
  capital1: {
    label: "Aposentadoria 5 anos antes",
    theme: {
      light: "#0EA5E9",
      dark: "#0EA5E9",
    }
  },
  capital2: {
    label: "Aposentadoria no prazo desejado",
    theme: {
      light: "#7EC866",
      dark: "#7EC866",
    }
  },
  capital3: {
    label: "Aposentadoria 5 anos depois",
    theme: {
      light: "#000000",
      dark: "#000000",
    }
  },
};

const RetirementProjectionChart: React.FC<RetirementProjectionChartProps> = ({
  currentAge,
  retirementAge,
  lifeExpectancy,
  currentPortfolio,
  monthlyContribution,
  targetAmount,
  safeWithdrawalRate,
  inflationRate
}) => {
  const [selectedView, setSelectedView] = useState<'completo' | '10anos' | '20anos' | '30anos'>('completo');
  const [taxaRetorno, setTaxaRetorno] = useState<number>(0.03); // 3% real ao ano por default
  const [rendaMensal, setRendaMensal] = useState<number>(targetAmount / 12);
  
  // Calcular projeção baseada nas propriedades e nos estados
  const projection = React.useMemo(() => {
    return calculateRetirementProjection(
      currentAge,
      retirementAge,
      lifeExpectancy,
      currentPortfolio,
      monthlyContribution,
      rendaMensal,
      taxaRetorno,
      taxaRetorno * 0.7 // Taxa reduzida para fase de consumo
    );
  }, [currentAge, retirementAge, lifeExpectancy, currentPortfolio, monthlyContribution, rendaMensal, taxaRetorno]);
  
  const filteredData = React.useMemo(() => {
    if (selectedView === '10anos') {
      return projection.fluxoCapital.filter(item => item.age <= currentAge + 10);
    } else if (selectedView === '20anos') {
      return projection.fluxoCapital.filter(item => item.age <= currentAge + 20);
    } else if (selectedView === '30anos') {
      return projection.fluxoCapital.filter(item => item.age <= currentAge + 30);
    }
    return projection.fluxoCapital;
  }, [projection.fluxoCapital, selectedView, currentAge]);
  
  const formatYAxis = (value: number) => {
    if (value === 0) return 'R$ 0';
    if (value >= 1000000) return `R$ ${Math.floor(value / 1000000)}M`;
    return formatCurrency(value);
  };
  
  return (
    <Card className="w-full h-full border-border/80 shadow-sm">
      <CardHeader className="px-6 pb-0">
        <div className="flex flex-col w-full gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
            <div>
              <CardTitle className="text-xl font-semibold">Projeção Patrimonial</CardTitle>
              <CardDescription className="mt-1">
                Evolução do patrimônio em diferentes cenários ao longo do tempo
              </CardDescription>
            </div>
            <ToggleGroup 
              type="single" 
              value={selectedView}
              onValueChange={(value) => value && setSelectedView(value as 'completo' | '10anos' | '20anos' | '30anos')}
              className="bg-muted/30 p-1 rounded-lg"
            >
              <ToggleGroupItem 
                value="completo" 
                size="sm"
                className="text-xs px-3 py-1.5 rounded bg-transparent hover:bg-muted/50"
              >
                Completo
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="10anos" 
                size="sm"
                className="text-xs px-3 py-1.5 rounded bg-transparent hover:bg-muted/50"
              >
                10 Anos
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="20anos" 
                size="sm"
                className="text-xs px-3 py-1.5 rounded bg-transparent hover:bg-muted/50"
              >
                20 Anos
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="30anos" 
                size="sm"
                className="text-xs px-3 py-1.5 rounded bg-transparent hover:bg-muted/50"
              >
                30 Anos
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxaRetorno">Taxa de Retorno Real (% a.a.)</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="taxaRetorno"
                  value={[taxaRetorno * 100]}
                  min={1}
                  max={7}
                  step={0.1}
                  onValueChange={(value) => setTaxaRetorno(value[0] / 100)}
                  className="flex-1"
                />
                <div className="w-12 text-center text-sm font-medium">{(taxaRetorno * 100).toFixed(1)}%</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rendaMensal">Renda Mensal Desejada</Label>
              <Input
                id="rendaMensal"
                type="number"
                value={rendaMensal}
                onChange={(e) => setRendaMensal(parseFloat(e.target.value) || 0)}
                className="h-9"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-4">
        <div className="h-[320px] mb-6">
          <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 25, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="age" 
                label={{ value: 'Idade', position: 'insideBottom', offset: -15, fill: '#6b7280', fontSize: 12 }} 
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={{ stroke: '#9CA3AF' }}
                axisLine={{ stroke: '#d1d5db' }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                tickFormatter={formatYAxis} 
                domain={[0, 'auto']}
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={{ stroke: '#9CA3AF' }}
                axisLine={{ stroke: '#d1d5db' }}
                label={{ 
                  value: 'Patrimônio', 
                  angle: -90, 
                  position: 'insideLeft', 
                  offset: -5, 
                  fill: '#6b7280', 
                  fontSize: 12 
                }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card/95 backdrop-blur-sm border border-border/80 px-3 py-2 rounded-md shadow-lg">
                        <p className="font-medium text-xs mb-1">{`Idade: ${payload[0]?.payload.age} anos`}</p>
                        <div className="space-y-1">
                          {payload.map((entry) => (
                            <div key={entry.name} className="flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-1.5">
                                <div 
                                  className="w-2.5 h-2.5 rounded-[2px]" 
                                  style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-muted-foreground">{entry.name}:</span>
                              </div>
                              <span className="font-medium tabular-nums">
                                {formatCurrency(entry.value as number)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
                wrapperStyle={{ outline: 'none' }}
              />
              
              {/* Linhas de referência para as idades de aposentadoria */}
              <ReferenceLine 
                x={projection.idadeAposentadoria1} 
                stroke="#0EA5E9" 
                strokeDasharray="3 3" 
              />
              
              <ReferenceLine 
                x={projection.idadeAposentadoria2} 
                stroke="#7EC866" 
                strokeDasharray="3 3" 
              />
              
              <ReferenceLine 
                x={projection.idadeAposentadoria3} 
                stroke="#000000" 
                strokeDasharray="3 3" 
              />
              
              <Line 
                type="monotone" 
                dataKey="capital1" 
                name="Aposentadoria 5 anos antes" 
                stroke="#0EA5E9" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 5, strokeWidth: 1 }}
              />
              <Line 
                type="monotone" 
                dataKey="capital2" 
                name="Aposentadoria no prazo desejado" 
                stroke="#7EC866" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 5, strokeWidth: 1 }}
              />
              <Line 
                type="monotone" 
                dataKey="capital3" 
                name="Aposentadoria 5 anos depois" 
                stroke="#000000" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 5, strokeWidth: 1 }}
              />
              
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ 
                  paddingTop: 15,
                  fontSize: 11,
                  lineHeight: '1.2em'
                }}
                iconType="line"
                iconSize={10}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        </div>
        
        {/* Tabela de informações sobre cenários de aposentadoria */}
        <div className="mt-6 border border-border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr>
                <th className="py-2 px-3 text-left font-medium">Cenário</th>
                <th className="py-2 px-3 text-right font-medium">Aporte Mensal</th>
                <th className="py-2 px-3 text-right font-medium">Capital Necessário</th>
                <th className="py-2 px-3 text-right font-medium">Retirada Mensal</th>
                <th className="py-2 px-3 text-right font-medium">Duração Estimada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="bg-accent/5">
                <td className="py-2 px-3 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#0EA5E9] mr-2"></div>
                  <span>5 anos antes ({projection.idadeAposentadoria1} anos)</span>
                </td>
                <td className="py-2 px-3 text-right">{projection.aporteMensal1 <= 0 ? 'R$ 0' : formatCurrency(projection.aporteMensal1)}</td>
                <td className="py-2 px-3 text-right">{formatCurrency(projection.capitalNecessario1)}</td>
                <td className="py-2 px-3 text-right">{formatCurrency(rendaMensal)}</td>
                <td className="py-2 px-3 text-right">Até {projection.duracaoCapital1} anos de idade</td>
              </tr>
              <tr>
                <td className="py-2 px-3 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#7EC866] mr-2"></div>
                  <span>No prazo desejado ({projection.idadeAposentadoria2} anos)</span>
                </td>
                <td className="py-2 px-3 text-right">{projection.aporteMensal2 <= 0 ? 'R$ 0' : formatCurrency(projection.aporteMensal2)}</td>
                <td className="py-2 px-3 text-right">{formatCurrency(projection.capitalNecessario2)}</td>
                <td className="py-2 px-3 text-right">{formatCurrency(rendaMensal)}</td>
                <td className="py-2 px-3 text-right">Até {projection.duracaoCapital2} anos de idade</td>
              </tr>
              <tr className="bg-muted/10">
                <td className="py-2 px-3 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-black mr-2"></div>
                  <span>5 anos depois ({projection.idadeAposentadoria3} anos)</span>
                </td>
                <td className="py-2 px-3 text-right">{projection.aporteMensal3 <= 0 ? 'R$ 0' : formatCurrency(projection.aporteMensal3)}</td>
                <td className="py-2 px-3 text-right">{formatCurrency(projection.capitalNecessario3)}</td>
                <td className="py-2 px-3 text-right">{formatCurrency(rendaMensal)}</td>
                <td className="py-2 px-3 text-right">Até {projection.duracaoCapital3} anos de idade</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RetirementProjectionChart;
