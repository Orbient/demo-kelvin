import { BRAND } from '../lib/brand.js';

// The mark: an incandescent bulb whose filament is the first letter of the name. It follows ?brand=, so the
// demo sent to a company carries that company's own initial.
export const INITIAL = BRAND.trim().charAt(0).toUpperCase();
const GLASS = 'M10.5 26.5C4.6 22 3.2 13.6 7.2 8.2 11.4 2.4 20.6 2.4 24.8 8.2 28.8 13.6 27.4 22 21.5 26.5L21 30.5H11L10.5 26.5Z';

export function LogoMark({ className = '', title }) {
  return (
    <svg className={`logo-mark ${className}`.trim()} viewBox="0 0 32 40" role={title ? 'img' : undefined} aria-hidden={title ? undefined : 'true'} aria-label={title}>
      <path className="logo-glass" d={GLASS} />
      <path className="logo-base" d="M11.5 33h9M12.5 35.6h7M14.2 38.2h3.6" />
      <text className="logo-filament" x="16" y="21.2" textAnchor="middle">{INITIAL}</text>
    </svg>
  );
}

// the same mark as the tab icon, drawn on the soot
export function faviconHref() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40"><rect x="-4" width="40" height="40" rx="9" fill="#0d0c0b"/><path d="${GLASS}" fill="none" stroke="#a39d93" stroke-width="1.4"/><path d="M11.5 33h9M12.5 35.6h7M14.2 38.2h3.6" stroke="#a39d93" stroke-width="1.4" stroke-linecap="round"/><text x="16" y="21.4" text-anchor="middle" font-family="Georgia,serif" font-size="15" fill="none" stroke="#ffd8a1" stroke-width="1.3">${INITIAL}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
