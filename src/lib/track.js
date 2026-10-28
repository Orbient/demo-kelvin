// Tells the studio owner, through an n8n webhook and Telegram, that a demo link was opened, how far the visit
// went when it ended, and when a request was sent. Silent unless VITE_TRACK_WEBHOOK is set, and silent on
// localhost (so working on the site sends nothing) unless the address carries ?track=1. Beacons go as
// text/plain, which needs no CORS preflight and survives the page closing.
import { BRAND } from './brand.js';
import { products } from '../data.js';

const URL_ = import.meta.env.VITE_TRACK_WEBHOOK;
const local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
const on = Boolean(URL_) && (!local || new URLSearchParams(location.search).has('track'));
const sid = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
const t0 = Date.now();
const visit = { sheets: new Set(), tryOn: false, kelvin: false, room: false, reached: '', depth: 0 };
const lang = () => document.documentElement.lang || 'ru';

const send = (payload) => {
  if (!on) return;
  const body = JSON.stringify({ sid, brand: BRAND, lang: lang(), ...payload });
  const blob = new Blob([body], { type: 'text/plain;charset=UTF-8' });
  if (!navigator.sendBeacon?.(URL_, blob)) fetch(URL_, { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'text/plain;charset=UTF-8' } }).catch(() => {});
};

export function trackLead(answers) {
  send({ event: 'lead', answers });
}

export function startTracking() {
  if (!on) return;
  const w = window.innerWidth;
  let ref = '';
  try { ref = document.referrer ? new URL(document.referrer).hostname : ''; } catch { /* no referrer */ }
  send({ event: 'open', device: w < 768 ? 'phone' : w < 1100 ? 'tablet' : 'desktop', ref, host: location.host });

  // what the visitor did, read from the page's own events and controls
  window.addEventListener('kelvin:product', (e) => visit.sheets.add(products[e.detail?.id]?.name || e.detail?.id));
  document.addEventListener('click', (e) => {
    if (e.target.closest('.sheet-try-btn')) visit.tryOn = true;
    if (e.target.closest('.room-chip, .room-spot')) visit.room = true;
  });
  document.addEventListener('input', (e) => { if (e.target.closest('.kdial')) visit.kelvin = true; });

  // the furthest section reached, named by its heading
  const io = new IntersectionObserver((es) => es.forEach((en) => {
    if (!en.isIntersecting) return;
    const h = document.getElementById(en.target.getAttribute('aria-labelledby'));
    const top = en.target.getBoundingClientRect().top + window.scrollY;
    if (top >= visit.depthTop || visit.depthTop === undefined) { visit.depthTop = top; visit.reached = ((h?.querySelector('.sr') || h)?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60); }
  }), { threshold: 0.35 });
  document.querySelectorAll('section[aria-labelledby], aside[aria-labelledby]').forEach((s) => io.observe(s));
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    visit.depth = Math.max(visit.depth, max > 0 ? (window.scrollY / max) * 100 : 0);
  }, { passive: true });

  let left = false;
  const leave = () => {
    if (left) return;
    left = true;
    send({ event: 'leave', seconds: (Date.now() - t0) / 1000, reached: visit.reached, depth: visit.depth, sheets: [...visit.sheets], tryOn: visit.tryOn, kelvin: visit.kelvin, room: visit.room });
  };
  window.addEventListener('pagehide', leave);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && Date.now() - t0 > 15000) leave(); });
}
