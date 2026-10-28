import FilamentText from '../components/FilamentText.jsx';
import { LogoMark } from '../components/Logo.jsx';
import { BRAND } from '../lib/brand.js';
import { t } from '../lib/i18n.js';

// The page that is not there: the number drawn as filament in a dark room, and the way back to the light.
export default function NotFound() {
  return (
    <main className="nf">
      <a className="mark nf-mark" href={import.meta.env.BASE_URL}><LogoMark /><span>{BRAND}</span></a>
      <h1 className="sr">{t('Страница не найдена', 'Page not found')}</h1>
      <FilamentText text="404" className="nf-num" />
      <p className="nf-line">{t('Здесь не горит свет.', 'There is no light here.')}</p>
      <p className="nf-sub">{t('Такой страницы нет: возможно, ссылка устарела. Вернёмся туда, где светло.', 'This page does not exist; the link may be old. Let us go back to where the light is.')}</p>
      <a className="nf-back" href={import.meta.env.BASE_URL}>{t('На главную', 'Back to the light')}</a>
    </main>
  );
}
