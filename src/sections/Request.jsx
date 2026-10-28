import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Stepper, { Step } from '../components/rb/Stepper.jsx';
import LightRays from '../components/rb/LightRays.jsx';
import Lazy from '../components/Lazy.jsx';
import Roll from '../components/Roll.jsx';
import Pane from '../components/Pane.jsx';
import { getCart, onCart } from '../lib/cart.js';
import { trackLead } from '../lib/track.js';
import { t, money } from '../lib/i18n.js';

// The request: three short steps about the home, the light and how to reach you, sent from the page.
// With VITE_LEAD_WEBHOOK set (an n8n or CRM webhook) the answers are posted there; the demo build has
// none and only pretends to send. A letter with the same answers stays as the way to attach a plan.
// The answers are the option labels in the page's language; the estimate reads them by position.
const KINDS = [t('Квартира', 'Apartment'), t('Загородный дом', 'Country house'), t('Дача', 'Dacha'), t('Офис или студия', 'Office or studio')];
const STAGES = [t('Только план', 'Just a plan'), t('Идёт ремонт', 'Under renovation'), t('Готовый интерьер', 'Finished interior')];
const NEEDS = [t('Люстры', 'Chandeliers'), t('Подвесы', 'Pendants'), t('Бра', 'Sconces'), t('Торшеры и настольные', 'Floor and table lamps'), t('Уличный свет', 'Outdoor lights'), t('План света', 'Lighting plan'), t('Монтаж', 'Installation')];
const TONES = [t('Тёплый, 2700 K', 'Warm, 2700 K'), t('Нейтральный, 3000–4000 K', 'Neutral, 3000–4000 K'), t('Посоветуйте', 'Advise me')];
const BUDGETS = [t('До 150 тыс. ₽', 'Under $1,700'), t('150–400 тыс. ₽', '$1,700–4,400'), t('400 тыс. – 1 млн ₽', '$4,400–11,000'), t('Больше 1 млн ₽', 'Over $11,000')];
const CHANNELS = [t('Звонок', 'Call'), 'Telegram', 'WhatsApp', t('Почта', 'Email')];
const MAIL = 'svet@kelvin.studio';
const WEBHOOK = import.meta.env.VITE_LEAD_WEBHOOK;
const REPLY = { [CHANNELS[0]]: t('позвонит вам', 'will call you'), Telegram: t('напишет вам в Telegram', 'will message you on Telegram'), WhatsApp: t('напишет вам в WhatsApp', 'will message you on WhatsApp'), [CHANNELS[3]]: t('ответит вам на почту', 'will reply by email') };

const rub = money;

// a figure that rolls to its new value instead of jumping
function Num({ value, format = rub }) {
  const ref = useRef(null);
  const shown = useRef(value);
  useEffect(() => {
    const o = { v: shown.current };
    const t = gsap.to(o, { v: value, duration: 0.9, ease: 'power3.out', onUpdate: () => { shown.current = o.v; if (ref.current) ref.current.textContent = format(o.v); } });
    return () => t.kill();
  }, [value, format]);
  return <span ref={ref}>{format(value)}</span>;
}

// A rough estimate that follows the answers: points of light by area and rooms, fixtures by what is needed,
// whatever was set aside from the product sheets, fitting if asked. The plan is free over 150 000 ₽.
const PLAN = 12000;
const FIT = 3500;
function estimate({ area, rooms, needs, kind }, cart) {
  const points = Math.max(rooms * 3, Math.ceil(area / 12));
  const per = { [NEEDS[0]]: Math.ceil(rooms / 2) * 74000, [NEEDS[1]]: rooms * 38000, [NEEDS[2]]: rooms * 2 * 19000, [NEEDS[3]]: rooms * 31000, [NEEDS[4]]: (kind === KINDS[0] ? 0 : 6) * 9000 };
  const chosen = cart.reduce((s, i) => s + i.price, 0);
  const fixtures = Math.max(chosen, needs.reduce((s, n) => s + (per[n] || 0), 0));
  const fitting = needs.includes(NEEDS[6]) ? points * FIT : 0;
  const plan = fixtures + fitting >= 150000 ? 0 : PLAN;
  return { points, fixtures, fitting, plan, total: fixtures + fitting + plan };
}

