'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Statistiques légères (étape D) : chaque page vue part vers /api/visite (table vsw_page_views),
 *  sans cookie ni donnée personnelle. Les pages de l'admin ne sont pas comptées. */
// La provenance ne compte qu'à l'arrivée sur le site : les pages suivantes viennent du site lui-même.
let arrivee = true;

export function TrackPageview() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    const referent = arrivee ? document.referrer || '' : '';
    arrivee = false;
    fetch('/api/visite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chemin: pathname, referent }),
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
