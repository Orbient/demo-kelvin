// The page speaks Russian or English. The language is settled once, as the page loads: ?lang=en|ru in the
// address wins and is remembered for the next visit, otherwise the remembered choice, otherwise Russian.
// Every string on the page is written in both languages where it is used, as t('по-русски', 'in English').
const KEY = 'kelvin:lang';
const pick = (v) => (v === 'en' || v === 'ru' ? v : null);

const read = () => {
  try {
    const q = pick(new URLSearchParams(window.location.search).get('lang'));
    if (q) { try { localStorage.setItem(KEY, q); } catch { /* storage may be blocked; the address still holds it */ } return q; }
    return pick(localStorage.getItem(KEY)) || 'ru';
  } catch {
    return 'ru';
  }
};

export const LANG = typeof window === 'undefined' ? 'ru' : read();
export const t = (ru, en) => (LANG === 'en' ? en : ru);

// Prices are kept in roubles; the English page shows them in dollars at 90 ₽ to the dollar, to the nearest ten.
const RATE = 90;
export const money = (rub) => (LANG === 'en'
  ? `$${(Math.round(rub / RATE / 10) * 10).toLocaleString('en-US')}`
  : `${Math.round(rub).toLocaleString('ru-RU').replace(/,/g, ' ')} ₽`);

// switching reloads the page in the other language and keeps the rest of the address (?brand= and the like)
export function setLang(l) {
  try { localStorage.setItem(KEY, l); } catch { /* the address carries it anyway */ }
  const url = new URL(window.location.href);
  url.searchParams.set('lang', l);
  window.location.assign(url.toString());
}

// the document itself: its language, and the tab title and description that index.html has in Russian
if (typeof document !== 'undefined') {
  document.documentElement.lang = LANG;
  if (LANG === 'en') {
    document.title = 'Kelvin — a lighting studio for city apartments and country houses';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Chandeliers, pendants, sconces and outdoor lights for apartments and country houses. We switch on every lamp in a dark room before it ships to you.');
  }
}
