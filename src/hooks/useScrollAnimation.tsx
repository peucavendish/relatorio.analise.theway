
import { useEffect, useRef } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useScrollAnimation = <T extends HTMLElement = HTMLDivElement>(options: ScrollAnimationOptions = {}) => {
  const elementRef = useRef<T>(null);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            // Optional: unobserve after animation is applied
            // observer.unobserve(entry.target);
          } else {
            // Remove class if element is not in view anymore
            // Comment this line if you want the animation to occur only once
            entry.target.classList.remove('animated');
          }
        });
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    );
    
    observer.observe(element);
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options.threshold, options.rootMargin]);
  
  return elementRef;
};
