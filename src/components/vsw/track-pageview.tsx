'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

/** Analytics légères : enregistre chaque page vue dans site_page_views (sans cookie, sans donnée personnelle). */
export function TrackPageview() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    supabase
      .from('site_page_views')
      .insert({
        path: pathname,
        referrer: document.referrer ? document.referrer.slice(0, 500) : null,
        user_agent: navigator.userAgent.slice(0, 300),
      })
      .then(() => {});
  }, [pathname]);

  return null;
}
