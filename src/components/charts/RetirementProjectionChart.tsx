
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

// Dados simulados para a projeção de aposentadoria
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

// Configurações para o gráfico
const chartConfig = {
  current: {
    label: "Projeção Atual",
    theme: {
      light: "#0353A4",
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
  const [selectedView, setSelectedView] = useState('completo');
  const projectionData = generateProjectionData();
  
  // Filtrar os dados conforme a visualização selecionada
  const filteredData = React.useMemo(() => {
    if (selectedView === '10anos') {
      return projectionData.filter(item => item.age <= projectionData[0].age + 10);
    }
    return projectionData;
  }, [projectionData, selectedView]);
  
  // Formatação dos valores no eixo Y
  const formatYAxis = (value: number) => {
    if (value === 0) return 'R$ 0';
    if (value >= 1000000) return `R$ ${Math.floor(value / 1000000)}M`;
    return formatCurrency(value);
  };
  
  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium">Projeção Financeira</h4>
        <div className="flex items-center space-x-4">
          <div className="p-1 bg-muted rounded-lg flex text-xs">
            <button
              className={`px-3 py-1 rounded ${selectedView === 'completo' ? 'bg-card shadow-sm' : ''}`}
              onClick={() => setSelectedView('completo')}
            >
              Completo
            </button>
            <button
              className={`px-3 py-1 rounded ${selectedView === '10anos' ? 'bg-card shadow-sm' : ''}`}
              onClick={() => setSelectedView('10anos')}
            >
              10 Anos
            </button>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card p-4 h-80">
        <ChartContainer config={chartConfig} className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="age" 
                label={{ value: 'Idade', position: 'insideBottom', offset: -5 }} 
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                tickFormatter={formatYAxis} 
                domain={[0, 'auto']}
                label={{ value: 'Patrimônio', angle: -90, position: 'insideLeft', offset: -5 }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border p-2 rounded-md shadow-md">
                        <p className="font-medium">{`Idade: ${payload[0]?.payload.age}`}</p>
                        {payload.map((entry, index) => (
                          <p key={`item-${index}`} style={{ color: entry.color }}>
                            {entry.name}: {formatCurrency(entry.value as number)}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              
              {/* Linha de referência na idade planejada de aposentadoria */}
              <ReferenceLine x={60} stroke="#888" strokeDasharray="3 3" label={{ value: "Aposentadoria", position: "top", fill: "#888" }} />
              
              {/* Linhas para cada cenário */}
              <Line 
                type="monotone" 
                dataKey="current" 
                name="Projeção Atual" 
                stroke="#0EA5E9" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="maintain" 
                name="Manutenção do Patrimônio" 
                stroke="#7EC866" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="consume" 
                name="Consumo do Patrimônio" 
                stroke="#C8686D" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

export default RetirementProjectionChart;
