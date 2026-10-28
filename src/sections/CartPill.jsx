import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Pane from '../components/Pane.jsx';
import { onCart, removeFromCart } from '../lib/cart.js';
import { t, money } from '../lib/i18n.js';

const rub = money;

// What has been set aside, on a pill of glass at the foot of the screen, with the way to the request.
export default function CartPill() {
  const [items, setItems] = useState([]);
  const ref = useRef(null);
  useEffect(() => onCart(setItems), []);
  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, items.length ? { autoAlpha: 1, y: 0, duration: 0.7, ease: 'silk' } : { autoAlpha: 0, y: 40, duration: 0.4, ease: 'power2.in' });
  }, [items.length]);
  const total = items.reduce((s, i) => s + i.price, 0);
  return (
    <div ref={ref} className="cart" aria-live="polite" style={{ visibility: 'hidden', opacity: 0 }}>
      <Pane className="cart-glass">
        <ul className="cart-items">
          {items.map((i) => (
            <li key={i.key}><span>{i.name}</span><button type="button" onClick={() => removeFromCart(i.key)} aria-label={t(`Убрать «${i.name}» из заявки`, `Remove ${i.name} from the request`)}>×</button></li>
          ))}
        </ul>
        <span className="cart-total">{rub(total)}</span>
        <a className="cart-go" href="#request">{t('Оформить заявку', 'Send request')}</a>
      </Pane>
    </div>
  );
}
