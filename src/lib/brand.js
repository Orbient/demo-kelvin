// The demo wears the name of whoever it was sent to: ?brand=Светлый+Дом puts that name on the first screen,
// the header, the footer and the tab. Kept for the visit, so the anchors and reloads keep it. Without it the
// studio is Кельвин in Russian and Kelvin in English.
import { t } from './i18n.js';

const DEFAULT = t('Кельвин', 'Kelvin');
const read = () => {
  try {
    const q = new URLSearchParams(window.location.search).get('brand');
    if (q !== null) {
      const v = q.replace(/[_-]+/g, ' ').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 28);
      if (v) sessionStorage.setItem('kelvin:brand', v); else sessionStorage.removeItem('kelvin:brand');
      return v || DEFAULT;
    }
    return sessionStorage.getItem('kelvin:brand') || DEFAULT;
  } catch {
    return DEFAULT;
  }
};

export const BRAND = typeof window === 'undefined' ? DEFAULT : read();
export const isCustomBrand = BRAND !== DEFAULT;
// the monument is drawn for seven letters; a longer name is set smaller so it still spans the screen
export const brandScale = Math.min(1, 7.2 / Math.max(1, BRAND.length));

if (typeof document !== 'undefined') {
  document.documentElement.style.setProperty('--brand-k', String(brandScale));
  document.title = document.title.replace(DEFAULT, BRAND);
}
