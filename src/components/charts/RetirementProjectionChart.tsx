import React, { useState, useEffect } from 'react';
import { 
  AreaChart,
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  Area
} from 'recharts';
import { formatCurrency } from '@/utils/formatCurrency';
import { ChartContainer } from '@/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

// Custom currency input component
const CurrencyInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
  className?: string;
  id?: string;
}> = ({ value, onChange, className, id }) => {
  // Format the value to display with currency
  const [displayValue, setDisplayValue] = useState<string>(() => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  });

  // Handle input changes and format the value
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the raw input value
    const inputVal = e.target.value;
    
    // Remove non-numeric characters except for comma and period
    const numericValue = inputVal.replace(/[^0-9,.]/g, '');
    
    // Update the display value with R$ prefix
    setDisplayValue(`R$ ${numericValue}`);
    
    // Convert to a number for the actual value (replace comma with period for parseFloat)
    const parsedValue = parseFloat(numericValue.replace(/\./g, '').replace(',', '.')) || 0;
    onChange(parsedValue);
  };

  // Update display value when the actual value changes externally
  useEffect(() => {
    setDisplayValue(new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value));
  }, [value]);

  return (
    <Input
      id={id}
      value={displayValue}
      onChange={handleInputChange}
      className={className}
    />
  );
};

// Interface para as propriedades do componente
interface RetirementProjectionChartProps {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  currentPortfolio: number;
  monthlyContribution: number;
  rendaMensalDesejada: number;
  safeWithdrawalRate: number;
  inflationRate: number;
  scenarios?: Array<{
    idade: number;
    aporteMensal: number;
    capitalNecessario: number;
  }>;
}

// Interface para os resultados de duração do capital
interface DuracaoCapital {
  idadeFinal: number;
  duracaoAnos: number;
}

