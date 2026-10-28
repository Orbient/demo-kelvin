// A clip cut into JPEG frames, drawn to a canvas by scroll position (cover fit, focus point on x).
// Between two frames the next one is laid over the current at the fractional position, so the scrub
// reads as continuous footage instead of a slideshow stepping from frame to frame.
const framePath = (dir, i) => `${dir}/${String(i + 1).padStart(3, '0')}.jpg`;

export function frameSequence(canvas, { dir, count, focus = 0.5, start = 0 }) {
  const g = canvas.getContext('2d');
  const frames = new Array(count);
  const state = { f: start };
  const ready = (i) => frames[i]?.complete && frames[i].naturalWidth;

  const nearest = (i) => {
    for (let j = i; j >= 0; j--) if (ready(j)) return frames[j];
    for (let j = i + 1; j < count; j++) if (ready(j)) return frames[j];
    return null;
  };
  const paint = (img, alpha) => {
    const s = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    g.globalAlpha = alpha;
    g.drawImage(img, (canvas.width - w) * focus, (canvas.height - h) / 2, w, h);
  };
  const draw = () => {
    const f = Math.min(Math.max(state.f, 0), count - 1);
    const i = Math.floor(f);
    const t = f - i;
    const base = nearest(i);
    if (!base) return;
    paint(base, 1);
    if (t > 0.02 && ready(i + 1)) paint(frames[i + 1], t);
    g.globalAlpha = 1;
  };
  const size = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    g.imageSmoothingQuality = 'high';
    draw();
  };

  // the frame on screen first, the last one next, then the rest in order
  const first = Math.round(start);
  const order = [first, count - 1, ...Array.from({ length: count }, (_, i) => i).filter((i) => i !== first && i !== count - 1)];
  const loaded = { n: 0 };
  const done = new Promise((resolve) => {
    for (const i of order) {
      const img = new Image();
      img.decoding = 'async';
      const settle = () => {
        loaded.n += 1;
        if (Math.abs(Math.floor(state.f) - i) < 2) draw();
        if (loaded.n === count) resolve();
      };
      img.onload = settle;
      img.onerror = settle;
      img.src = framePath(dir, i);
      frames[i] = img;
    }
  });
  size();
  window.addEventListener('resize', size);

  return { state, draw, loaded, done, destroy: () => window.removeEventListener('resize', size) };
}
