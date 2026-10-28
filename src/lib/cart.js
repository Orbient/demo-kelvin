// The request basket: the pieces a visitor has set aside from the product sheets, shared by the sheet,
// the basket pill and the request form.
let items = [];
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn(items));

export const getCart = () => items;
export const onCart = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export function addToCart(item) {
  items = [...items.filter((i) => i.key !== item.key), item];
  emit();
}
export function removeFromCart(key) {
  items = items.filter((i) => i.key !== key);
  emit();
}

// a product sheet opens from anywhere with the product's id and, if known, the rectangle its picture flies from
export const openProduct = (id, from) => window.dispatchEvent(new CustomEvent('kelvin:product', { detail: { id, from } }));
