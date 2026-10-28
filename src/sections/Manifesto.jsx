import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollReveal from '../components/rb/ScrollReveal.jsx';
import { t } from '../lib/i18n.js';

// The statement and the lamp are one scene. The bulb hangs in the page's own dark (its film is graded to
// true black and screened onto the soot, so there is no frame), and the scroll is its dimmer: as the
// sentence is read, word by word in the filament's colour, the coil comes up from a faint glow to full.
const END = 'center 45%';

export default function Manifesto() {
  const root = useRef(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo('.manifesto-glow', { opacity: 0.1, scale: 0.94 }, {
      opacity: 1, scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.manifesto-text', start: 'top bottom', end: END, scrub: true },
    });
  }, { scope: root });

  return (
    <section ref={root} className="manifesto" aria-labelledby="man-h">
      <h2 className="sr" id="man-h">{t('О студии', 'About the studio')}</h2>
      <figure className="manifesto-bulb">
        <div className="manifesto-glow">
          <video src="/assets/video/filament.mp4" autoPlay muted loop playsInline preload="metadata" poster="/assets/img/filament-poster.jpg" aria-label={t('Нить лампы накаливания горит и чуть дышит', 'An incandescent filament glowing, gently breathing')} />
        </div>
        <figcaption>{t('Нить накаливания, 2700 K. Её свет мы повторяем в\u00a0каждой лампе.', 'An incandescent filament, 2700 K. We recreate its light in\u00a0every lamp.')}</figcaption>
      </figure>
      <div className="manifesto-text">
        <ScrollReveal baseOpacity={0.16} enableBlur={false} baseRotation={0} highlightColor="#ffd8a1" wordAnimationEnd={END} textClassName="manifesto-line">
          {t('Мы продаём не светильники, а вечер. Каждую лампу включаем в тёмной комнате и сорок восемь часов смотрим, как она горит.', 'We don’t sell lamps. We sell evenings. Every lamp is switched on in a dark room, and we watch it burn for forty-eight hours.')}
        </ScrollReveal>
      </div>
    </section>
  );
}
