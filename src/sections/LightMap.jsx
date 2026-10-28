import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data.js';
import { t } from '../lib/i18n.js';

// Where the light already burns. Moscow at night drawn as its rings and its river; the homes we have lit come
// on one by one as the section arrives, and pointing at a name (or at its light) shows that room.
const RIVER = 'M-20 360 C 80 330 140 420 230 430 S 330 520 400 540 S 470 600 520 590 S 560 520 600 545 S 650 640 720 650 S 830 620 900 700 S 980 760 1040 750';

export default function LightMap() {
  const root = useRef(null);
  const [on, setOn] = useState(0); // how many have come on
  const [pick, setPick] = useState(0);
  const p = projects[pick];

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setOn(projects.length); return undefined; }
    const st = ScrollTrigger.create({
      trigger: root.current, start: 'top 60%', once: true,
      onEnter: () => projects.forEach((_, i) => gsap.delayedCall(0.25 + i * 0.22, () => setOn((n) => Math.max(n, i + 1)))),
    });
    return () => st.kill();
  }, []);

  return (
    <section ref={root} className="lmap" id="projects" aria-labelledby="lmap-h">
      <div className="lmap-copy">
        <h2 className="h2" id="lmap-h" data-lines>{t('Где горит наш\u00a0свет', 'Where our light is\u00a0on')}</h2>
        <p data-rise>{t('Квартиры, дома и\u00a0рестораны, которые мы осветили в\u00a0Москве и\u00a0Подмосковье. Наведите на\u00a0адрес, чтобы заглянуть внутрь.', 'Apartments, houses and\u00a0restaurants we have lit in\u00a0and around Moscow. Point at\u00a0an\u00a0address to\u00a0look inside.')}</p>
        <ul className="lmap-list">
          {projects.map((x, i) => (
            <li key={x.id}>
              <button type="button" aria-pressed={pick === i} onPointerEnter={() => setPick(i)} onFocus={() => setPick(i)} onClick={() => setPick(i)}>
                <span className="lmap-place">{x.place}</span>
                <span className="lmap-kind">{x.kind}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="lmap-stage">
        <svg className="lmap-svg" viewBox="0 0 1000 1000" role="img" aria-label={t('Схема Москвы ночью с отмеченными объектами', 'A night map of Moscow with our projects marked')}>
          <defs>
            <radialGradient id="lmap-glow"><stop offset="0" stopColor="#ffd8a1" stopOpacity="0.9" /><stop offset="0.35" stopColor="#ffad47" stopOpacity="0.35" /><stop offset="1" stopColor="#ffad47" stopOpacity="0" /></radialGradient>
          </defs>
          <ellipse className="lmap-ring" cx="500" cy="500" rx="330" ry="300" />
          <circle className="lmap-ring" cx="500" cy="500" r="150" />
          <circle className="lmap-ring" cx="500" cy="500" r="88" />
          <circle className="lmap-ring lmap-ring--fine" cx="500" cy="500" r="45" />
          <path className="lmap-river" d={RIVER} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} className="lmap-road" x1={500 + Math.cos(a) * 45} y1={500 + Math.sin(a) * 45} x2={500 + Math.cos(a) * 520} y2={500 + Math.sin(a) * 520} />;
          })}
          <text className="lmap-label" x="500" y="185" textAnchor="middle">{t('МКАД', 'MKAD')}</text>
          <text className="lmap-label" x="500" y="338" textAnchor="middle">{t('ТТК', 'TTK')}</text>
          {projects.map((x, i) => (
            <g key={x.id} className="lmap-dot" data-on={i < on ? '' : undefined} data-pick={pick === i ? '' : undefined} transform={`translate(${x.x} ${x.y})`} onPointerEnter={() => setPick(i)}>
              <circle className="lmap-halo" r="60" fill="url(#lmap-glow)" />
              <circle className="lmap-core" r="7" />
              <circle className="lmap-hit" r="26" />
            </g>
          ))}
        </svg>
        <figure className="lmap-card" key={p.id}>
          <img src={p.image} alt={p.alt} loading="lazy" />
          <figcaption><b>{p.place}</b><span>{p.kind}</span><span>{p.did}</span></figcaption>
        </figure>
      </div>
    </section>
  );
}
