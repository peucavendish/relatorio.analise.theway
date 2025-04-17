import { useState, useCallback, useEffect } from 'react';

// Hook para gerenciar o estado de visibilidade dos cards
export const useCardVisibility = () => {
  // Inicializar com estado vazio ou recuperar do localStorage
  const [hiddenCards, setHiddenCards] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('hiddenCards');
    return saved ? JSON.parse(saved) : {};
  });

  // Salvar no localStorage quando o estado mudar
  useEffect(() => {
    localStorage.setItem('hiddenCards', JSON.stringify(hiddenCards));
  }, [hiddenCards]);

  // Função para alternar visibilidade de um card
  const toggleCardVisibility = useCallback((cardId: string) => {
    setHiddenCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  }, []);

  // Função para verificar se um card está visível
  const isCardVisible = useCallback((cardId: string) => {
    return !hiddenCards[cardId];
  }, [hiddenCards]);

  return {
    hiddenCards,
    toggleCardVisibility,
    isCardVisible
  };
};

export default useCardVisibility;
