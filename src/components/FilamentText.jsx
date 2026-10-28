import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// Letters made of filament. The word is drawn as a thin incandescent wire, letter after letter, the way a coil
// catches: a thread of current runs along each glyph, the glow around it stutters twice and settles, then the
// letters fill with warm light. The SVG scales with its box, so any name fits the width it is given.
// start: 'mount' | 'ready' (waits for the loader's kelvin:ready) | 'view' (when it scrolls into view)
export default function FilamentText({ text, className = '', start = 'mount', fill = '#ffd8a1', wire = '#fff1d6', glow = '#ffad47', fontFamily = 'Oranienbaum, serif', letterSpacing = -0.04 }) {
  const root = useRef(null);
  const measure = useRef(null);
  const [box, setBox] = useState(null);
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const FS = 200;

  // the viewBox hugs the word as the face draws it, with room for the glow
  useLayoutEffect(() => {
    let off = false;
    const fit = () => {
      if (off || !measure.current) return;
      const b = measure.current.getBBox();
      if (!b.width) return;
      const px = FS * 0.04;
      const py = FS * 0.06;
      setBox(`${(b.x - px).toFixed(1)} ${(b.y - py).toFixed(1)} ${(b.width + px * 2).toFixed(1)} ${(b.height + py * 2).toFixed(1)}`);
    };
    fit();
    document.fonts?.ready.then(fit);
    return () => { off = true; };
  }, [text, fontFamily]);

  useEffect(() => {
    const el = root.current;
    if (!el || !box) return undefined;
    const wires = el.querySelectorAll('.fl-wire');
    const halo = el.querySelector('.fl-halo');
    const body = el.querySelector('.fl-body');
    const done = () => { gsap.set(wires, { strokeDashoffset: 0 }); gsap.set(halo, { opacity: 0.55 }); gsap.set(body, { opacity: 1 }); };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { done(); return undefined; }
    const L = FS * 6;
    gsap.set(wires, { strokeDasharray: L, strokeDashoffset: L });
    gsap.set(halo, { opacity: 0 });
    gsap.set(body, { opacity: 0 });
    const tl = gsap.timeline({ paused: true })
      .to(wires, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', stagger: 0.09 }, 0)
      // the glow stutters as the coil catches, then holds
      .to(halo, { keyframes: [{ opacity: 0.9, duration: 0.06 }, { opacity: 0.15, duration: 0.07 }, { opacity: 0.8, duration: 0.05 }, { opacity: 0.25, duration: 0.09 }, { opacity: 1, duration: 0.35 }], ease: 'none' }, 0.55)
      .to(body, { opacity: 1, duration: 1.1, ease: 'power2.out' }, 1.35)
      .to(halo, { opacity: 0.55, duration: 1.2, ease: 'power2.out' }, 1.6);
    let io;
    const go = () => tl.play(0);
    if (start === 'ready') {
      if (window.__kelvinReady) go(); else window.addEventListener('kelvin:ready', go, { once: true });
    } else if (start === 'view') {
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { go(); io.disconnect(); } }, { threshold: 0.4 });
      io.observe(el);
    } else go();
    return () => { tl.kill(); io?.disconnect(); window.removeEventListener('kelvin:ready', go); };
  }, [box, start]);

  const chars = Array.from(text);
  const style = { fontFamily, fontSize: FS, letterSpacing: `${letterSpacing}em` };
  return (
    <svg ref={root} className={`filament ${className}`.trim()} viewBox={box || `0 0 ${FS * chars.length * 0.55} ${FS}`} aria-hidden="true" preserveAspectRatio="xMinYMid meet">
      <defs>
        <filter id={`fl-glow-${id}`} x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation={FS * 0.03} /></filter>
      </defs>
      <text ref={measure} x="0" y={FS * 0.8} style={{ ...style, visibility: 'hidden' }}>{text}</text>
      <text className="fl-halo" x="0" y={FS * 0.8} style={style} fill="none" stroke={glow} strokeWidth={FS * 0.035} filter={`url(#fl-glow-${id})`}>{text}</text>
      <text className="fl-body" x="0" y={FS * 0.8} style={style} fill={fill}>{text}</text>
      <text x="0" y={FS * 0.8} style={style} fill="none" stroke={wire} strokeWidth={FS * 0.008} strokeLinejoin="round">
        {chars.map((c, i) => <tspan key={i} className="fl-wire">{c}</tspan>)}
      </text>
    </svg>
  );
}