// Função para calcular o fluxo de capital baseado no script fornecido
const calculateRetirementProjection = (
  idade_atual: number,
  idade_para_aposentar: number,
  expectativa_de_vida: number,  // Recebe como parâmetro
  capitalDisponivelHoje: number,
  capital_disponivel_mensal: number,
  saque_mensal_desejado: number,
  rentabilidade_real_liquida_acumulacao: number = 0.04,
  rentabilidade_real_liquida_consumo: number = 0.032
) => {
  // Taxa mensal equivalente
  const taxa_mensal_real = Math.pow(1 + rentabilidade_real_liquida_acumulacao, 1/12) - 1;
  
  // Cenários de aposentadoria
  const idadeAposentadoria1 = idade_para_aposentar - 5;
  const idadeAposentadoria2 = idade_para_aposentar;
  const idadeAposentadoria3 = idade_para_aposentar + 5;
  
  // Função para calcular o capital necessário
  const calculaCapitalNecessario = (idadeAposentadoria: number) => {
    // Número de meses na fase de consumo
    const meses_consumo = (expectativa_de_vida - idadeAposentadoria) * 12;
    
    // Capital necessário (VP de uma série de pagamentos) - Fator de VP de uma série * PMT
    return (saque_mensal_desejado * (1 - Math.pow(1 + taxa_mensal_real, -meses_consumo)) / taxa_mensal_real);
  };
  
  // Cálculo do capital necessário para cada cenário
  const capitalNecessario1 = calculaCapitalNecessario(idadeAposentadoria1);
  const capitalNecessario2 = calculaCapitalNecessario(idadeAposentadoria2);
  const capitalNecessario3 = calculaCapitalNecessario(idadeAposentadoria3);
  
  // Função PMT para calcular o aporte mensal/anual necessário
  function PMT(taxa: number, periodos: number, vp: number, vf: number = 0, tipo: number = 0) {
    if (taxa === 0) return -(vp + vf) / periodos;
    const x = Math.pow(1 + taxa, periodos);
    return -(vp * x + vf) * taxa / ((x - 1) * (1 + taxa * tipo));
  }
  
  // Cálculo dos aportes mensais necessários para cada cenário
  const calculaAporteMensal = (idadeAposentadoria: number, capitalNecessario: number) => {
    // Quantidade de aportes
    const meses_acumulacao = (idadeAposentadoria - idade_atual) * 12;
    
    if (meses_acumulacao <= 0) return 0;
    
    // Calcula o aporte mensal usando a função PMT
    return Math.abs(PMT(
      taxa_mensal_real,
      meses_acumulacao,
      -capitalDisponivelHoje,
      capitalNecessario
    ));
  };
  
  // Cálculo dos aportes mensais para cada cenário
  const aporteMensal1 = calculaAporteMensal(idadeAposentadoria1, capitalNecessario1);
  const aporteMensal2 = calculaAporteMensal(idadeAposentadoria2, capitalNecessario2);
  const aporteMensal3 = calculaAporteMensal(idadeAposentadoria3, capitalNecessario3);
  
  // Função para calcular a duração do capital
  const calcularDuracaoCapital = (idadeAposentadoria: number, capitalInicial: number): DuracaoCapital => {
    // Saque anual
    const saqueAnual = saque_mensal_desejado * 12;
    
    // Se não houver saque, o capital dura para sempre
    if (saqueAnual <= 0) {
      return {
        idadeFinal: expectativa_de_vida,
        duracaoAnos: expectativa_de_vida - idadeAposentadoria
      };
    }
    
    // Simulação ano a ano para determinar quando o capital acaba
    let capital = capitalInicial;
    let idadeAtual = idadeAposentadoria;
    
    while (capital > 0 && idadeAtual < expectativa_de_vida) {
      // Rendimento anual
      const rendimento = capital * rentabilidade_real_liquida_consumo;
      
      // Atualiza o capital
      capital = capital + rendimento - saqueAnual;
      
      // Avança para o próximo ano
      idadeAtual++;
      
      // Se o capital ficar negativo, considera esgotado no ano anterior
      if (capital <= 0) {
        return {
          idadeFinal: idadeAtual - 1,
          duracaoAnos: (idadeAtual - 1) - idadeAposentadoria
        };
      }
    }
    
    // Se chegou até aqui, o capital durou até a expectativa de vida
    return {
      idadeFinal: expectativa_de_vida,
      duracaoAnos: expectativa_de_vida - idadeAposentadoria
    };
  };
  
  // Simular o fluxo de capital de cada cenário
  const simularFluxoCapital = (idadeAposentadoria: number, aporteMensal: number) => {
    const fluxo = [];
    let capital = capitalDisponivelHoje;
    let idade = idade_atual;
    
    // Fase de acumulação
    while (idade < idadeAposentadoria) {
      // Registra o capital no início do ano (antes de rendimentos e aportes)
      fluxo.push({
        idade,
        capital
      });
      
      // Rendimento do ano
      const rendimento = capital * rentabilidade_real_liquida_acumulacao;
      
      // Aporte anual
      const aporteAnual = aporteMensal * 12;
      
      // Capital no final do ano
      capital = capital + rendimento + aporteAnual;
      idade++;
    }
    
    // Fase de consumo
    const saqueAnual = saque_mensal_desejado * 12;
    let idadeEsgotamento = null;
    
    while (idade <= expectativa_de_vida) {
      // Registra o capital atual
      fluxo.push({
        idade,
        capital: capital > 0 ? capital : 0
      });
      
      // Se o capital já acabou, apenas continua com zero
      if (capital <= 0) {
        if (idadeEsgotamento === null) {
          idadeEsgotamento = idade;
        }
        idade++;
        continue;
      }
      
      // Rendimento do ano
      const rendimento = capital * rentabilidade_real_liquida_consumo;
      
      // Atualiza o capital
      capital = capital + rendimento - saqueAnual;
      idade++;
    }
    
    return {
      fluxo,
      idadeEsgotamento
    };
  };
  
  // Gera o fluxo de capital para cada cenário
  const resultado1 = simularFluxoCapital(idadeAposentadoria1, aporteMensal1);
  const resultado2 = simularFluxoCapital(idadeAposentadoria2, aporteMensal2);
  const resultado3 = simularFluxoCapital(idadeAposentadoria3, aporteMensal3);
  
  const fluxoCapital1 = resultado1.fluxo;
  const fluxoCapital2 = resultado2.fluxo;
  const fluxoCapital3 = resultado3.fluxo;
  
  // Calcula a duração do capital em cada cenário
  // Garantindo que durante a aposentadoria, o capital seja utilizado
  const capitalInicioAposentadoria1 = fluxoCapital1.find(item => item.idade === idadeAposentadoria1)?.capital || 0;
  const capitalInicioAposentadoria2 = fluxoCapital2.find(item => item.idade === idadeAposentadoria2)?.capital || 0;
  const capitalInicioAposentadoria3 = fluxoCapital3.find(item => item.idade === idadeAposentadoria3)?.capital || 0;
  
  const duracaoCapital1 = calcularDuracaoCapital(idadeAposentadoria1, capitalInicioAposentadoria1);
  const duracaoCapital2 = calcularDuracaoCapital(idadeAposentadoria2, capitalInicioAposentadoria2);
  const duracaoCapital3 = calcularDuracaoCapital(idadeAposentadoria3, capitalInicioAposentadoria3);
  
  // Combina os fluxos de capital para o gráfico
  const fluxoCapitalCombinado = [];
  for (let idade = idade_atual; idade <= expectativa_de_vida; idade++) {
    // Encontra os dados correspondentes em cada fluxo
    const item1 = fluxoCapital1.find(item => item.idade === idade);
    const item2 = fluxoCapital2.find(item => item.idade === idade);
    const item3 = fluxoCapital3.find(item => item.idade === idade);
    
    fluxoCapitalCombinado.push({
      age: idade,
      capital1: Math.round(item1?.capital || 0),
      capital2: Math.round(item2?.capital || 0),
      capital3: Math.round(item3?.capital || 0)
    });
  }
  
  return {
    fluxoCapital: fluxoCapitalCombinado,
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
    duracaoCapital3,
    idadeEsgotamento1: resultado1.idadeEsgotamento,
    idadeEsgotamento2: resultado2.idadeEsgotamento,
    idadeEsgotamento3: resultado3.idadeEsgotamento
  };
};

