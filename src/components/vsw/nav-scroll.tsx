'use client';

import { useEffect } from 'react';

/** Nav compacte : ajoute la classe .scrolled sur .nav après 24 px de défilement (style dans vsw.css). */
export function NavScroll() {
  useEffect(() => {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      nav.classList.remove('scrolled');
    };
  }, []);
  return null;
}
