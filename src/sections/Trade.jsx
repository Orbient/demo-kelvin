import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { t } from '../lib/i18n.js';

// For designers and architects. The drawing a lighting engineer reads first, the polar curve of luminous
// intensity, is drawn as the section arrives; beside it, the trade terms and the files a project needs.
const TERMS = [
  [t('Цены для бюро', 'Trade pricing'), t('Закрытый прайс и −15% от каталога на каждый объект, без минимальной суммы.', 'A private price list and 15% off the catalogue on every project, with no minimum order.')],
  [t('Файлы для проекта', 'Project files'), t('3D-модели, IES-файлы света и паспорта на каждый светильник коллекции.', '3D models, IES photometric files and data sheets for every fixture in the collection.')],
  [t('Расчёт в DIALux', 'DIALux calculations'), t('Освещённость по вашему плану за три дня, с подбором оттенка под отделку.', 'Light levels for your plan in three days, with the colour temperature matched to the finishes.')],
  [t('Тёмная комната для заказчика', 'A dark room for your client'), t('Приводите клиента вечером: включим всё, что вы выбрали, и сравним.', 'Bring your client in the evening: we switch on everything you have chosen and compare.')],
];
const FILES = [[t('Мста · IES, 3D', 'Msta · IES, 3D'), t('4,2 МБ', '4.2 MB')], [t('Коллекция «Реки» · 3D-модели', 'Rivers collection · 3D models'), t('86 МБ', '86 MB')], [t('Паспорта и сертификаты', 'Data sheets and certificates'), t('12 МБ', '12 MB')], [t('Прайс для бюро', 'Trade price list'), t('по запросу', 'on request')]];

// a candela distribution like a chandelier's: wide, soft, a little light thrown upward
const curve = (() => {
  const pts = [];
  for (let a = 0; a <= 180; a += 5) {
    const t = (a * Math.PI) / 180;
    const down = Math.pow(Math.cos(t / 2), 1.6);
    const r = 40 + 210 * (0.55 * down + 0.35 * Math.pow(Math.sin(t), 2) * (a < 90 ? 1 : 0.55));
    pts.push([r * Math.sin(t), r * Math.cos(t)]);
  }
  const half = pts.map(([x, y]) => `${(300 + x).toFixed(1)} ${(300 + y).toFixed(1)}`);
  const mirror = [...pts].reverse().map(([x, y]) => `${(300 - x).toFixed(1)} ${(300 + y).toFixed(1)}`);
  return `M ${half.join(' L ')} L ${mirror.join(' L ')} Z`;
})();

export default function Trade() {
  const root = useRef(null);

  useEffect(() => {
    const path = root.current.querySelector('.tr-curve');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
    const st = ScrollTrigger.create({
      trigger: root.current, start: 'top 65%', once: true,
      onEnter: () => gsap.timeline()
        .to(path, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.inOut' })
        .to(path, { fillOpacity: 1, duration: 1.2, ease: 'power1.out' }, '-=0.6')
        .fromTo(root.current.querySelectorAll('.tr-terms li'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'lux' }, 0.2),
    });
    return () => st.kill();
  }, []);

  return (
    <section ref={root} className="trade" id="trade" aria-labelledby="tr-h">
      <div className="tr-copy">
        <h2 className="h2" id="tr-h" data-lines>{t('Дизайнерам и\u00a0архитекторам', 'For designers and\u00a0architects')}</h2>
        <p data-rise>{t('Работаем с\u00a0бюро напрямую: цены для профессионалов, файлы для проекта и\u00a0свет, который заказчик увидит до\u00a0сдачи объекта.', 'We work with\u00a0studios directly: trade pricing, project files and\u00a0light your client can see before the\u00a0handover.')}</p>
        <ol className="tr-terms">
          {TERMS.map(([k, v], i) => (
            <li key={k}><span className="tr-n">{String(i + 1).padStart(2, '0')}</span><b>{k}</b><span>{v}</span></li>
          ))}
        </ol>
      </div>
      <div className="tr-side">
        <figure className="tr-diagram">
          <svg viewBox="0 0 600 600" role="img" aria-label={t('Кривая силы света люстры «Мста»: широкое мягкое распределение с частью света вверх', 'Luminous intensity curve of the Msta chandelier: a wide, soft spread with some light thrown upward')}>
            {[60, 120, 180, 240].map((r) => <circle key={r} className="tr-grid" cx="300" cy="300" r={r} />)}
            {Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; return <line key={i} className="tr-grid" x1="300" y1="300" x2={300 + Math.cos(a) * 250} y2={300 + Math.sin(a) * 250} />; })}
            {[0, 30, 60, 90].map((d) => <text key={d} className="tr-deg" x={300 + Math.sin((d * Math.PI) / 180) * 266} y={304 + Math.cos((d * Math.PI) / 180) * 266} textAnchor="middle">{d}°</text>)}
            <path className="tr-curve" d={curve} />
          </svg>
          <figcaption>{t('Кривая силы света «Мсты», кд/клм. Такая же есть в\u00a0IES-файле каждого светильника.', 'Luminous intensity curve of\u00a0the Msta, cd/klm. Every fixture has one in\u00a0its IES file.')}</figcaption>
        </figure>
        <ul className="tr-files">
          {FILES.map(([n, size]) => (
            <li key={n}><a href="#request"><span>{n}</span><span className="tr-size">{size}</span><span className="tr-get" aria-hidden="true">↓</span></a></li>
          ))}
        </ul>
        <a className="tr-cta" href="#request">{t('Получить доступ к\u00a0библиотеке', 'Get access to\u00a0the library')}</a>
      </div>
    </section>
  );
}