const chartConfig = {
  capital2: {
    label: "Aposentadoria no prazo desejado",
    theme: {
      light: "#7EC866",
      dark: "#7EC866",
    }
  },
};

const RetirementProjectionChart: React.FC<RetirementProjectionChartProps> = ({
  currentAge,
  retirementAge,
  lifeExpectancy,
  currentPortfolio,
  monthlyContribution,
  rendaMensalDesejada,
  safeWithdrawalRate,
  inflationRate
}) => {
  const [selectedView, setSelectedView] = useState<'completo' | '10anos' | '20anos' | '30anos'>('completo');
  const [taxaRetorno, setTaxaRetorno] = useState<number>(0.03); // 3% real ao ano como valor inicial
  const [rendaMensal, setRendaMensal] = useState<number>(rendaMensalDesejada);
  const [idadeEstimada, setIdadeEstimada] = useState<number>(100); // Idade fixa em 100 anos
  
  // Função para validar a idade estimada
  const handleIdadeEstimadaChange = (valor: string) => {
    const idadeDigitada = parseInt(valor) || 100;
    // Se o usuario estiver editando o campo, permitir a edição
    // Apenas ao terminar a edição (perder o foco do campo) validamos o valor mínimo
    setIdadeEstimada(idadeDigitada);
  };
  
  // Função para validar a idade mínima ao perder o foco
  const handleIdadeEstimadaBlur = () => {
    const idadeMinima = retirementAge + 10; // Idade de aposentadoria + 5 anos do cenário mais tardio
    if (idadeEstimada < idadeMinima) {
      setIdadeEstimada(idadeMinima);
    }
  };
  
  // Verificar se é necessário atualizar a idadeEstimada quando o retirementAge mudar
  useEffect(() => {
    const idadeMinima = retirementAge + 10; // Idade mínima baseada na maior idade de aposentadoria + 5 anos
    if (idadeEstimada < idadeMinima) {
      setIdadeEstimada(idadeMinima);
    }
  }, [retirementAge]); // Remover idadeEstimada da dependência para evitar loops
  
  // Certifique-se de que o domínio do eixo X inclua todas as idades até 100
  const xDomain = React.useMemo(() => {
    return [currentAge, 100]; // Fixado em 100 anos
  }, [currentAge]);
  
  // Calcular projeção baseada nas propriedades e nos estados
  const projection = React.useMemo(() => {
    return calculateRetirementProjection(
      currentAge,
      retirementAge,
      100, // Fixado em 100 anos para garantir consistência
      currentPortfolio,
      monthlyContribution,
      rendaMensal,
      taxaRetorno,
      taxaRetorno * 0.8 // Taxa reduzida para fase de consumo (80% da acumulação)
    );
  }, [currentAge, retirementAge, currentPortfolio, monthlyContribution, rendaMensal, taxaRetorno]);
  
  const filteredData = React.useMemo(() => {
    // Certifique-se de que todos os pontos até a expectativa de vida são exibidos
    // mesmo que o capital tenha se esgotado antes
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
              <CardTitle className="text-xl font-semibold">Cenário de Aposentadoria</CardTitle>
              <CardDescription className="mt-1">
                Evolução do patrimônio no prazo desejado ao longo do tempo
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
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxaRetorno">Taxa de Retorno Real (% a.a.)</Label>
              <div className="flex items-center gap-2">
                <Slider
                  id="taxaRetorno"
                  value={[taxaRetorno * 100]}
                  min={1}
                  max={5}
                  step={0.1}
                  onValueChange={(value) => setTaxaRetorno(value[0] / 100)}
                  className="flex-1"
                />
                <div className="w-12 text-center text-sm font-medium">{(taxaRetorno * 100).toFixed(1)}%</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rendaMensal">Renda Mensal Desejada</Label>
              <CurrencyInput
                id="rendaMensal"
                value={rendaMensal}
                onChange={(value) => setRendaMensal(value)}
                className="h-9"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idadeEstimada">Idade Estimada</Label>
              <Input
                id="idadeEstimada"
                type="number"
                value={idadeEstimada}
                onChange={(e) => handleIdadeEstimadaChange(e.target.value)}
                onBlur={handleIdadeEstimadaBlur}
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
            <AreaChart
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
                domain={xDomain}
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
              
              {/* Linha de referência para a idade de aposentadoria desejada */}
              <ReferenceLine 
                x={projection.idadeAposentadoria2} 
                stroke="#7EC866" 
                strokeDasharray="3 3" 
              />
              
              <Area 
                type="monotone" 
                dataKey="capital2" 
                name="Aposentadoria no prazo desejado" 
                stroke="#7EC866" 
                fill="#7EC866"
                fillOpacity={0.2}
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
                iconType="plainline"
                iconSize={10}
              />
            </AreaChart>
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
                <th className="py-2 px-3 text-right font-medium">Duração do Patrimônio</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-3 flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#7EC866] mr-2"></div>
                  <span>No prazo desejado ({projection.idadeAposentadoria2} anos)</span>
                </td>
                <td className="py-2 px-3 text-right">{formatCurrency(Math.round(projection.aporteMensal2))}</td>
                <td className="py-2 px-3 text-right">{formatCurrency(Math.round(projection.capitalNecessario2))}</td>
                <td className="py-2 px-3 text-right">{formatCurrency(rendaMensal)}</td>
                <td className="py-2 px-3 text-right">
                  {`Dura até os ${100} anos de idade`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RetirementProjectionChart;