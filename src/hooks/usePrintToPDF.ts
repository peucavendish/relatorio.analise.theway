import { useCallback } from 'react';

export const usePrintToPDF = () => {
  const printToPDF = useCallback(() => {
    // Simplesmente aciona a impressão do navegador
    // O usuário pode escolher "Salvar como PDF"
    window.print();
    
    return { success: true, message: 'Abrindo janela de impressão...' };
  }, []);

  return {
    printToPDF
  };
};






