import React, { useState } from 'react';
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
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const generateProjectionData = () => {
  const data = [];
  const currentAge = 43; // Idade atual
  const finalAge = 90; // Idade final da projeção
  
  let currentPatrimony = 3650000; // Valor inicial do patrimônio
  let maintainPatrimony = 3650000; // Patrimônio para cenário de manutenção
  let consumePatrimony = 3650000; // Patrimônio para cenário de consumo
  
  const annualGrowthRate = 0.07; // Taxa de crescimento atual (7% a.a.)
  const maintainGrowthRate = 0.045; // Taxa de crescimento para manutenção (4.5% a.a.)
  const consumeRate = -0.02; // Taxa de consumo (-2% a.a.)
  
  for (let age = currentAge; age <= finalAge; age++) {
    // Cálculo de crescimento para cada cenário
    currentPatrimony = currentPatrimony * (1 + annualGrowthRate);
    maintainPatrimony = maintainPatrimony * (1 + maintainGrowthRate);
    consumePatrimony = consumePatrimony * (1 + consumeRate);
    
    // Para o cenário de consumo, garantir que nunca fique negativo
    consumePatrimony = Math.max(0, consumePatrimony);
    
    data.push({
      age,
      current: Math.round(currentPatrimony),
      maintain: Math.round(maintainPatrimony),
      consume: Math.round(consumePatrimony)
    });
  }
  
  return data;
};

const chartConfig = {
  current: {
    label: "Projeção Atual",
    theme: {
      light: "#0EA5E9",
      dark: "#0EA5E9",
    }
  },
  maintain: {
    label: "Manutenção do Patrimônio",
    theme: {
      light: "#7EC866",
      dark: "#7EC866",
    }
  },
  consume: {
    label: "Consumo do Patrimônio",
    theme: {
      light: "#C8686D",
      dark: "#C8686D",
    }
  },
};

const RetirementProjectionChart = () => {
  const [selectedView, setSelectedView] = useState<'completo' | '10anos'>('completo');
  const projectionData = generateProjectionData();
  
  const filteredData = React.useMemo(() => {
    if (selectedView === '10anos') {
      return projectionData.filter(item => item.age <= projectionData[0].age + 10);
    }
    return projectionData;
  }, [projectionData, selectedView]);
  
  const formatYAxis = (value: number) => {
    if (value === 0) return 'R$ 0';
    if (value >= 1000000) return `R$ ${Math.floor(value / 1000000)}M`;
    return formatCurrency(value);
  };
  
  return (
    <Card className="w-full h-full border-border/80 shadow-sm">
      <CardHeader className="px-6 pb-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
          <div>
            <CardTitle className="text-xl font-semibold">Projeção Patrimonial</CardTitle>
            <CardDescription className="mt-1">
              Evolução do patrimônio em diferentes cenários ao longo do tempo
            </CardDescription>
          </div>
          <ToggleGroup 
            type="single" 
            value={selectedView}
            onValueChange={(value) => value && setSelectedView(value as 'completo' | '10anos')}
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
          </ToggleGroup>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 pt-4 h-[320px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 15, right: 20, left: 20, bottom: 30 }}
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
              
              <ReferenceLine 
                x={60} 
                stroke="#9CA3AF" 
                strokeDasharray="3 3" 
                label={{ 
                  value: "Aposentadoria", 
                  position: "top", 
                  fill: "#6b7280", 
                  fontSize: 11 
                }} 
              />
              
              <Line 
                type="monotone" 
                dataKey="current" 
                name="Projeção Atual" 
                stroke="#0EA5E9" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 5, strokeWidth: 1 }}
              />
              <Line 
                type="monotone" 
                dataKey="maintain" 
                name="Manutenção do Patrimônio" 
                stroke="#7EC866" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 5, strokeWidth: 1 }}
              />
              <Line 
                type="monotone" 
                dataKey="consume" 
                name="Consumo do Patrimônio" 
                stroke="#C8686D" 
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
                  fontSize: 12,
                  lineHeight: '1.2em'
                }}
                iconType="line"
                iconSize={12}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RetirementProjectionChart;