const Sign = ({ plus }) => (
  <svg viewBox="0 0 16 16" aria-hidden="true"><path d={plus ? 'M2 8h12M8 2v12' : 'M2 8h12'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" /></svg>
);

function Chips({ label, options, value, onChange, multi = false }) {
  const on = (o) => (multi ? value.includes(o) : value === o);
  const toggle = (o) => onChange(multi ? (value.includes(o) ? value.filter((v) => v !== o) : [...value, o]) : o);
  return (
    <fieldset className="rq-field">
      <legend>{label}</legend>
      <div className="rq-chips">
        {options.map((o) => (
          <button key={o} type="button" className="chip" aria-pressed={on(o)} onClick={() => toggle(o)}>{o}</button>
        ))}
      </div>
    </fieldset>
  );
}

function Count({ label, value, onChange, min = 1, max = 12 }) {
  return (
    <div className="rq-field">
      <span className="rq-label" id="rq-rooms">{label}</span>
      <div className="rq-count" role="group" aria-labelledby="rq-rooms">
        <button type="button" className="chip chip-round" onClick={() => onChange(Math.max(min, value - 1))} aria-label={t('Меньше', 'Fewer')}><Sign /></button>
        <output aria-live="polite">{value}</output>
        <button type="button" className="chip chip-round" onClick={() => onChange(Math.min(max, value + 1))} aria-label={t('Больше', 'More')}><Sign plus /></button>
      </div>
    </div>
  );
}

export default function Request() {
  const [kind, setKind] = useState(KINDS[0]);
  const [area, setArea] = useState(85);
  const [rooms, setRooms] = useState(3);
  const [stage, setStage] = useState(STAGES[1]);
  const [needs, setNeeds] = useState([NEEDS[0], NEEDS[5]]);
  const [tone, setTone] = useState(TONES[0]);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState(CHANNELS[1]);
  const [note, setNote] = useState('');
  const [step, setStep] = useState(1);
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState('idle'); // idle | sending | sent | failed
  const [cart, setCart] = useState(getCart);
  useEffect(() => onCart(setCart), []);
  const est = estimate({ area, rooms, needs, kind }, cart);

  const phoneOk = phone.replace(/\D/g, '').length >= 10;
  const contactOk = name.trim().length > 1 && phoneOk;

  const letter = useMemo(() => [
    t('Здравствуйте! Хочу подобрать свет.', 'Hello! I would like help choosing the lighting.'),
    '',
    t(`Объект: ${kind}, ${area} м², комнат: ${rooms}`, `Property: ${kind}, ${area} m², rooms: ${rooms}`),
    `${t('Стадия', 'Stage')}: ${stage}`,
    `${t('Что нужно', 'Needed')}: ${needs.join(', ') || t('пока не знаю', 'not sure yet')}`,
    `${t('Оттенок', 'Warmth')}: ${tone}`,
    `${t('Бюджет', 'Budget')}: ${budget}`,
    cart.length ? `${t('Из каталога', 'From the collection')}: ${cart.map((i) => `${i.name} (${i.finish}, ${i.k} K)`).join(', ')}` : '',
    `${t('Ориентир сметы', 'Estimated total')}: ${rub(est.total)}`,
    '',
    `${t('Имя', 'Name')}: ${name}`,
    `${t('Телефон', 'Phone')}: ${phone}`,
    `${t('Как связаться', 'Preferred contact')}: ${channel}`,
    note ? `${t('Комментарий', 'Comment')}: ${note}` : '',
    '',
    t('План квартиры прикладываю к письму.', 'My floor plan is attached.'),
  ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n'), [kind, area, rooms, stage, needs, tone, budget, name, phone, channel, note]);
  const send = async () => {
    setSent('sending');
    const answers = { kind, area, rooms, stage, needs, tone, budget, name, phone, channel, note, cart, estimate: est.total, source: 'kelvin-demo' };
    // the studio owner hears about it in Telegram at once (see lib/track.js)
    trackLead({ ...answers, estimate: money(est.total) });
    try {
      if (WEBHOOK) {
        const r = await fetch(WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(answers) });
        if (!r.ok) throw new Error(String(r.status));
      } else {
        await new Promise((ok) => setTimeout(ok, 1400));
      }
      setSent('sent');
    } catch {
      setSent('failed');
    }
  };
  const restart = (e) => { e.preventDefault(); setSent('idle'); setStep(1); };
  const summary = [
    [t('Объект', 'Property'), t(`${kind}, ${area} м², комнат: ${rooms}`, `${kind}, ${area} m², rooms: ${rooms}`)],
    [t('Стадия', 'Stage'), stage],
    [t('Что нужно', 'Needed'), needs.join(', ') || t('пока не знаю', 'not sure yet')],
    [t('Оттенок', 'Warmth'), tone],
    [t('Бюджет', 'Budget'), budget],
    ...(cart.length ? [[t('Из каталога', 'From the collection'), cart.map((i) => i.name).join(', ')]] : []),
    [t('Смета', 'Estimate'), `${t('около', 'about')} ${rub(est.total)}`],
    [t('Связь', 'Contact'), `${channel}, ${phone}`],
  ];
  const mailto = `mailto:${MAIL}?subject=${encodeURIComponent(t(`Заявка на подбор света: ${kind}, ${area} м²`, `Lighting request: ${kind}, ${area} m²`))}&body=${encodeURIComponent(letter)}`;

  return (
    <section className="request" id="request" aria-labelledby="rq-h">
      {/* a lamp over the table: its cone of light falls on the form */}
      <Lazy className="rq-fx">
        <LightRays raysOrigin="top-center" raysColor="#ffd8a1" raysSpeed={0.6} lightSpread={0.55} rayLength={2.4} intensity={0.85} glow={0.5} haze={0.2}
          followMouse mouseInfluence={0.05} cursorShadow={false} clickPulse={false} maxDevicePixelRatio={1} />
      </Lazy>
      <div className="rq-intro">
        <h2 className="h2" id="rq-h" data-lines>{t('Посчитаем свет по\u00a0вашему дому', 'Let us plan the light for\u00a0your home')}</h2>
        <p>{t(`Три коротких шага. Через три дня пришлём план света по\u00a0комнатам со\u00a0светильниками и\u00a0сметой; расчёт бесплатный при\u00a0заказе от\u00a0${money(150000)}.`, `Three short steps. In three days we send a\u00a0room-by-room lighting plan with fixtures and\u00a0an estimate; the plan is free on\u00a0orders from\u00a0${money(150000)}.`)}</p>
        {/* the estimate, on glass under the lamp's cone; it follows every answer in the form */}
        <Pane className="rq-estimate">
          <p className="rq-est-k">{t('Ориентир сметы', 'Estimated total')}</p>
          <p className="rq-est-total"><Num value={est.total} /></p>
          <dl className="rq-est-rows">
            <div><dt>{t('Точек света', 'Points of light')}</dt><dd><Num value={est.points} format={(v) => String(Math.round(v))} /></dd></div>
            <div><dt>{t('Светильники', 'Fixtures')}{cart.length ? `: ${cart.map((i) => i.name).join(', ')}` : ''}</dt><dd><Num value={est.fixtures} /></dd></div>
            <div><dt>{t(`Монтаж, ${rub(FIT)} за точку`, `Installation, ${rub(FIT)} per point`)}</dt><dd>{est.fitting ? <Num value={est.fitting} /> : t('не нужен', 'not needed')}</dd></div>
            <div><dt>{t('План света по комнатам', 'Room-by-room lighting plan')}</dt><dd>{est.plan ? rub(est.plan) : <span className="rq-free"><s>{rub(PLAN)}</s> {t('бесплатно', 'free')}</span>}</dd></div>
            <div><dt>{t('Доставка по Москве', 'Delivery in Moscow')}</dt><dd>{t('бесплатно', 'free')}</dd></div>
          </dl>
        </Pane>
      </div>

      <div className="rq-form">
        <Stepper
          step={step}
          onStepChange={(s) => { setTouched(false); setStep(s); }}
          theme="dark"
          accentColor="#ffad47"
          radius={20}
          width={720}
          backButtonText={t('Назад', 'Back')}
          nextButtonText={t('Дальше', 'Next')}
          completeButtonText={t('Отправить заявку', 'Send request')}
          onFinalStepCompleted={() => { setStep(4); send(); }}
          nextButtonProps={step === 3 && !contactOk ? { 'aria-disabled': true, onClick: (e) => { e.preventDefault(); setTouched(true); } } : {}}
          completedContent={(
            <div className="rq-done" aria-live="polite" data-state={sent}>
              {sent === 'sending' && (
                <>
                  <p className="rq-done-title">{t('Отправляем…', 'Sending…')}</p>
                  <span className="rq-progress" aria-hidden="true"><span /></span>
                </>
              )}
              {sent === 'sent' && (
                <>
                  <p className="rq-done-title">{t('Заявка отправлена', 'Request sent')}</p>
                  <p className="rq-done-lede">{t('Спасибо', 'Thank you')}{name.trim() ? `, ${name.trim()}` : ''}. {t(`Светотехник ${REPLY[channel]} сегодня, а\u00a0план света по\u00a0комнатам пришлём через три дня.`, `A\u00a0lighting designer ${REPLY[channel]} today, and\u00a0the room-by-room plan follows in\u00a0three days.`)}</p>
                  <dl className="rq-summary">
                    {summary.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                  </dl>
                  <div className="rq-done-actions">
                    <a className="btn btn-ghost-dark" href={mailto}><Roll>{t('Приложить план письмом', 'Email us your plan')}</Roll></a>
                    <a className="btn btn-ghost-dark" href="#request" onClick={restart}><Roll>{t('Новая заявка', 'New request')}</Roll></a>
                  </div>
                </>
              )}
              {sent === 'failed' && (
                <>
                  <p className="rq-done-title">{t('Не получилось отправить', 'Could not send')}</p>
                  <p className="rq-done-lede">{t('Связь подвела. Ответы уже собраны в\u00a0письмо: отправьте его, и\u00a0мы ответим так же быстро.', 'The connection let us down. Your answers are already in\u00a0an email: send it, and\u00a0we will reply just as quickly.')}</p>
                  <div className="rq-done-actions">
                    <a className="btn" href={mailto}><Roll>{t('Отправить письмом', 'Send by email')}</Roll><span className="btn-dot" aria-hidden="true" /></a>
                    <a className="btn btn-ghost-dark" href="#request" onClick={(e) => { e.preventDefault(); send(); }}><Roll>{t('Попробовать ещё раз', 'Try again')}</Roll></a>
                  </div>
                </>
              )}
            </div>
          )}
        >
          <Step title={t('Дом', 'Home')} description={t('тип и площадь', 'type and size')}>
            <div className="rq-step">
              <Chips label={t('Что освещаем', 'What are we lighting')} options={KINDS} value={kind} onChange={setKind} />
              <div className="rq-row">
                <label className="rq-field">
                  <span className="rq-label">{t('Площадь, м²', 'Area, m²')}</span>
                  <input className="rq-input" type="number" inputMode="numeric" min="10" max="2000" value={area} onChange={(e) => setArea(Math.max(0, Number(e.target.value) || 0))} />
                </label>
                <Count label={t('Комнат', 'Rooms')} value={rooms} onChange={setRooms} />
              </div>
              <Chips label={t('Стадия', 'Stage')} options={STAGES} value={stage} onChange={setStage} />
            </div>
          </Step>
          <Step title={t('Свет', 'Light')} description={t('что и какой', 'what and how warm')}>
            <div className="rq-step">
              <Chips label={t('Что нужно', 'What you need')} options={NEEDS} value={needs} onChange={setNeeds} multi />
              <Chips label={t('Оттенок', 'Warmth')} options={TONES} value={tone} onChange={setTone} />
              <Chips label={t('Бюджет на свет', 'Lighting budget')} options={BUDGETS} value={budget} onChange={setBudget} />
            </div>
          </Step>
          <Step title={t('Контакты', 'Contact')} description={t('куда ответить', 'where to reply')}>
            <div className="rq-step">
              <div className="rq-row">
                <label className="rq-field">
                  <span className="rq-label">{t('Как вас зовут', 'Your name')}</span>
                  <input className="rq-input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={touched && name.trim().length < 2} placeholder={t('Анна', 'Anna')} />
                </label>
                <label className="rq-field">
                  <span className="rq-label">{t('Телефон', 'Phone')}</span>
                  <input className="rq-input" type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={touched && !phoneOk} aria-describedby="rq-phone-hint" placeholder={t('+7 900 000-00-00', '+44 20 0000 0000')} />
                </label>
              </div>
              {touched && !contactOk && <p className="rq-error" id="rq-phone-hint" role="alert">{t('Укажите имя и телефон из 10 цифр или больше, чтобы мы могли ответить.', 'Please enter your name and a phone number of at least 10 digits so we can get back to you.')}</p>}
              <Chips label={t('Как удобнее связаться', 'How should we reach you')} options={CHANNELS} value={channel} onChange={setChannel} />
              <label className="rq-field">
                <span className="rq-label">{t('Комментарий', 'Comment')}</span>
                <textarea className="rq-input rq-area" rows="3" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('Высота потолков, любимые лампы, сроки', 'Ceiling height, favourite lamps, timing')} />
              </label>
            </div>
          </Step>
        </Stepper>
          <dl className="rq-contacts">
            <div><dt>{t('Телефон', 'Phone')}</dt><dd><a href="tel:+74950002700">+7 495 000-27-00</a></dd></div>
            <div><dt>{t('Почта', 'Email')}</dt><dd><a href={`mailto:${MAIL}`}>{MAIL}</a></dd></div>
            <div><dt>{t('Шоурум', 'Showroom')}</dt><dd>{t('Москва, каждый день с\u00a011 до\u00a021', 'Moscow, daily from\u00a011:00 to\u00a021:00')}</dd></div>
          </dl>
      </div>
    </section>
  );
}
