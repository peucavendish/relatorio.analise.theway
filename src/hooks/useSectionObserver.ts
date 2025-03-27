import { useState, useEffect, useCallback, useRef } from 'react';

// Lista de seções a serem observadas
export const sectionIds = [
  'cover',
  'summary',
  'retirement',
  'beach-house',
  'tax',
  'protection',
  'succession',
  'action-plan',
];

export function useSectionObserver() {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const intersectingElements = useRef<Map<string, number>>(new Map());

  // Função para determinar qual seção está mais visível
  const determineActiveSection = useCallback(() => {
    let maxVisibility = 0;
    let mostVisibleSection = activeSection;

    intersectingElements.current.forEach((ratio, id) => {
      if (ratio > maxVisibility) {
        maxVisibility = ratio;
        mostVisibleSection = id;
      }
    });

    return mostVisibleSection;
  }, [activeSection]);

  // Função para atualizar a seção ativa baseada na posição de scroll
  const handleScroll = useCallback(() => {
    // Apenas atualize se existirem elementos intersectando
    if (intersectingElements.current.size > 0) {
      const newActiveSection = determineActiveSection();
      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection);
      }
    }
  }, [activeSection, determineActiveSection]);

  // Função para navegar para uma seção específica
  const navigateToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  }, []);

  // Controle de navegação com teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = sectionIds.indexOf(activeSection);
      
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = Math.min(currentIndex + 1, sectionIds.length - 1);
        navigateToSection(sectionIds[nextIndex]);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = Math.max(currentIndex - 1, 0);
        navigateToSection(sectionIds[prevIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, navigateToSection]);

  useEffect(() => {
    // Aguardar um momento para garantir que os elementos estejam renderizados
    const timer = setTimeout(() => {
      // Configurar o observer com threshold múltiplos para maior precisão
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const id = entry.target.id;
            
            if (entry.isIntersecting) {
              intersectingElements.current.set(id, entry.intersectionRatio);
            } else {
              intersectingElements.current.delete(id);
            }
          });
          
          // Atualizar seção ativa após processar todas as entradas
          handleScroll();
        },
        {
          // Usar múltiplos thresholds para detecção mais precisa
          threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
          rootMargin: '-10% 0px -10% 0px' // Margem menor para melhor detecção
        }
      );

      // Observar cada seção
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element && observerRef.current) {
          observerRef.current.observe(element);
        }
      });

      // Adicionar evento de scroll para atualizações mais suaves
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 100); // Pequeno delay para garantir que os elementos estejam prontos

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return { activeSection, navigateToSection };
} 