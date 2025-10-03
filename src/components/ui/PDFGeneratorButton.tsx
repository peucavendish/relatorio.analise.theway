import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePrintToPDF } from '@/hooks/usePrintToPDF';
import { toast } from 'sonner';

interface PDFGeneratorButtonProps {
  elementId?: string;
  filename?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export const PDFGeneratorButton: React.FC<PDFGeneratorButtonProps> = ({
  className = '',
  variant = 'default',
  size = 'default',
  children
}) => {
  const { printToPDF } = usePrintToPDF();

  const handleGeneratePDF = () => {
    try {
      printToPDF();
      toast.success('Abrindo janela de impressão. Selecione "Salvar como PDF" no destino.');
    } catch (error) {
      toast.error('Erro ao abrir janela de impressão');
      console.error('Erro ao gerar PDF:', error);
    }
  };

  return (
    <Button
      onClick={handleGeneratePDF}
      variant={variant}
      size={size}
      className={className}
    >
      {children || (
        <>
          <Download className="mr-2 h-4 w-4" />
          Baixar PDF
        </>
      )}
    </Button>
  );
};

interface PDFGeneratorMultiButtonProps {
  elementIds: string[];
  filename?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export const PDFGeneratorMultiButton: React.FC<PDFGeneratorMultiButtonProps> = ({
  elementIds,
  filename = 'relatorio-alocacao.pdf',
  className = '',
  variant = 'default',
  size = 'default',
  children
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generatePDFFromMultipleElements } = usePDFGenerator();

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    
    try {
      const result = await generatePDFFromMultipleElements(elementIds, {
        filename,
        quality: 0.98,
        scale: 2,
        margin: 15
      });

      if (result.success) {
        toast.success('PDF gerado com sucesso!');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Erro inesperado ao gerar PDF');
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGeneratePDF}
      disabled={isGenerating}
      variant={variant}
      size={size}
      className={`${className} ${isGenerating ? 'opacity-75' : ''}`}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Gerando PDF...
        </>
      ) : (
        <>
          {children || (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Baixar PDF Completo
            </>
          )}
        </>
      )}
    </Button>
  );
};
