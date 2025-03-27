
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
  
  // Formatação dos valores no eixo Y
  const formatYAxis = (value) => {
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
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="age" 
              label={{ value: 'Idade', position: 'insideBottom', offset: -5 }} 
              padding={{ left: 20, right: 20 }}
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              domain={[0, 'auto']}
              label={{ value: 'Patrimônio', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(value)} />} />
            <Legend />
            
            {/* Linha de referência na idade planejada de aposentadoria */}
            <ReferenceLine x={60} stroke="#888" strokeDasharray="3 3" label="Aposentadoria" />
            
            {/* Linhas para cada cenário */}
            <Line 
              type="monotone" 
              dataKey="current" 
              name="Projeção Atual" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="maintain" 
              name="Manutenção do Patrimônio" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="consume" 
              name="Consumo do Patrimônio" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default RetirementProjectionChart;
