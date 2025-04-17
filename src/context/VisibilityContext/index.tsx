import React, { createContext, useState, useContext, ReactNode } from 'react';

interface VisibilityContextProps {
  hiddenCards: Record<string, boolean>;
  toggleCardVisibility: (cardId: string) => void;
}

const VisibilityContext = createContext<VisibilityContextProps | undefined>(undefined);

interface VisibilityProviderProps {
  children: ReactNode;
}

export const VisibilityProvider: React.FC<VisibilityProviderProps> = ({ children }) => {
  const [hiddenCards, setHiddenCards] = useState<Record<string, boolean>>({});

  const toggleCardVisibility = (cardId: string) => {
    setHiddenCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  return (
    <VisibilityContext.Provider value={{ hiddenCards, toggleCardVisibility }}>
      {children}
    </VisibilityContext.Provider>
  );
};

export const useVisibility = (): VisibilityContextProps => {
  const context = useContext(VisibilityContext);
  if (!context) {
    throw new Error('useVisibility must be used within a VisibilityProvider');
  }
  return context;
};
