import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

import Prologue from './sections/Prologue.jsx';
import Manifesto from './sections/Manifesto.jsx';
import Chandelier from './sections/Chandelier.jsx';
import Room from './sections/Room.jsx';
import Loader from './sections/Loader.jsx';
import Request from './sections/Request.jsx';
import SideRays from './components/rb/SideRays.jsx';
import StarBorder from './components/rb/StarBorder.jsx';
import Lazy from './components/Lazy.jsx';
import FilamentText from './components/FilamentText.jsx';
import DappledLight from './components/DappledLight.jsx';
import { playWhileOnScreen } from './lib/media.js';
import DuskFilm from './sections/DuskFilm.jsx';
import Vitrine from './sections/Vitrine.jsx';
import Process from './sections/Process.jsx';
import LightMap from './sections/LightMap.jsx';
import Trade from './sections/Trade.jsx';
import ProductSheet from './sections/ProductSheet.jsx';
import CartPill from './sections/CartPill.jsx';
import { BRAND } from './lib/brand.js';
import { LANG, t, setLang } from './lib/i18n.js';
import { LogoMark, faviconHref } from './components/Logo.jsx';
import { duskToday } from './lib/daytime.js';
import { kRGB, tintOf } from './lib/kelvin.js';
import StaggeredMenu from './components/rb/StaggeredMenu.jsx';
import Magnet from './components/rb/Magnet/Magnet.jsx';
import Pane from './components/Pane.jsx';
import { menu, socials } from './data.js';
import Roll from './components/Roll.jsx';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function useSmoothScroll() {
  useEffect(() => {
    if (reduced() || window.matchMedia('(pointer: coarse)').matches) return undefined;
    const lenis = new Lenis({ lerp: 0.07, smoothWheel: true, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add('is-smooth');
    window.__lenis = lenis;
    return () => { gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
}

// Looping films play, and hold a decoder, only while they are on screen (see lib/media.js).
function useOnScreenVideos() {
  useEffect(() => {
    const stops = [...document.querySelectorAll('video[autoplay]')].map((v) => playWhileOnScreen(v));
    return () => stops.forEach((stop) => stop());
  }, []);
}

// Each kind of thing arrives its own way, once. Headings: words tip up out of their line. Running text:
// the lines surface slowly, light first, while the block drifts up. Pictures: a curtain opens across them
// while the picture inside settles from a slight zoom.
function useArrivals(scope) {
  useGSAP(() => {
    if (reduced()) return;
    gsap.utils.toArray('[data-lines]').forEach((el) => {
      const split = SplitText.create(el, { charsClass: 'char', wordsClass: 'word', linesClass: 'line', type: 'lines,words', mask: 'lines', aria: 'auto' });
      gsap.set(split.words, { transformOrigin: '0% 100%' });
      gsap.from(split.words, { yPercent: 170, rotate: 12, duration: 1.1, ease: 'lux', stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
    gsap.utils.toArray('[data-rise]').forEach((el) => {
      const lines = el.matches('p') ? SplitText.create(el, { charsClass: 'char', wordsClass: 'word', linesClass: 'line', type: 'lines', aria: 'auto' }).lines : el.children;
      const st = { trigger: el, start: 'top 92%', once: true };
      gsap.from(lines, { opacity: 0.12, duration: 1.8, ease: 'power1.out', stagger: 0.1, scrollTrigger: st });
      gsap.from(el, { y: 50, duration: 2, ease: 'power2.out', scrollTrigger: st });
    });
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      const st = { trigger: el, start: 'top 85%', once: true };
      gsap.fromTo(el, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'silk', scrollTrigger: st });
      gsap.fromTo(el.firstElementChild, { scale: 1.15 }, { scale: 1, duration: 1.6, ease: 'silk', scrollTrigger: st });
    });
  }, { scope });
}
// The whole page under one lamp: a dimmer in the header sets the colour temperature from candle to cool
// white, and a multiply layer over the page shifts every film, photograph and letter with it. At 2700 K the
// layer is switched off, so the page pays nothing for it.
function KelvinDial() {
  const [k, setK] = useState(2700);
  const tint = useRef(null);
  useEffect(() => {
    const el = document.createElement('div');
    el.className = 'kelvin-tint';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    tint.current = el;
    return () => el.remove();
  }, []);
  useEffect(() => {
    const el = tint.current;
    if (!el) return;
    el.style.display = k === 2700 ? 'none' : 'block';
    el.style.backgroundColor = `rgb(${tintOf(k).join(',')})`;
  }, [k]);
  const dot = `rgb(${kRGB(k).map(Math.round).join(',')})`;
  return (
    <label className="kdial" title={t('Оттенок всего сайта', 'Colour temperature of the whole site')}>
      <span className="kdial-dot" style={{ background: dot, boxShadow: `0 0 12px ${dot}` }} aria-hidden="true" />
      <input type="range" min="1800" max="4000" step="100" value={k} aria-label={t('Оттенок света на всём сайте, кельвины', 'Light colour across the whole site, in kelvins')}
        onChange={(e) => setK(Number(e.target.value))} onDoubleClick={() => setK(2700)} />
      <output>{k}&nbsp;K</output>
    </label>
  );
}

// The other language, one press away: the page reloads in it and keeps the rest of the address.
function LangSwitch() {
  const other = LANG === 'en' ? 'ru' : 'en';
  return (
    <button type="button" className="lang-switch" onClick={() => setLang(other)}
      aria-label={t('Переключить сайт на английский', 'Switch the site to Russian')}>{other.toUpperCase()}</button>
  );
}


// Between rooms the light goes down and comes up again. One veil of black is fixed over the screen; its
// opacity follows the nearest seam between two reading sections, so as a seam crosses the middle of the
// screen the page dims, then the next room is lit. One layer for the whole page, moved by opacity alone.
function useVeil(scope) {
  useEffect(() => {
    if (reduced()) return undefined;
    const veil = document.createElement('div');
    veil.className = 'veil';
    veil.setAttribute('aria-hidden', 'true');
    document.body.appendChild(veil);
    let seams = [];
    const measure = () => {
      seams = gsap.utils.toArray(':scope > section:not(.scene)', scope.current).map((s) => s.getBoundingClientRect().top + window.scrollY);
    };
    let raf = 0;
    let last = -1;
    const paint = () => {
      raf = 0;
      const mid = window.scrollY + window.innerHeight / 2;
      const reach = window.innerHeight * 0.28;
      const near = seams.reduce((m, y) => Math.min(m, Math.abs(y - mid)), Infinity);
      const t = Math.max(0, 1 - near / reach);
      const o = Math.round(0.45 * t * t * (3 - 2 * t) * 100) / 100;
      if (o !== last) { veil.style.opacity = String(o); last = o; }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const onRefresh = () => { measure(); onScroll(); };
    ScrollTrigger.addEventListener('refresh', onRefresh);
    window.addEventListener('scroll', onScroll, { passive: true });
    measure();
    paint();
    return () => { ScrollTrigger.removeEventListener('refresh', onRefresh); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); veil.remove(); };
  }, [scope]);
}

// The page's rooms, in the glass bar. A soft pill of light sits under the room you are in and slides to the
// next one as you scroll; the full list with contacts stays behind «Меню».
const NAV = menu.filter((m) => m.link !== '#request');

function HeaderNav() {
  const nav = useRef(null);
  const pill = useRef(null);
  const [active, setActive] = useState(-1);
  useEffect(() => {
    let raf = 0;
    const sync = () => {
      raf = 0;
      const mid = window.innerHeight * 0.45;
      setActive(NAV.findIndex((m) => {
        const r = document.querySelector(m.link)?.getBoundingClientRect();
        return r && r.top <= mid && r.bottom >= mid;
      }));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(sync); };
    window.addEventListener('scroll', onScroll, { passive: true });
    sync();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  useEffect(() => {
    const link = active >= 0 ? nav.current?.children[active + 1] : null;
    if (!pill.current) return;
    if (!link) { gsap.to(pill.current, { autoAlpha: 0, duration: 0.3 }); return; }
    const first = gsap.getProperty(pill.current, 'autoAlpha') < 0.1;
    gsap.to(pill.current, { x: link.offsetLeft, width: link.offsetWidth, autoAlpha: 1, duration: first ? 0 : 0.6, ease: 'silk' });
  }, [active]);
  return (
    <nav ref={nav} className="hdr-nav" aria-label={t('Разделы', 'Sections')}>
      <span ref={pill} className="hdr-nav-pill" aria-hidden="true" />
      {NAV.map((m, i) => (
        <a key={m.link} href={m.link} aria-current={i === active ? 'true' : undefined}><Roll>{m.label}</Roll></a>
      ))}
    </nav>
  );
}

function Header() {
  const ref = useRef(null);
  // the tab carries the mark too
  useEffect(() => { document.querySelector('link[rel="icon"]')?.setAttribute('href', faviconHref()); }, []);
  // a bar under the header once past the first screen, over every section. Measured live on every
  // frame of scroll, so the pins and the stacked cards can never leave it stale.
  useEffect(() => {
    let raf = 0;
    const sync = () => {
      raf = 0;
      const over = [...document.querySelectorAll('[data-cine]')].some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= 36 && r.bottom >= 36;
      });
      ref.current?.classList.toggle('is-solid', window.scrollY > window.innerHeight * 0.5);
      ref.current?.classList.toggle('over-cine', over);
      ref.current?.classList.toggle('at-top', window.scrollY < window.innerHeight * 0.5);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(sync); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    sync();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);
  // a link in the open menu closes it
  useEffect(() => {
    const onClick = (e) => {
      if (!e.target.closest('.sm-panel-item')) return;
      document.querySelector('.sm-toggle')?.click();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return (
    <header ref={ref} className="site-header">
      {/* the bar under the header once past the first screen: a flat soot pill with a warm hairline */}
      <div className="hdr-glass" aria-hidden="true" />
      <a className="mark" href="#top" aria-label={`${BRAND}, ${t('наверх', 'back to top')}`}><LogoMark /><span>{BRAND}</span></a>
      <HeaderNav />
      <div className="hdr-right">
      <LangSwitch />
      <KelvinDial />
      <Magnet padding={50} magnetStrength={5}>
        <StarBorder as="a" href="#request" className="hdr-cta" radius={999} thickness={1} duration={5} trailLength={0.35} glow={0.8}
          color="#ffad47" trailColor="#ffd8a1" backgroundColor="#0d0c0b" textColor="#ecebe8" borderColor="rgba(255, 216, 161, 0.18)">
          <Roll>{t('Подобрать свет', 'Find your light')}</Roll>
        </StarBorder>
      </Magnet>
      </div>
    </header>
  );
}

export default function App() {
  const main = useRef(null);
  useSmoothScroll();
  useOnScreenVideos();
  useArrivals(main);
  useVeil(main);

  return (
    <>
      <Loader onDone={() => { window.__kelvinReady = true; window.dispatchEvent(new Event('kelvin:ready')); }} />
      <a className="sr skip" href="#main">{t('К содержанию', 'Skip to content')}</a>
      <Header />
      <ProductSheet />
      <CartPill />
      <StaggeredMenu
        className="kelvin-menu"
        position="right"
        isFixed
        items={menu}
        socialItems={socials}
        displaySocials
        displayItemNumbering={false}
        colors={['#2a2520', '#ffad47']}
        accentColor="#ffad47"
        menuButtonColor="#ecebe8"
        openMenuButtonColor="#ecebe8"
        changeMenuColorOnOpen
        logoUrl="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E"
      />

      <main id="main" ref={main}>
        <Prologue />

        {/* a statement that lights word by word while the bulb beside it comes up */}
        <Manifesto />

        <Chandelier />

        {/* the collection: the kinds run along a curve of light, then the pieces on a bent rail */}
        {/* the collection: eight lamps in the dark, the one in the middle is on */}
        <Vitrine />

        <Room />

        {/* the dacha: the frame grows to the whole screen as dusk falls and the house lights up window by window */}
        <section className="dacha" id="dacha" aria-labelledby="dacha-h">
          {/* evening sun through the pines, falling on the heading */}
          <Lazy className="dacha-fx"><DappledLight /></Lazy>
          <div className="dacha-head wrap">
            <h2 className="h2" id="dacha-h" data-lines>{t('Свет на\u00a0даче', 'Light at the\u00a0dacha')}</h2>
            <p data-rise>{t('Фонари и\u00a0бра для веранды работают от\u00a0−40 до\u00a0+40\u00a0°C. Мы держали их на\u00a0улице всю прошлую зиму под Звенигородом.', 'Our veranda lanterns and sconces work from\u00a0−40 to\u00a0+40\u00a0°C. We left them outdoors all last winter near Zvenigorod.')}</p>
          </div>
          <DuskFilm>
            <p className="statement">{t('Веранда загорается сама, когда темнеет.', 'The veranda lights up by itself as night falls.')}</p>
            <p>{t(`Датчик сумерек включает фонари сам. Сегодня в\u00a0Подмосковье это случится около ${duskToday}.`, `A dusk sensor switches the lanterns on. Outside Moscow today, that happens at about ${duskToday}.`)}</p>
          </DuskFilm>
        </section>

        {/* where the light already burns */}
        <LightMap />

        {/* how it works: four steps strung on a filament */}
        <Process />


        {/* for designers and architects */}
        <Trade />

        <Request />
      </main>

      <footer className="site-footer">
        {/* the last light of the page falls from the corner onto the name */}
        <Lazy className="footer-fx">
          <SideRays rayColor1="#ffad47" rayColor2="#ffd8a1" origin="top-right" speed={1.2} intensity={1.2} spread={1.6} density={4} falloff={1.8}
            glow={0.8} followMouse mouseInfluence={0.25} maxDevicePixelRatio={1} opacity={0.8} />
        </Lazy>
        <h2 className="sr">{BRAND}</h2>
        <FilamentText text={BRAND} className="footer-name" start="view" />
        <div className="footer-row">
          <ul className="places">
            <li><a href="#request">{t('Шоурум, Москва', 'Showroom, Moscow')}</a></li>
            <li><a href="#request">{t('Мастерская, Тверь', 'Workshop, Tver')}</a></li>
            <li><a href="mailto:svet@kelvin.studio">svet@kelvin.studio</a></li>
          </ul>
          <p className="legal">© 2026 {BRAND}. {t('Демо-проект Orbient: товары, цены и\u00a0адреса — образец. Фото и\u00a0видео: Unsplash, Pexels, авторы в\u00a0', 'An Orbient demo: products, prices and\u00a0addresses are samples. Photos and\u00a0video: Unsplash, Pexels, authors in\u00a0the\u00a0')}<a href="/credits.html">{t('списке', 'credits')}</a>.</p>
          <a className="link" href="#top">{t('Наверх', 'Back to top')}</a>
        </div>
      </footer>

      {/* the last screen says who made the page, for the company it was sent to */}
      <aside className="made" aria-labelledby="made-h">
        <p className="made-k">{t('Демо-проект студии Orbient', 'A demo by Orbient studio')}</p>
        <h2 className="made-h" id="made-h" data-lines>{t('Такой сайт можно сделать для\u00a0вашего света', 'A site like this, built for\u00a0your light')}</h2>
        <p className="made-p" data-rise>{t('Сцены, которые включаются от\u00a0скролла, тёмная комната, карточки товаров с\u00a0оттенками и\u00a0смета, которая считает заявку сама. Соберём под вашу коллекцию, с\u00a0вашими фото и\u00a0каталогом.', 'Scenes that light up as you scroll, a dark room, product sheets with colour temperatures and\u00a0an estimate that prices each request by itself. Built around your collection, with\u00a0your photography and\u00a0catalogue.')}</p>
        <div className="made-go">
          <a className="made-btn" href="https://t.me/Orbient_Support_Bot" target="_blank" rel="noopener"><Roll>{t('Обсудить в Telegram', 'Talk on Telegram')}</Roll></a>
          <a className="link" href="mailto:dmitry@orbient.pro">dmitry@orbient.pro</a>
          <a className="link" href="https://orbient.pro" target="_blank" rel="noopener">orbient.pro</a>
        </div>
      </aside>
    </>
  );
}
