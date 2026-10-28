import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ElasticSlider from '../components/rb/ElasticSlider.jsx';
import Pane from '../components/Pane.jsx';
import { tintOf } from '../lib/kelvin.js';
import { t } from '../lib/i18n.js';

const NAMES = [[1800, t('как свеча', 'candlelight')], [2200, t('как закат', 'sunset')], [2700, t('как лампа накаливания', 'incandescent')], [3000, t('тёплый белый', 'warm white')], [3500, t('мягкий белый', 'soft white')], [4000, t('нейтральный белый', 'neutral white')]];
const nameOf = (k) => NAMES.reduce((a, b) => (Math.abs(b[0] - k) < Math.abs(a[0] - k) ? b : a))[1];

// The room is one photograph, dark and lit. Each source is the lit photograph seen through a soft pool
// around that source, so switching one on lights only what it would light. Positions are in % of the photo.
const SOURCES = [
  { id: 'lamp', name: t('Настольная лампа', 'Table lamp'), note: t('льняной абажур', 'linen shade'), x: 64.4, y: 42.7, pool: [30, 52, 64.4, 58] },
  { id: 'shelf', name: t('Лампа на полке', 'Shelf lamp'), note: t('точечный свет на книги', 'a spot of light on the books'), x: 77.2, y: 32.4, pool: [16, 30, 78, 40] },
  { id: 'garland', name: t('Гирлянда', 'String lights'), note: t('тёплые 2200 K по полкам', 'a warm 2200 K along the shelves'), x: 74, y: 13, pool: [30, 26, 76, 12] },
  { id: 'stove', name: t('Огонь в печи', 'Fire in the stove'), note: t('живое пламя, 1800 K', 'a live flame, 1800 K'), x: 29.8, y: 54.2, pool: [26, 40, 29.8, 62] },
];
const AMBIENT = 0.11; // each source also lifts the whole room a little, as real light bounces

