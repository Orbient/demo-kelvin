import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { lamps } from '../data.js';
import { openProduct } from '../lib/cart.js';
import { t } from '../lib/i18n.js';

// The collection as a row of lamps standing in the dark. The row slides past as you scroll and only the lamp
// in the middle of the screen is on: it catches with a flicker, the one before it goes out. On a phone the
// row is swiped by hand and the lamp that settles in the middle lights the same way. A press opens its sheet.
const off = (src) => src.replace('/img/', '/img/off/');

export default function Vitrine() {
  const root = useRef(null);
  const track = useRef(null);
  const [lit, setLit] = useState(0);
  const litRef = useRef(0);

  const light = (i) => {
    if (i === litRef.current) return;
    litRef.current = i;
    setLit(i);
  };


  // desktop: the section holds still and the row slides through it with the scroll
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const row = track.current;
      const cards = [...row.children];
      const shift = () => row.scrollWidth - row.parentElement.clientWidth;
      gsap.to(row, {
        x: () => -shift(), ease: 'none',
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: () => `+=${shift() * 1.1}`, pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
          onUpdate: () => {
            const mid = window.innerWidth / 2;
            let best = 0;
            let d = Infinity;
            cards.forEach((c, i) => { const r = c.getBoundingClientRect(); const e = Math.abs(r.left + r.width / 2 - mid); if (e < d) { d = e; best = i; } });
            light(best);
          },
        },
      });
    });
    // phone: a swiped row; the card nearest the middle is on
    mm.add('(max-width: 899px)', () => {
      const row = track.current;
      let raf = 0;
      const pick = () => {
        raf = 0;
        const mid = row.getBoundingClientRect().left + row.clientWidth / 2;
        let best = 0;
        let d = Infinity;
        [...row.children].forEach((c, i) => { const r = c.getBoundingClientRect(); const e = Math.abs(r.left + r.width / 2 - mid); if (e < d) { d = e; best = i; } });
        light(best);
      };
      const onScroll = () => { if (!raf) raf = requestAnimationFrame(pick); };
      row.addEventListener('scroll', onScroll, { passive: true });
      pick();
      return () => { row.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
    });
  }, { scope: root });

  const press = (i, e) => {
    const r = e.currentTarget.querySelector('.vt-frame').getBoundingClientRect();
    openProduct(lamps[i].id, { left: r.left, top: r.top, width: r.width, height: r.height });
  };

  return (
    <section ref={root} className="collection vitrine" id="collection" aria-labelledby="col-h">
      <div className="vt-head wrap">
        <h2 className="h2" id="col-h" data-lines>{t('Коллекция «Реки»', 'The Rivers collection')}</h2>
        <p data-rise>{t('Заводские светильники, которые мы восстанавливаем в\u00a0мастерской в\u00a0Твери и\u00a0называем по\u00a0рекам Подмосковья. Нажмите на\u00a0лампу, чтобы рассмотреть.', 'Factory lights of\u00a0the past, restored in\u00a0our Tver workshop and\u00a0named after the rivers around Moscow. Choose a\u00a0lamp for\u00a0a\u00a0closer look.')}</p>
        <p className="vt-count" aria-live="polite"><span>{String(lit + 1).padStart(2, '0')}</span> / {String(lamps.length).padStart(2, '0')}</p>
      </div>
      <div className="vt-stage">
        <ul ref={track} className="vt-row">
          {lamps.map((l, i) => (
            <li key={l.id} data-i={i} className="vt-card" data-lit={lit === i ? '' : undefined}>
              <button type="button" onClick={(e) => press(i, e)} aria-label={`${l.text}, ${l.meta}. ${t('Открыть карточку', 'Open details')}`}>
                <span className="vt-frame">
                  <img className="vt-off" src={off(l.image)} alt="" loading="lazy" width="900" height="1125" />
                  <img className="vt-on" src={l.image} alt="" loading="lazy" width="900" height="1125" />
                </span>
                <span className="vt-name">{l.text}</span>
                <span className="vt-meta">{l.meta}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
