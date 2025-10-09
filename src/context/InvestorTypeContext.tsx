import React, { createContext, useContext, useState, ReactNode } from 'react';

export type InvestorType = 'qualified' | 'general';
export type PortfolioType = 'regular' | 'pension';

interface InvestorTypeContextType {
  investorType: InvestorType;
  portfolioType: PortfolioType;
  setInvestorType: (type: InvestorType) => void;
  setPortfolioType: (type: PortfolioType) => void;
}

const InvestorTypeContext = createContext<InvestorTypeContextType | undefined>(undefined);

export const useInvestorType = () => {
  const context = useContext(InvestorTypeContext);
  if (context === undefined) {
    throw new Error('useInvestorType must be used within an InvestorTypeProvider');
  }
  return context;
};

interface InvestorTypeProviderProps {
  children: ReactNode;
}

export const InvestorTypeProvider: React.FC<InvestorTypeProviderProps> = ({ children }) => {
  const [investorType, setInvestorType] = useState<InvestorType>('qualified');
  const [portfolioType, setPortfolioType] = useState<PortfolioType>('regular');

  return (
    <InvestorTypeContext.Provider
      value={{
        investorType,
        portfolioType,
        setInvestorType,
        setPortfolioType,
      }}
    >
      {children}
    </InvestorTypeContext.Provider>
  );
};