export default function Room() {
  const root = useRef(null);
  const stage = useRef(null);
  const layers = useRef({});
  const ambient = useRef(null);
  const torch = useRef(null);
  const [on, setOn] = useState(() => Object.fromEntries(SOURCES.map((s) => [s.id, false])));
  const [dim, setDim] = useState(85);
  const [k, setK] = useState(2700);
  const tint = tintOf(k);
  const count = Object.values(on).filter(Boolean).length;
  const level = 0.25 + 0.75 * (dim / 100);
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // a source catches like a cold coil: a flicker, then the light settles
  const light = (id, next) => {
    const el = layers.current[id];
    if (!el) return;
    gsap.killTweensOf(el);
    if (reduced()) { gsap.set(el, { opacity: next ? level : 0 }); return; }
    if (next) {
      gsap.timeline()
        .set(el, { opacity: 0 })
        .to(el, { opacity: level * 0.7, duration: 0.07, ease: 'none' })
        .to(el, { opacity: level * 0.15, duration: 0.07, ease: 'none' })
        .to(el, { opacity: level * 0.9, duration: 0.05, ease: 'none' })
        .to(el, { opacity: level, duration: 0.9, ease: 'expo.out' });
    } else gsap.to(el, { opacity: 0, duration: 0.45, ease: 'power2.in' });
  };

  const toggle = (id, next = !on[id]) => {
    light(id, next);
    setOn((s) => ({ ...s, [id]: next }));
  };
  const all = (next) => {
    SOURCES.forEach((s, i) => gsap.delayedCall(i * 0.12, () => toggle(s.id, next)));
  };

  // the dimmer holds every lit source and the bounce at its level
  useEffect(() => {
    SOURCES.forEach((s) => { if (on[s.id]) gsap.to(layers.current[s.id], { opacity: level, duration: 0.25, overwrite: 'auto' }); });
    gsap.to(ambient.current, { opacity: Math.min(1, count * AMBIENT * level * 1.6), duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, count]);

  // both photographs are decoded well before the room arrives, so no frame waits on them
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      ['/assets/img/room-off.jpg', '/assets/img/room-on.jpg'].forEach((src) => { const i = new Image(); i.src = src; i.decode?.().catch(() => {}); });
    }, { rootMargin: '150% 0px' });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  // the first time the room is seen its lights come on by themselves, one after another
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current, start: 'top 35%', once: true,
      onEnter: () => ['stove', 'lamp', 'shelf', 'garland'].forEach((id, i) => gsap.delayedCall(0.2 + i * 0.55, () => toggle(id, true))),
    });
    return () => st.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // in the dark the pointer carries a small torch: the lit room shows through a pool around it
  useEffect(() => {
    const st = stage.current;
    const t = torch.current;
    if (!st || !t || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || reduced()) return undefined;
    const R = 150;
    const p = { x: 0, y: 0 };
    const paint = () => {
      t.style.transform = `translate3d(${p.x - R}px, ${p.y - R}px, 0)`;
      t.style.backgroundPosition = `${R - p.x}px ${R - p.y}px`;
    };
    const x = gsap.quickTo(p, 'x', { duration: 0.5, ease: 'power3', onUpdate: paint });
    const y = gsap.quickTo(p, 'y', { duration: 0.5, ease: 'power3', onUpdate: paint });
    const move = (e) => {
      const r = st.getBoundingClientRect();
      t.style.backgroundSize = `${r.width}px ${r.height}px`;
      x(e.clientX - r.left); y(e.clientY - r.top);
    };
    const enter = () => gsap.to(t, { opacity: 1, duration: 0.4 });
    const leave = () => gsap.to(t, { opacity: 0, duration: 0.6 });
    const view = st.parentElement; // the frame
    view.addEventListener('pointermove', move);
    view.addEventListener('pointerenter', enter);
    view.addEventListener('pointerleave', leave);
    return () => { view.removeEventListener('pointermove', move); view.removeEventListener('pointerenter', enter); view.removeEventListener('pointerleave', leave); };
  }, []);

  return (
    <section ref={root} className="room" id="room" aria-labelledby="room-h">
      <div className="room-view">
        <div className="room-head">
          <h2 className="h2" id="room-h">{t('Тёмная комната', 'The dark room')}</h2>
          <p className="room-lede">{t('Здесь мы проверяем каждую лампу. Включайте свет по одному, прямо на фото, и смотрите, что он делает с комнатой.', 'This is where we test every lamp. Turn the lights on one by one, right on the photo, and see what each does to the room.')}</p>
        </div>
        <div className="room-frame">
        <div ref={stage} className="room-stage">
          <img className="room-off" src="/assets/img/room-off.jpg" width="2000" height="1125" alt="" aria-hidden="true" loading="lazy" />
          <div ref={ambient} className="room-light room-ambient" aria-hidden="true" />
          {SOURCES.map((s) => (
            <div key={s.id} ref={(el) => { layers.current[s.id] = el; }} className="room-light" aria-hidden="true"
              style={{ WebkitMaskImage: `radial-gradient(${s.pool[0]}% ${s.pool[1]}% at ${s.pool[2]}% ${s.pool[3]}%, #000 0%, rgba(0,0,0,0.75) 35%, transparent 100%)`, maskImage: `radial-gradient(${s.pool[0]}% ${s.pool[1]}% at ${s.pool[2]}% ${s.pool[3]}%, #000 0%, rgba(0,0,0,0.75) 35%, transparent 100%)` }} />
          ))}
          <div ref={torch} className="room-torch" aria-hidden="true" />
          <div className="room-tint" aria-hidden="true" style={{ background: `rgb(${tint.join(',')})`, opacity: count ? 1 : 0 }} />
          {SOURCES.map((s) => (
            <button key={s.id} type="button" className="room-spot" style={{ left: `${s.x}%`, top: `${s.y}%` }} aria-pressed={on[s.id]} onClick={() => toggle(s.id)}>
              <span className="room-spot-dot" aria-hidden="true" />
              <span className="room-spot-label">{s.name}<small>{s.note}</small></span>
            </button>
          ))}
        </div>
        <img className="sr" src="/assets/img/room-on.jpg" alt={t('Гостиная с зелёными стенами вечером: настольная лампа, лампа на полке, гирлянда и огонь в печи', 'A green-walled living room in the evening: a table lamp, a shelf lamp, string lights and a fire in the stove')} loading="lazy" />
        </div>
      </div>
      {/* the light controls, on a strip of glass laid over the bottom of the room */}
      <Pane className="room-panel">
        <div className="room-chips" role="group" aria-label={t('Источники света', 'Light sources')}>
          <button type="button" className="room-chip room-chip--all" aria-pressed={count === SOURCES.length} onClick={() => all(count !== SOURCES.length)}>
            <span className="pip" aria-hidden="true" />{count === SOURCES.length ? t('Выключить всё', 'All off') : t('Весь свет', 'All on')}
          </button>
          {SOURCES.map((s) => (
            <button key={s.id} type="button" className="room-chip" aria-pressed={on[s.id]} onClick={() => toggle(s.id)}>
              <span className="room-chip-dot" aria-hidden="true" />{s.name}
            </button>
          ))}
        </div>
        <div className="room-dials">
          <div className="control">
            <span className="control-label">{t('Яркость', 'Brightness')}</span>
            <ElasticSlider defaultValue={85} startingValue={10} maxValue={100} onChange={(v) => setDim(Math.round(v))}
              leftIcon={<span className="slider-end">10</span>} rightIcon={<span className="slider-end">100</span>}
              formatValue={(v) => `${Math.round(v)}%`} thumbColor="#ecebe8" disabled={!count} ariaLabel={t('Яркость', 'Brightness')} />
          </div>
          <div className="control">
            <span className="control-label">{t('Оттенок', 'Warmth')}</span>
            <ElasticSlider defaultValue={2700} startingValue={1800} maxValue={4000} isStepped stepSize={100} onChange={(v) => setK(Math.round(v))}
              leftIcon={<span className="slider-end">1800</span>} rightIcon={<span className="slider-end">4000</span>}
              formatValue={(v) => `${Math.round(v)} K, ${nameOf(Math.round(v))}`} thumbColor="#ecebe8" disabled={!count} ariaLabel={t('Цветовая температура', 'Colour temperature')} />
          </div>
        </div>
      </Pane>
    </section>
  );
}
