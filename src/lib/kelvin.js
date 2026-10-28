// Kelvin to RGB (Tanner Helland's fit), and the same as a multiply tint relative to 2700 K.
export const kRGB = (k) => {
  const t = k / 100;
  const r = t <= 66 ? 255 : 329.698727446 * Math.pow(t - 60, -0.1332047592);
  const g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * Math.pow(t - 60, -0.0755148492);
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  return [r, g, b].map((v) => Math.min(255, Math.max(0, v)));
};
const BASE = kRGB(2700);
export const tintOf = (k) => kRGB(k).map((v, i) => Math.round(Math.min(1, v / BASE[i]) * 255));
