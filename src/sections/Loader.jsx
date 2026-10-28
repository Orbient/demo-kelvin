import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

// While the opening film downloads, a filament is drawn and warms with the real progress, read out
// as colour temperature on an odometer: each digit is a drum that rolls on its own, the higher ones a
// beat later. When the room is ready, a greeting appears and the curtain lifts.
const FILM = { wide: '/assets/video/lamp-1920.mp4', narrow: '/assets/video/lamp-m.mp4' };
const COLD = [58, 51, 43];
const WARM = [255, 216, 161];
const mix = (t) => `rgb(${COLD.map((c, i) => Math.round(c + (WARM[i] - c) * t)).join(',')})`;

import { greeting } from '../lib/daytime.js';
import { t } from '../lib/i18n.js';

export default function Loader({ onDone }) {
  const root = useRef(null);
  const num = useRef(null); // the odometer
  const coil = useRef(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const film = window.matchMedia('(max-width: 767px)').matches ? FILM.narrow : FILM.wide;
    html.classList.add('is-loading');
    window.__lenis?.stop();

    const shown = { p: 0 };
    const len = coil.current.getTotalLength();
    gsap.set(coil.current, { strokeDasharray: len, strokeDashoffset: len });
    const render = () => {
      if (num.current) {
        const v = String(Math.round(shown.p * 27) * 100).padStart(4, '0');
        [...num.current.children].forEach((drum, i) => {
          drum.style.setProperty('--d', v[i]);
          drum.toggleAttribute('data-lead', v.slice(0, i + 1).split('').every((c) => c === '0') && i < 3);
        });
      }
      coil.current.style.strokeDashoffset = String(len * (1 - shown.p));
      coil.current.style.stroke = mix(shown.p);
    };
    render();

    // real progress: the bytes of the opening film, then the fonts. The film is handed to the first
    // scene as a local copy, so it plays from memory without a single stall.
    const to = (p) => gsap.to(shown, { p, duration: 0.5, ease: 'power2.out', overwrite: true, onUpdate: render });
    const hand = (url) => { window.__lampURL = url; window.dispatchEvent(new Event('kelvin:lamp')); };
    const film$ = fetch(film).then(async (res) => {
      const total = Number(res.headers.get('content-length')) || 0;
      if (!res.body || !total) { const blob = await res.blob(); hand(URL.createObjectURL(blob)); return; }
      const reader = res.body.getReader();
      const parts = [];
      let got = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        parts.push(value);
        got += value.length;
        to(0.92 * (got / total));
      }
      hand(URL.createObjectURL(new Blob(parts, { type: 'video/mp4' })));
    }).catch(() => hand(film));
    const loads = [film$, (document.fonts?.ready || Promise.resolve()).then(() => { to(Math.max(shown.p, 0.1)); })];
    const minimum = new Promise((r) => setTimeout(r, reduced ? 0 : 1200));
    const ceiling = new Promise((r) => setTimeout(r, 9000));

    let cancelled = false;
    Promise.race([Promise.all([Promise.all(loads), minimum]), ceiling]).then(() => {
      if (cancelled) return;
      const release = () => {
        html.classList.remove('is-loading');
        window.__lenis?.start();
        setGone(true);
        onDone?.();
      };
      if (reduced) { release(); return; }
      const q = gsap.utils.selector(root);
      const split = SplitText.create(q('.ld-hello')[0], { charsClass: 'char', wordsClass: 'word', linesClass: 'line', type: 'chars', mask: 'chars' });
      gsap.timeline({ onComplete: release })
        .to(shown, { p: 1, duration: 0.5, ease: 'power2.out', onUpdate: render })
        // the filament goes; the reading stays on the floor of the screen under the greeting
        .to(q('.ld-filament, .ld-label'), { autoAlpha: 0, y: -24, duration: 0.45, ease: 'power3.in' }, '+=0.15')
        .set(q('.ld-greet'), { autoAlpha: 1 })
        .from(split.chars, { yPercent: 165, duration: 0.85, ease: 'expo.out', stagger: 0.03 }, '<0.1')
        .from(q('.ld-sub'), { autoAlpha: 0, y: 16, duration: 0.7, ease: 'expo.out' }, '<0.35')
        .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.15, ease: 'expo.inOut' }, '+=0.45');
    });
    return () => { cancelled = true; html.classList.remove('is-loading'); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;
  return (
    <div ref={root} className="loader" role="status" aria-live="polite" aria-label={t('Загружаем сайт', 'Loading the site')}>
      <div className="ld-meter">
        <svg className="ld-filament" viewBox="0 0 120 160" aria-hidden="true">
          <path className="ld-stem" d="M18 160 V92 M102 160 V92" />
          <path ref={coil} className="ld-coil" d="M12.8 92.0 L13.0 90.0 L13.6 88.1 L14.6 86.4 L15.8 84.9 L17.2 83.9 L18.7 83.2 L20.1 82.8 L21.4 82.8 L22.5 83.1 L23.2 83.6 L23.5 84.2 L23.5 84.9 L23.0 85.4 L22.2 85.7 L21.2 85.8 L19.9 85.5 L18.6 84.9 L17.3 83.8 L16.1 82.5 L15.2 80.8 L14.6 78.9 L14.4 76.9 L14.6 74.9 L15.1 73.0 L16.1 71.3 L17.3 69.8 L18.8 68.7 L20.4 68.0 L22.0 67.6 L23.4 67.6 L24.7 67.9 L25.7 68.4 L26.3 69.1 L26.5 69.8 L26.4 70.4 L25.9 70.9 L25.1 71.1 L24.0 71.0 L22.9 70.5 L21.7 69.7 L20.7 68.5 L19.8 66.9 L19.2 65.2 L18.9 63.3 L19.1 61.3 L19.6 59.4 L20.5 57.6 L21.7 56.1 L23.1 54.9 L24.8 54.1 L26.4 53.7 L28.0 53.6 L29.5 53.9 L30.7 54.5 L31.6 55.2 L32.2 56.0 L32.3 56.8 L32.2 57.5 L31.7 58.0 L30.9 58.2 L30.0 58.0 L29.0 57.4 L28.0 56.5 L27.1 55.3 L26.5 53.7 L26.2 52.0 L26.2 50.1 L26.6 48.3 L27.4 46.5 L28.5 44.9 L29.9 43.7 L31.5 42.7 L33.2 42.2 L34.9 42.0 L36.5 42.2 L38.0 42.7 L39.1 43.5 L40.0 44.4 L40.5 45.4 L40.7 46.4 L40.5 47.2 L40.0 47.7 L39.3 48.0 L38.4 47.8 L37.6 47.4 L36.7 46.5 L36.1 45.3 L35.6 43.8 L35.5 42.2 L35.7 40.5 L36.3 38.8 L37.3 37.2 L38.5 35.8 L40.0 34.7 L41.7 34.0 L43.5 33.7 L45.2 33.8 L46.8 34.2 L48.3 34.9 L49.4 35.9 L50.3 37.1 L50.7 38.2 L50.9 39.4 L50.7 40.3 L50.2 41.0 L49.5 41.4 L48.7 41.4 L47.9 41.0 L47.2 40.3 L46.7 39.3 L46.4 38.0 L46.4 36.5 L46.7 34.9 L47.5 33.4 L48.5 32.0 L49.8 30.8 L51.4 30.0 L53.2 29.5 L54.9 29.4 L56.7 29.6 L58.3 30.3 L59.7 31.3 L60.8 32.4 L61.6 33.8 L62.1 35.2 L62.1 36.5 L61.9 37.6 L61.4 38.5 L60.8 39.0 L60.0 39.2 L59.2 39.0 L58.6 38.5 L58.1 37.6 L57.9 36.5 L57.9 35.2 L58.4 33.8 L59.2 32.4 L60.3 31.3 L61.7 30.3 L63.3 29.6 L65.1 29.4 L66.8 29.5 L68.6 30.0 L70.2 30.8 L71.5 32.0 L72.5 33.4 L73.3 34.9 L73.6 36.5 L73.6 38.0 L73.3 39.3 L72.8 40.3 L72.1 41.0 L71.3 41.4 L70.5 41.4 L69.8 41.0 L69.3 40.3 L69.1 39.4 L69.3 38.2 L69.7 37.1 L70.6 35.9 L71.7 34.9 L73.2 34.2 L74.8 33.8 L76.5 33.7 L78.3 34.0 L80.0 34.7 L81.5 35.8 L82.7 37.2 L83.7 38.8 L84.3 40.5 L84.5 42.2 L84.4 43.8 L83.9 45.3 L83.3 46.5 L82.4 47.4 L81.6 47.8 L80.7 48.0 L80.0 47.7 L79.5 47.2 L79.3 46.4 L79.5 45.4 L80.0 44.4 L80.9 43.5 L82.0 42.7 L83.5 42.2 L85.1 42.0 L86.8 42.2 L88.5 42.7 L90.1 43.7 L91.5 44.9 L92.6 46.5 L93.4 48.3 L93.8 50.1 L93.8 52.0 L93.5 53.7 L92.9 55.3 L92.0 56.5 L91.0 57.4 L90.0 58.0 L89.1 58.2 L88.3 58.0 L87.8 57.5 L87.7 56.8 L87.8 56.0 L88.4 55.2 L89.3 54.5 L90.5 53.9 L92.0 53.6 L93.6 53.7 L95.2 54.1 L96.9 54.9 L98.3 56.1 L99.5 57.6 L100.4 59.4 L100.9 61.3 L101.1 63.3 L100.8 65.2 L100.2 66.9 L99.3 68.5 L98.3 69.7 L97.1 70.5 L96.0 71.0 L94.9 71.1 L94.1 70.9 L93.6 70.4 L93.5 69.8 L93.7 69.1 L94.3 68.4 L95.3 67.9 L96.6 67.6 L98.0 67.6 L99.6 68.0 L101.2 68.7 L102.7 69.8 L103.9 71.3 L104.9 73.0 L105.4 74.9 L105.6 76.9 L105.4 78.9 L104.8 80.8 L103.9 82.5 L102.7 83.8 L101.4 84.9 L100.1 85.5 L98.8 85.8 L97.8 85.7 L97.0 85.4 L96.5 84.9 L96.5 84.2 L96.8 83.6 L97.5 83.1 L98.6 82.8 L99.9 82.8 L101.3 83.2 L102.8 83.9 L104.2 84.9 L105.4 86.4 L106.4 88.1 L107.0 90.0 L107.2 92.0" />
        </svg>
        <p className="ld-num" aria-hidden="true">
          <span ref={num} className="ld-drums">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="ld-drum" style={{ '--i': 3 - i }}>
                <span className="ld-strip" />
              </span>
            ))}
          </span>
          <span className="ld-k">K</span>
        </p>
        <p className="ld-label">{t('прогреваем нить', 'warming the filament')}</p>
      </div>
      <div className="ld-greet">
        <p className="ld-hello">{greeting}</p>
        <p className="ld-sub">{t('Сейчас включим свет', 'Turning on the light')}</p>
      </div>
    </div>
  );
}
