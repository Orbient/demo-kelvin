import { useEffect, useRef } from 'react';
import ScrollExpand from '../components/rb/ScrollExpand.jsx';
import Pane from '../components/Pane.jsx';
import { playWhileOnScreen } from '../lib/media.js';
import { t } from '../lib/i18n.js';

// Dusk falls on the house while the frame grows. The first frame of the film is held as a still with every
// light off and a little day left in the sky; as the scroll goes on, the windows come on one by one, then the
// porch, then the sky goes to night and the still gives way to the film itself, which starts from that very
// frame and plays. Scroll back up and the film returns to its first frame, so the still lines up again.
const D = '/assets/img/dusk/';
const LIGHTS = [
  { src: 'w1.webp', from: 0.2, to: 0.3 },
  { src: 'w2.webp', from: 0.36, to: 0.48 },
  { src: 'w3.webp', from: 0.52, to: 0.62 },
  { src: 'porch.webp', from: 0.66, to: 0.78 },
];
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export default function DuskFilm({ children }) {
  const stills = useRef(null);
  const film = useRef(null);
  const lit = useRef(LIGHTS.map(() => false));
  const release = useRef(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    film.current = stills.current?.closest('.scroll-expand__frame')?.querySelector('video') || null;
    if (reduced.current && stills.current) stills.current.style.opacity = '0';
    if (reduced.current && film.current) release.current = playWhileOnScreen(film.current);
    return () => release.current?.();
  }, []);

  const onProgress = (p) => {
    const el = stills.current;
    if (!el || reduced.current) return;
    LIGHTS.forEach((l, i) => {
      const o = smooth(l.from, l.to, p);
      el.children[i + 1].style.opacity = o.toFixed(3);
      const on = o > 0.5;
      lit.current[i] = on;
    });
    el.style.opacity = (1 - smooth(0.86, 0.97, p)).toFixed(3);
    const v = film.current;
    if (!v) return;
    if (p >= 0.97 && !release.current) release.current = playWhileOnScreen(v);
    else if (p < 0.8 && release.current) {
      release.current();
      release.current = null;
      v.pause();
      if (v.getAttribute('src')) v.currentTime = 0;
    }
  };

  return (
    <ScrollExpand mediaType="video" src="/assets/video/dacha-dusk.mp4" poster={`${D}lit.jpg`} autoPlay={false} onProgress={onProgress}
      alt={t('Дом в сосновом лесу: темнеет, в окнах по одному загорается свет, потом фонари на веранде', 'A house in a pine forest at dusk: the windows light up one by one, then the lanterns on the veranda')}
      useWindowScroll startWidth={46} startHeight={56} startRadius={0} endRadius={0} mediaZoom={1.25} scrollDistance={1.3} holdDistance={0.45} overlayScrim={0.2}
      layers={
        <div ref={stills} className="dusk-stills" aria-hidden="true">
          <img src={`${D}off.jpg`} alt="" width="1920" height="1012" />
          {LIGHTS.map((l) => <img key={l.src} src={D + l.src} alt="" width="1920" height="1012" style={{ opacity: 0 }} />)}
        </div>
      }>
      <Pane className="dacha-overlay">
        {children}
      </Pane>
    </ScrollExpand>
  );
}
