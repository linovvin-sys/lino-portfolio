'use client';
import { useState, useEffect } from 'react';
import { gsap } from 'gsap';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const sysPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || sysPref;
    
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = (event: React.MouseEvent) => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Check for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      return;
    }

    const { clientX, clientY } = event;
    const maxRadius = Math.hypot(
      Math.max(clientX, window.innerWidth - clientX),
      Math.max(clientY, window.innerHeight - clientY)
    );

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';
    overlay.style.backgroundColor = newTheme === 'dark' ? 'var(--color-bg, #000)' : 'var(--color-bg, #fff)';
    overlay.style.clipPath = `circle(0px at ${clientX}px ${clientY}px)`;
    document.body.appendChild(overlay);

    gsap.to(overlay, {
      clipPath: `circle(${maxRadius}px at ${clientX}px ${clientY}px)`,
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete: () => {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            overlay.remove();
          }
        });
      }
    });
    
    // Switch theme midway
    setTimeout(() => {
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }, 350);
  };

  return { theme, toggleTheme, mounted };
}
