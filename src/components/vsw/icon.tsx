import type { SVGProps } from 'react';

export type IconName =
  | 'arrow' | 'play' | 'calendar' | 'chat' | 'close' | 'send' | 'code'
  | 'layout' | 'bolt' | 'mail' | 'phone' | 'pin' | 'chev-l' | 'chev-r'
  | 'check' | 'clock' | 'vid' | 'logo' | 'grid' | 'users';

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
    default: return null;
  }
}
