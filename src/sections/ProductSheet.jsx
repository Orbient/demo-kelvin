import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Pane from '../components/Pane.jsx';
import { products, finishes } from '../data.js';
import { addToCart, getCart, onCart } from '../lib/cart.js';
import { tintOf } from '../lib/kelvin.js';
import { t, money } from '../lib/i18n.js';

const KELVINS = [[2200, t('как закат', 'sunset')], [2700, t('как лампа накаливания', 'incandescent')], [3000, t('тёплый белый', 'warm white')]];
// the room the lamp is tried in until the visitor brings their own photograph
const ROOM = '/assets/img/room-off.jpg';
const rub = money;

// The product sheet. The picture you pressed lifts off the page and flies to its place in the sheet, the
// words arrive under it, and the light can be tried in three shades on a strip of glass over the photograph.
export default function ProductSheet() {
  const [state, setState] = useState(null); // { id, from }
  const [k, setK] = useState(2700);
  const [finish, setFinish] = useState('brass');
  const [inCart, setInCart] = useState(false);
  const [tryOn, setTryOn] = useState(false);
  const [room, setRoom] = useState(ROOM);
  const [spot, setSpot] = useState({ x: 50, y: 34, s: 0.42 });
  const drag = useRef(null);
  const root = useRef(null);
  const media = useRef(null);
  const closeBtn = useRef(null);
  const opener = useRef(null);
  const p = state ? products[state.id] : null;

  useEffect(() => {
    const open = (e) => {
      if (!products[e.detail.id]) return;
      opener.current = document.activeElement;
      setK(2700);
      setFinish('brass');
      setInCart(getCart().some((i) => i.key === e.detail.id));
      setTryOn(false);
      setSpot({ x: 50, y: 34, s: 0.42 });
      setState(e.detail);
    };
    window.addEventListener('kelvin:product', open);
    return () => window.removeEventListener('kelvin:product', open);
  }, []);

  useEffect(() => (state ? onCart((items) => setInCart(items.some((i) => i.key === state.id))) : undefined), [state]);

  const close = () => {
    if (!root.current) return;
    const done = () => { setState(null); window.__lenis?.start(); opener.current?.focus?.({ preventScroll: true }); };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { done(); return; }
    gsap.timeline({ onComplete: done })
      .to(root.current.querySelectorAll('[data-in]'), { autoAlpha: 0, y: -16, duration: 0.25, stagger: 0.02, ease: 'power2.in' }, 0)
      .to(media.current, { autoAlpha: 0, scale: 0.96, duration: 0.4, ease: 'power2.in' }, 0)
      .to(root.current, { autoAlpha: 0, duration: 0.35 }, 0.15);
  };

  useEffect(() => {
    if (!state) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // the flight: a copy of the picture leaves the rectangle it was pressed in and settles into the sheet
  useLayoutEffect(() => {
    if (!state || !root.current) return undefined;
    window.__lenis?.stop();
    closeBtn.current?.focus({ preventScroll: true });
    const words = root.current.querySelectorAll('[data-in]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const to = media.current.getBoundingClientRect();
    const from = state.from || { left: to.left + to.width * 0.3, top: to.top + to.height * 0.3, width: to.width * 0.4, height: to.height * 0.4 };
    const fly = document.createElement('div');
    fly.className = 'sheet-fly';
    fly.style.backgroundImage = `url(${p.image})`;
    document.body.appendChild(fly);
    const tl = gsap.timeline({ onComplete: () => fly.remove() });
    tl.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, 0)
      .set(media.current, { autoAlpha: 0 }, 0)
      .fromTo(fly, { left: from.left, top: from.top, width: from.width, height: from.height, borderRadius: 18 },
        { left: to.left, top: to.top, width: to.width, height: to.height, borderRadius: 28, duration: 0.95, ease: 'silk' }, 0)
      .set(media.current, { autoAlpha: 1 }, 0.95)
      .to(fly, { autoAlpha: 0, duration: 0.2 }, 0.95)
      .fromTo(words, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.05, ease: 'lux' }, 0.35);
    return () => { tl.kill(); fly.remove(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // trying the lamp at home: the visitor's photograph stays in the browser (an object URL), the lamp is
  // screened onto it so its dark backdrop drops away, and it is moved by dragging and sized by the slider
  const upload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (room !== ROOM) URL.revokeObjectURL(room);
    setRoom(URL.createObjectURL(f));
  };
  const down = (e) => {
    const box = media.current.getBoundingClientRect();
    drag.current = { box, dx: e.clientX - (box.left + (spot.x / 100) * box.width), dy: e.clientY - (box.top + (spot.y / 100) * box.height) };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e) => {
    const d = drag.current;
    if (!d) return;
    const x = ((e.clientX - d.dx - d.box.left) / d.box.width) * 100;
    const y = ((e.clientY - d.dy - d.box.top) / d.box.height) * 100;
    setSpot((s) => ({ ...s, x: Math.min(95, Math.max(5, x)), y: Math.min(95, Math.max(5, y)) }));
  };
  const up = () => { drag.current = null; };

  if (!p) return null;
  const add = () => {
    addToCart({ key: state.id, name: p.name, kind: p.kind, price: p.price, finish: finishes.find((f) => f[0] === finish)[1], k });
  };

  return (
    <div ref={root} className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-h">
      <div className="sheet-back" onClick={close} aria-hidden="true" />
      <div className="sheet-body">
        <figure ref={media} className="sheet-media">
          {tryOn ? (
            <div className="sheet-try">
              <img className="sheet-room" src={room} alt={t('Комната, в которой примеряют светильник', 'The room the lamp is being tried in')} />
              <div className="sheet-lamp" style={{ left: `${spot.x}%`, top: `${spot.y}%`, width: `${spot.s * 100}%` }}
                onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} role="img" aria-label={`${p.name}: ${t('перетащите, чтобы поставить', 'drag to place')}`}>
                <span className="sheet-lamp-glow" aria-hidden="true" />
                <img src={p.image} alt="" draggable={false} />
              </div>
              <div className="sheet-try-bar">
                <label className="sheet-chip sheet-upload">{t('Своё фото', 'Your photo')}<input type="file" accept="image/*" onChange={upload} /></label>
                <label className="sheet-size">{t('Размер', 'Size')}<input type="range" min="0.2" max="0.9" step="0.01" value={spot.s} onChange={(e) => setSpot((s) => ({ ...s, s: Number(e.target.value) }))} /></label>
                <button type="button" className="sheet-chip" onClick={() => setTryOn(false)}>{t('Готово', 'Done')}</button>
              </div>
            </div>
          ) : <img src={p.image} alt={p.alt} />}
          <div className="sheet-tint" aria-hidden="true" style={{ background: `rgb(${tintOf(k).join(',')})` }} />
          <Pane className="sheet-kelvin">
            <span className="sheet-kelvin-label">{t('Оттенок', 'Warmth')}</span>
            {KELVINS.map(([v, name]) => (
              <button key={v} type="button" className="sheet-chip" aria-pressed={k === v} title={name} onClick={() => setK(v)}>{v} K</button>
            ))}
          </Pane>
        </figure>
        <div className="sheet-info">
          <p className="sheet-kind" data-in>{p.kind}</p>
          <h2 className="sheet-name" id="sheet-h" data-in>{p.name}</h2>
          <p className="sheet-story" data-in>{p.story}</p>
          <dl className="sheet-spec" data-in>
            {p.spec.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}
          </dl>
          <div className="sheet-finish" data-in role="group" aria-label={t('Отделка', 'Finish')}>
            {finishes.map(([id, name, color]) => (
              <button key={id} type="button" className="sheet-chip sheet-chip--finish" aria-pressed={finish === id} onClick={() => setFinish(id)}>
                <span style={{ background: color }} aria-hidden="true" />{name}
              </button>
            ))}
          </div>
          <div className="sheet-buy" data-in>
            <p className="sheet-price">{t('от', 'from')}&nbsp;{rub(p.price)}</p>
            <button type="button" className="sheet-try-btn" onClick={() => setTryOn(true)} aria-pressed={tryOn}>{t('Примерить у себя', 'Try it at home')}</button>
            <button type="button" className="sheet-add" onClick={add} aria-pressed={inCart}>{inCart ? t('Уже в заявке', 'In your request') : t('Добавить в заявку', 'Add to request')}</button>
          </div>
        </div>
        <button ref={closeBtn} type="button" className="sheet-close" onClick={close} aria-label={t('Закрыть', 'Close')}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>
  );
}
