import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import Roll from '../components/Roll.jsx';
import { playWhileOnScreen } from '../lib/media.js';
import { BRAND } from '../lib/brand.js';
import { t } from '../lib/i18n.js';
import FilamentText from '../components/FilamentText.jsx';

// The page opens on a dark room. Scrolling is the film's playhead: a hand reaches for the switch, the lamp
// catches, the room fills with 2700 K light and the readout climbs with it, forwards and backwards with the
// scroll. Every frame of the film is a keyframe and the film sits in memory, so a seek decodes exactly one
// frame in hardware; a new seek is asked for only when the last one has landed, so seeks never pile up and
// the page keeps its frame rate. The switch on the first screen plays the same scene in place.
const FILM = { wide: '/assets/video/lamp-1920.mp4', narrow: '/assets/video/lamp-m.mp4' };
const LENGTH = 5.2;  // seconds of film
const FROM = 0.06;   // where in the scroll the film starts, as a share of the pinned scene
const SPAN = 0.8;    // how much of the scene the film takes
const at = (t) => FROM + (t / LENGTH) * SPAN; // scene position of a moment of the film
const CATCH = at(2.4); // the filament catches
const FULL = at(3.6);  // the light is fully up

export default function Prologue() {
  const root = useRef(null);
  const video = useRef(null);
  const kelvin = useRef(null);
  const trigger = useRef(null);
  const playing = useRef(false);
  const lit = useRef(false);
  const [on, setOn] = useState(false);

  // the film arrives from the loader (already in memory) or, without it, straight from its file
  useEffect(() => {
    const v = video.current;
    const narrow = window.matchMedia('(max-width: 767px)').matches;
    // a still of the room holds the screen until the film is ready; without motion, the room already lit
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { v.poster = '/assets/img/lamp-lit.jpg'; return undefined; }
    v.poster = narrow ? '/assets/img/lamp-dark-m.jpg' : '/assets/img/lamp-dark.jpg';
    let release = () => {};
    const set = () => { if (!v.src && !v.dataset.src) { v.src = window.__lampURL || (narrow ? FILM.narrow : FILM.wide); v.load(); release = playWhileOnScreen(v, '0px', { play: false }); } };
    // some mobile browsers draw seeked frames only once the video has played; a muted play and pause wakes it
    const wake = () => v.play().then(() => v.pause()).catch(() => {});
    v.addEventListener('loadeddata', wake, { once: true });
    if (window.__lampURL || !document.querySelector('.loader')) set();
    window.addEventListener('kelvin:lamp', set, { once: true });
    const late = setTimeout(set, 9500);
    return () => { window.removeEventListener('kelvin:lamp', set); v.removeEventListener('loadeddata', wake); clearTimeout(late); release(); };
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', narrow: '(max-width: 767px)' }, (ctx) => {
      const { motion, narrow } = ctx.conditions;
      const meter = { k: motion ? 0 : 2700 };
      const showKelvin = () => { if (kelvin.current) kelvin.current.textContent = String(Math.round(meter.k / 10) * 10); };
      showKelvin();

      if (!motion) {
        root.current.classList.add('is-rest');
        return () => root.current?.classList.remove('is-rest');
      }
      root.current.classList.add('is-live');
      const q = gsap.utils.selector(root);

      // the name rises and warms once the loader lifts
      gsap.set(q('.pro-copy > *'), { autoAlpha: 0, y: 24 });
      // the name itself catches like a filament (FilamentText); the words around it arrive as it warms
      const enter = () => gsap.timeline()
        .to(q('.pro-copy > *'), { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1 }, 1.2);
      if (window.__kelvinReady) enter(); else window.addEventListener('kelvin:ready', enter, { once: true });

      // the playhead: one seek in flight at a time, the latest wish taken when it lands
      const v = video.current;
      const film = { t: 0 };
      let busy = 0;
      const seek = () => {
        if (v.readyState < 1) return;
        if (busy && performance.now() - busy < 250) return;
        if (Math.abs(v.currentTime - film.t) < 0.02) { busy = 0; return; }
        busy = performance.now();
        v.currentTime = film.t;
      };
      const landed = () => { busy = 0; seek(); };
      v.addEventListener('seeked', landed);
      v.addEventListener('loadedmetadata', seek);

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: narrow ? '+=240%' : '+=300%', scrub: narrow ? 0.8 : 0.5, pin: true, anticipatePin: 1,
          onUpdate: (self) => {
            const now = self.progress > CATCH;
            if (now !== lit.current) { lit.current = now; setOn(now); }
          },
        },
      })
        .to(film, { t: LENGTH, duration: SPAN, onUpdate: seek }, FROM)
        // the first screen leaves as the room stirs
        .to(q('.pro-hero'), { autoAlpha: 0, y: -60, duration: 0.07, ease: 'power1.in' }, 0)
        // beat one: the dark
        .fromTo(q('.beat-1'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0.08)
        .to(q('.beat-1'), { autoAlpha: 0, y: -30, duration: 0.05, ease: 'power2.in' }, CATCH - 0.09)
        // beat two: the click, and one soft flash as the filament catches
        .fromTo(q('.beat-2'), { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.025, ease: 'power2.out' }, CATCH - 0.02)
        .to(q('.beat-2'), { autoAlpha: 0, scale: 1.06, duration: 0.05, ease: 'power2.in' }, CATCH + 0.07)
        .fromTo(q('.pro-flash'), { opacity: 0 }, { opacity: 0.2, duration: 0.01 }, CATCH)
        .to(q('.pro-flash'), { opacity: 0, duration: 0.08, ease: 'power2.out' }, CATCH + 0.01)
        // the readout climbs with the light
        .fromTo(q('.pro-meter'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.04, ease: 'power2.out' }, CATCH)
        .to(meter, { k: 2700, duration: FULL - CATCH, ease: 'power2.out', onUpdate: showKelvin }, CATCH)
        // beat three: what it means
        .fromTo(q('.beat-3'), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.06, ease: 'power2.out' }, FULL + 0.04)
        .set({}, {}, 1);
      trigger.current = tl.scrollTrigger;

      return () => {
        v.removeEventListener('seeked', landed);
        v.removeEventListener('loadedmetadata', seek);
        root.current?.classList.remove('is-live');
        trigger.current = null;
      };
    });
  }, { scope: root });

  // the switch plays the scene where it stands, then hands the page back at the same moment of the scroll
  const switchOn = () => {
    const st = trigger.current;
    // without the scene (reduced motion) the switch simply takes you to the collection
    if (!st) { document.getElementById('collection')?.scrollIntoView(); return; }
    if (playing.current) return;
    playing.current = true;
    const lenis = window.__lenis;
    const html = document.documentElement;
    if (lenis) lenis.stop(); else html.style.overflow = 'hidden';
    const to = FULL + 0.1;
    gsap.to(st.animation, {
      progress: to, duration: 3.6, ease: 'power1.inOut',
      onUpdate: () => { if (!lit.current && st.animation.progress() > CATCH) { lit.current = true; setOn(true); } },
      onComplete: () => {
        const y = st.start + (st.end - st.start) * to;
        if (lenis) { lenis.start(); lenis.scrollTo(y, { immediate: true, force: true }); } else { html.style.overflow = ''; window.scrollTo(0, y); }
        playing.current = false;
      },
    });
  };

  return (
    <section ref={root} className="prologue scene" id="top" data-cine aria-labelledby="pro-h">
      <video ref={video} className="pro-video" muted playsInline preload="auto" aria-hidden="true" />
      <div className="pro-flash" aria-hidden="true" />

      <div className="pro-hero">
        <div className="pro-copy">
          <p className="pro-lede">{t('Студия света в\u00a0Москве. Люстры, бра и\u00a0фонари для квартиры и\u00a0дачи; каждую лампу мы включаем в\u00a0тёмной комнате, прежде чем отправить вам.', 'A lighting studio in\u00a0Moscow. Chandeliers, sconces and\u00a0lanterns for city apartments and\u00a0country houses; we switch on every lamp in\u00a0a\u00a0dark room before it ships to\u00a0you.')}</p>
          <div className="pro-actions">
            <button type="button" className="switch-cta" role="switch" aria-checked={on} onClick={switchOn}>
              <span className="switch-cta-knob" aria-hidden="true"><span /></span>
              <Roll>{t('Включить свет', 'Turn on the light')}</Roll>
            </button>
          </div>
        </div>
        <h1 className="pro-title" id="pro-h"><span className="sr">{BRAND}, {t('студия света в Москве', 'a lighting studio in Moscow')}</span><FilamentText text={BRAND} start="ready" /></h1>
      </div>

      <p className="pro-beat beat-1">{t('Вечер начинается с\u00a0темноты.', 'Every evening begins in\u00a0the\u00a0dark.')}</p>
      <p className="pro-beat beat-2">{t('Щёлк.', 'Click.')}</p>

      {/* the readout and what it means, one group on the page's left edge */}
      <div className="pro-end">
        <div className="pro-meter" aria-hidden="true">
          <span className="pro-meter-num"><span ref={kelvin}>0</span><span className="pro-meter-unit">K</span></span>
          <span className="pro-meter-label">{t('цветовая температура', 'colour temperature')}</span>
        </div>
        <div className="pro-beat beat-3">
          <p>{t('Так горит каждая наша лампа: тёплые 2700\u00a0K, как у\u00a0лампы накаливания.', 'This is how every one of our lamps glows: a\u00a0warm 2700\u00a0K, like an\u00a0incandescent bulb.')}</p>
          <a className="cta-link" href="#collection"><Roll>{t('Смотреть коллекцию', 'View the collection')}</Roll><span className="cta-arrow" aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  );
}
