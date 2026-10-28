// The visitor's own hour: the loader greets by it, and the dacha says when the porch comes on today.
import { t } from './i18n.js';

const h = new Date().getHours();
// English has no night-time hello, so the small hours are greeted plainly
const night = t('Доброй ночи', 'Hello');
export const greeting = h < 5 ? night : h < 12 ? t('Доброе утро', 'Good morning') : h < 17 ? t('Добрый день', 'Good afternoon') : h < 23 ? t('Добрый вечер', 'Good evening') : night;
// civil dusk in Moscow by month, roughly: when the dusk sensor switches the porch on
const DUSK = ['16:45', '17:40', '18:35', '20:00', '21:00', '21:50', '21:40', '20:40', '19:25', '18:05', '16:50', '16:15'];
export const duskToday = DUSK[new Date().getMonth()];
