import type { SVGProps } from 'react';

export type IconName =
  | 'arrow' | 'play' | 'calendar' | 'chat' | 'close' | 'send' | 'code'
  | 'layout' | 'bolt' | 'mail' | 'phone' | 'pin' | 'chev-l' | 'chev-r'
  | 'check' | 'clock' | 'vid' | 'logo' | 'grid' | 'users'
  // Icônes propres aux métiers (metiers-section.tsx, sélecteur « Je suis… » du hero)
  | 'briefcase-chart' | 'house-key' | 'tooth' | 'heart-pulse' | 'calculator'
  | 'hammer' | 'house-sign' | 'storefront';

type IconProps = { name: IconName; size?: number } & SVGProps<SVGSVGElement>;

export function Icon({ name, size = 20, ...p }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...p,
  };
  switch (name) {
    case 'arrow': return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case 'play': return <svg {...common}><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/></svg>;
    case 'calendar': return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>;
    case 'chat': return <svg {...common}><path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12z"/></svg>;
    case 'close': return <svg {...common}><path d="M6 6l12 12M18 6l-12 12"/></svg>;
    case 'send': return <svg {...common}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>;
    case 'code': return <svg {...common}><path d="M16 18l6-6-6-6M8 6l-6 6 6 6M14 4l-4 16"/></svg>;
    case 'layout': return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>;
    case 'bolt': return <svg {...common}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case 'mail': return <svg {...common}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 6 10-6"/></svg>;
    case 'phone': return <svg {...common}><path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 1 4.18 2 2 0 0 1 3 2h4.09a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.45-1.45a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
    case 'pin': return <svg {...common}><path d="M12 22s-8-7-8-13a8 8 0 0 1 16 0c0 6-8 13-8 13z"/><circle cx="12" cy="9" r="3"/></svg>;
    case 'chev-l': return <svg {...common}><polyline points="15 18 9 12 15 6"/></svg>;
    case 'chev-r': return <svg {...common}><polyline points="9 18 15 12 9 6"/></svg>;
    case 'check': return <svg {...common}><polyline points="20 6 9 17 4 12"/></svg>;
    case 'clock': return <svg {...common}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>;
    case 'vid': return <svg {...common}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>;
    case 'logo': return <svg {...common}><path d="M4 4h6l2 10 2-10h6M8 20h8"/></svg>;
    case 'grid': return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case 'users': return <svg {...common}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'briefcase-chart': return <svg {...common}><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><polyline points="7 16 10.5 12.5 13 14.5 17 10.5"/></svg>;
    case 'house-key': return <svg {...common}><path d="M3 11.5 11 4.5l8 7M5 9.75V20h7M17 9.75v3.75"/><circle cx="16" cy="16.5" r="2.5"/><path d="M18.5 16.5h4M21 16.5v2"/></svg>;
    case 'tooth': return <svg {...common}><path d="M8 3C5.2 3 3.5 5.2 3.5 8c0 2.5 1 4 1.6 6.5.6 2.6 1 6.5 2.9 6.5 1.6 0 1.8-3.5 2.4-5.5.3-1 .9-1.5 1.6-1.5s1.3.5 1.6 1.5c.6 2 .8 5.5 2.4 5.5 1.9 0 2.3-3.9 2.9-6.5.6-2.5 1.6-4 1.6-6.5 0-2.8-1.7-5-4.5-5-1.6 0-2.6.8-4 .8S9.6 3 8 3z"/></svg>;
    case 'heart-pulse': return <svg {...common}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/><path d="M3.5 12.5H8l1.5-3 3 6 1.5-3h6.5"/></svg>;
    case 'calculator': return <svg {...common}><rect x="5" y="2.5" width="14" height="19" rx="2"/><rect x="8" y="5.5" width="8" height="4" rx="0.5"/><path d="M8.5 13.5h.01M12 13.5h.01M15.5 13.5h.01M8.5 17.5h.01M12 17.5h.01M15.5 17.5h.01"/></svg>;
    case 'hammer': return <svg {...common}><polygon points="14.4 4.6 21.4 11.6 18.6 14.4 11.6 7.4"/><path d="M14.1 9.9 4.2 19.8a1.414 1.414 0 0 0 2 2l9.9-9.9"/></svg>;
    case 'house-sign': return <svg {...common}><path d="M2 21h20M4 21V7M4 8h6.5M6 8v2.5M10 8v2.5"/><rect x="5.5" y="10.5" width="5" height="3.5" rx="0.5"/><path d="M13 21v-7.5l4-3.5 4 3.5V21"/></svg>;
    case 'storefront': return <svg {...common}><path d="M3 9l1.5-5h15L21 9"/><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/><path d="M4.5 11.5V20h15v-8.5"/><path d="M10 20v-5h4v5"/></svg>;
    default: return null;
  }
}
