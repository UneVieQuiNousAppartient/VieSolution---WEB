/*
 * Marque de Vie Solution Web : l'ampoule de la famille VieSolution (viesolution.ca),
 * en variante aux couleurs du site — corps et socle en --accent, halo, rayons et dernier
 * anneau en --accent-2 (au lieu du bleu et de l'orange de VieSolution). Choix de Camille,
 * 2026-10-21. Couleurs portées par les classes .lm-* de vsw.css : la marque suit le thème.
 * Version figée (couleurs du thème clair) pour l'onglet du navigateur : src/app/icon.svg.
 */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      className="logo-mark"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="lm-halo" cx="24" cy="22" r="17" />
      <path
        className="lm-body"
        d="M24 6a14 14 0 0 0-8.5 25.1c.9.7 1.5 1.8 1.5 3V36h14v-1.9c0-1.2.6-2.3 1.5-3A14 14 0 0 0 24 6z"
      />
      <ellipse className="lm-glow" cx="24" cy="20" rx="7" ry="7.5" />
      <circle className="lm-person" cx="24" cy="17.5" r="3.2" />
      <path className="lm-person" d="M19.5 25.5c0-2.5 2-4.2 4.5-4.2s4.5 1.7 4.5 4.2" />
      <rect className="lm-body" x="17" y="36.5" width="14" height="2.5" rx="1.25" />
      <rect className="lm-body lm-soft" x="18" y="40" width="12" height="2" rx="1" />
      <rect className="lm-glow-solid" x="19.5" y="43" width="9" height="2" rx="1" />
      <g className="lm-rays">
        <line x1="24" y1="0" x2="24" y2="3" />
        <line x1="8" y1="8" x2="10.2" y2="10.2" />
        <line x1="40" y1="8" x2="37.8" y2="10.2" />
        <line x1="2" y1="22" x2="5" y2="22" />
        <line x1="43" y1="22" x2="46" y2="22" />
      </g>
    </svg>
  );
}
