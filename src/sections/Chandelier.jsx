import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Roll from '../components/Roll.jsx';
import Pane from '../components/Pane.jsx';
import { playWhileOnScreen } from '../lib/media.js';
import { t, money } from '../lib/i18n.js';

// One piece, shown the way we show it in the showroom. The film is a locked-off shot, so nothing shakes:
// a narrow window opens to the whole screen while the picture settles inside it (the counter-zoom), the
// chandelier comes up out of the dark, then the camera leans in slowly and its specification arrives as one
// quiet line, the price under it. On a phone the whole piece stays in frame and the words sit under it.
const spec = [
  [t('Свечи', 'Candles'), t('24, нить 2700 K', '24, 2700 K filament')],
  [t('Хрусталь', 'Crystal'), t('1 200 подвесок ручной огранки', '1,200 hand-cut drops')],
  [t('Диаметр', 'Diameter'), t('120 см, для зала от 30 м²', '120\u00a0cm, for rooms from 30\u00a0m²')],
];

export default function Chandelier() {
  const root = useRef(null);
  const video = useRef(null);

  // the loop plays, and holds its decoder, only while the scene is on screen
  useEffect(() => {
    const v = video.current;
    const narrow = window.matchMedia('(max-width: 767px)').matches;
    v.poster = narrow ? '/assets/img/msta-poster-m.jpg' : '/assets/img/msta-poster.jpg';
    v.src = narrow ? '/assets/video/msta-m.mp4' : '/assets/video/msta-1920.mp4';
    return playWhileOnScreen(v);
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', narrow: '(max-width: 767px)' }, (ctx) => {
      const { motion, narrow } = ctx.conditions;
      if (!motion) {
        root.current.classList.add('is-rest');
        return () => root.current?.classList.remove('is-rest');
      }
      root.current.classList.add('is-live');
      const q = gsap.utils.selector(root);
      const split = SplitText.create(q('.ch-name h2')[0], { charsClass: 'char', wordsClass: 'word', linesClass: 'line', type: 'chars', mask: 'chars', aria: 'auto' });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: narrow ? '+=220%' : '+=260%', scrub: 1, pin: true, anticipatePin: 1 },
      });
      // the window opens to the screen; the picture settles inside it
      tl.fromTo(q('.ch-media'), { clipPath: narrow ? 'inset(14% 6% 42% 6%)' : 'inset(9% 24% 11% 24%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.34, ease: 'power2.inOut' }, 0)
        .fromTo(q('.ch-video'), { scale: narrow ? 1.2 : 1.45 }, { scale: 1, duration: 0.34, ease: 'power2.inOut' }, 0)
        // the chandelier comes up out of the dark
        .fromTo(q('.ch-dark'), { opacity: 0.4 }, { opacity: 0.06, duration: 0.22, ease: 'power1.in' }, 0.12)
        .fromTo(split.chars, { yPercent: 165 }, { yPercent: 0, duration: 0.1, stagger: 0.015, ease: 'expo.out' }, 0.02)
        .fromTo(q('.ch-name p'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.12)
        .to(q('.ch-name'), { autoAlpha: 0, yPercent: -16, duration: 0.07 }, 0.36)
        // then the camera leans in for the rest of the scene
        .to(q('.ch-video'), { scale: narrow ? 1.04 : 1.22, duration: 0.66 }, 0.34)
        // the specification, then the price and the way to order
        .fromTo(q('.ch-info'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02 }, 0.44)
        .fromTo(q('.ch-card'), { y: 80 }, { y: 0, duration: 0.12, ease: 'power3.out' }, 0.44)
        .fromTo(q('.ch-spec > div'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.08, stagger: 0.04, ease: 'power2.out' }, 0.44)
        .fromTo(q('.ch-buy > *'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.08, stagger: 0.04, ease: 'power2.out' }, 0.64);
      return () => { root.current?.classList.remove('is-live'); split.revert(); };
    });
  }, { scope: root });

  return (
    <section ref={root} className="chandelier scene" data-cine aria-labelledby="ch-h">
      <div className="ch-media" aria-hidden="true">
        <video ref={video} className="ch-video" muted loop playsInline preload="auto" />
        <div className="ch-dark" />
        <div className="ch-scrim" />
      </div>
      <div className="ch-name">
        <h2 id="ch-h">{t('Мста', 'Msta')}</h2>
        <p>{t('Люстра из\u00a0хрусталя. Флагман коллекции «Реки».', 'A\u00a0crystal chandelier. The flagship of\u00a0the Rivers collection.')}</p>
      </div>
      {/* the specification on a pane of glass held up to the crystal: the drops behind it bend through */}
      <div className="ch-info">
        <Pane className="ch-card">
          <dl className="ch-spec">
            {spec.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <div className="ch-buy">
            <p className="ch-price">{t('от', 'from')}&nbsp;{money(186000)}</p>
            <a className="cta-link" href="#request"><Roll>{t('Заказать «Мсту»', 'Order the Msta')}</Roll><span className="cta-arrow" aria-hidden="true">→</span></a>
          </div>
        </Pane>
      </div>
    </section>
  );
}
