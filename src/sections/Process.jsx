import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { steps } from '../data.js';
import { t } from '../lib/i18n.js';

// The four steps strung on a filament. On a desktop the section holds still while the scroll draws a line of
// light through four small bulbs; each bulb catches as its step comes up, the words of that step rise in and
// its photograph takes the frame. On a phone the steps stand in a column, each with its bulb already lit.
const HOLD = '(min-width: 900px) and (prefers-reduced-motion: no-preference)';

export default function Process() {
  const root = useRef(null);
  const [now, setNow] = useState(0);
  // the layout is known before the first paint, so the pin measures the held stage, not the column
  const [pinned, setPinned] = useState(() => typeof window !== 'undefined' && window.matchMedia(HOLD).matches);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(HOLD, () => {
      if (!pinned) { setPinned(true); return undefined; }
      const fill = root.current.querySelector('.pr-fill');
      const st = gsap.to(fill, {
        scaleX: 1, ease: 'none',
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: `+=${steps.length * 50}%`, pin: true, scrub: 0.4, anticipatePin: 1,
          onUpdate: (self) => setNow(Math.min(steps.length - 1, Math.floor(self.progress * steps.length * 0.999))),
        },
      });
      return () => { st.scrollTrigger?.kill(); };
    });
    mm.add('(max-width: 899px), (prefers-reduced-motion: reduce)', () => { if (pinned) { setPinned(false); setNow(0); } });
  }, { scope: root, dependencies: [pinned], revertOnUpdate: true });

  return (
    <section ref={root} className={`process${pinned ? ' pr-pinned' : ''}`} aria-labelledby="proc-h">
      <div className="pr-top wrap">
        <div className="process-head">
          <h2 className="h2" id="proc-h" data-lines>{t('Как мы ставим свет', 'How we light a\u00a0home')}</h2>
          <p data-rise>{t('Четыре шага от\u00a0плана квартиры до\u00a0первого вечера с\u00a0новым светом.', 'Four steps from\u00a0your floor plan to\u00a0the first evening in\u00a0new light.')}</p>
        </div>
        <div className="pr-wire" aria-hidden="true">
          <span className="pr-line"><span className="pr-fill" /></span>
          {steps.map((s, i) => <span key={s.line} className="pr-bulb" data-on={pinned ? (i <= now ? '' : undefined) : ''} style={{ '--at': `${(i / (steps.length - 1)) * 100}%` }} />)}
        </div>
      </div>
      <ol className="pr-steps wrap">
        {steps.map((s, i) => (
          <li key={s.line} className="pr-step" data-now={!pinned || i === now ? '' : undefined} aria-current={pinned && i === now ? 'step' : undefined}>
            <div className="pr-text">
              <p className="pr-count">{String(i + 1).padStart(2, '0')}<span> / {String(steps.length).padStart(2, '0')}</span></p>
              <h3 className="pr-line-h">{s.line}</h3>
              <p className="pr-body">{s.text}</p>
            </div>
            <figure className="pr-media"><img src={s.image} alt={s.alt} loading="lazy" width="700" height="875" /></figure>
          </li>
        ))}
      </ol>
    </section>
  );
}
