// Sample content for the demo: model names, prices and figures are placeholders for the client to confirm.
import { t, money } from './lib/i18n.js';

const img = (f) => `/assets/img/${f}`;
const from = (rub) => t(`от ${money(rub)}`, `from ${money(rub)}`);

export const lamps = [
  { id: 'oka', image: img('w-oka.jpg'), text: t('Ока, подвес', 'Oka, pendant'), meta: `${t('белая эмаль', 'white enamel')}, ${from(18000)}` },
  { id: 'ruza', image: img('w-ruza.jpg'), text: t('Руза, подвес', 'Ruza, pendant'), meta: `${t('чёрная эмаль', 'black enamel')}, ${from(18000)}` },
  { id: 'nerl', image: img('w-nerl.jpg'), text: t('Нерль, подвес', 'Nerl, pendant'), meta: `${t('жёлтая эмаль', 'yellow enamel')}, ${from(21000)}` },
  { id: 'pakhra', image: img('w-pakhra.jpg'), text: t('Пахра, фонарь', 'Pakhra, lantern'), meta: `${t('стекло в чугуне, IP65', 'glass in cast iron, IP65')}, ${from(27000)}` },
  { id: 'istra', image: img('w-istra.jpg'), text: t('Истра, спот', 'Istra, spotlight'), meta: `${t('зелёная эмаль', 'green enamel')}, ${from(14000)}` },
  { id: 'sestra', image: img('w-sestra.jpg'), text: t('Сестра, настольная', 'Sestra, table lamp'), meta: `${t('мятная эмаль', 'mint enamel')}, ${from(16000)}` },
  { id: 'vyazma', image: img('w-vyazma.jpg'), text: t('Вязьма, лампа на шнуре', 'Vyazma, bulb on a cord'), meta: `${t('шар 125 мм', '125 mm globe')}, ${from(6000)}` },
  { id: 'yauza', image: img('w-yauza.jpg'), text: t('Яуза, торшер', 'Yauza, floor lamp'), meta: `${t('штатив и шарнир', 'tripod and hinge')}, ${from(32000)}` },
];

// The product sheets. Sample models for the demo, like everything else here.
const LEAD = t('Срок', 'Lead time');
const LIGHT = t('Свет', 'Light');
const weeks = (n) => t(`${n} ${n === 1 ? 'неделя' : n < 5 ? 'недели' : 'недель'}`, `${n} ${n === 1 ? 'week' : 'weeks'}`);
export const products = {
  msta: { name: t('Мста', 'Msta'), kind: t('Люстра из хрусталя', 'Crystal chandelier'), price: 186000, image: img('msta-poster.jpg'), alt: t('Хрустальная люстра «Мста» горит в тёмном зале', 'The Msta crystal chandelier alight in a dark hall'),
    story: t('Двадцать четыре свечи и тысяча двести подвесок, которые мы гранём вручную в Твери. Флагман мастерской.', 'Twenty-four candles and twelve hundred crystal drops, each one cut by hand in Tver. The flagship of our workshop.'),
    spec: [[t('Свечи', 'Candles'), t('24, нить 2700 K', '24, 2700 K filament')], [t('Хрусталь', 'Crystal'), t('1 200 подвесок ручной огранки', '1,200 hand-cut drops')], [t('Диаметр', 'Diameter'), t('120 см, для зала от 30 м²', '120\u00a0cm, for rooms from 30\u00a0m²')], [LEAD, weeks(6)]] },
  oka: { name: t('Ока', 'Oka'), kind: t('Подвес, белая эмаль', 'Pendant, white enamel'), price: 18000, image: img('w-oka.jpg'), alt: t('Белый эмалированный подвес с чёрным верхом', 'A white enamel pendant with a black crown'),
    story: t('Заводской подвес шестидесятых, который мы разбираем до винта, обжигаем эмаль заново и ставим новый патрон.', 'A factory pendant from the sixties. We take it apart to the last screw, refire the enamel and fit a new lampholder.'),
    spec: [[t('Плафон', 'Shade'), t('сталь и эмаль, Ø 36 см', 'steel and enamel, Ø 36 cm')], [t('Патрон', 'Lampholder'), t('E27, керамика', 'E27, ceramic')], [t('Провод', 'Cord'), t('текстиль, до 2 м', 'fabric, up to 2 m')], [LEAD, weeks(2)]] },
  ruza: { name: t('Руза', 'Ruza'), kind: t('Подвес, чёрная эмаль', 'Pendant, black enamel'), price: 18000, image: img('w-ruza.jpg'), alt: t('Чёрный эмалированный подвес на цепи', 'A black enamel pendant on a chain'),
    story: t('Тот же заводской плафон в чёрной эмали. Над длинным столом вешаем по три в ряд.', 'The same factory shade in black enamel. Over a long table we hang three in a row.'),
    spec: [[t('Плафон', 'Shade'), t('сталь и эмаль, Ø 32 см', 'steel and enamel, Ø 32 cm')], [t('Подвес', 'Suspension'), t('цепь или шнур, до 2 м', 'chain or cord, up to 2 m')], [LIGHT, t('2700 K, 800 лм', '2700 K, 800 lm')], [LEAD, weeks(2)]] },
  nerl: { name: t('Нерль', 'Nerl'), kind: t('Подвес, жёлтая эмаль', 'Pendant, yellow enamel'), price: 21000, image: img('w-nerl.jpg'), alt: t('Жёлтый эмалированный подвес в мастерской', 'A yellow enamel pendant in the workshop'),
    story: t('Широкий жёлтый абажур, который мы сняли с цеха под Коломной. Свет падает кругом, абажур светится по краю.', 'A wide yellow shade we took down from a factory floor near Kolomna. The light falls in a circle and the rim glows.'),
    spec: [[t('Абажур', 'Shade'), t('сталь и эмаль, Ø 44 см', 'steel and enamel, Ø 44 cm')], [t('Цвет', 'Colour'), t('жёлтый RAL 1003', 'yellow, RAL 1003')], [LIGHT, t('2700 K, 1 100 лм', '2700 K, 1,100 lm')], [LEAD, weeks(3)]] },
  pakhra: { name: t('Пахра', 'Pakhra'), kind: t('Фонарь в клетке', 'Caged lantern'), price: 27000, image: img('w-pakhra.jpg'), alt: t('Фонарь в чугунном корпусе с толстым стеклом горит в темноте', 'A cast-iron lantern with thick glass glowing in the dark'),
    story: t('Корабельный фонарь в чугуне и толстом стекле. Живёт на веранде круглый год и не боится мороза.', 'A ship’s lantern in cast iron and thick glass. It stays on the veranda all year round and shrugs off the frost.'),
    spec: [[t('Корпус', 'Body'), t('чугун, стекло 5 мм', 'cast iron, 5 mm glass')], [t('Защита', 'Protection'), t('IP65, от −40 до +40 °C', 'IP65, −40 to +40 °C')], [t('Датчик', 'Sensor'), t('сумерек, по желанию', 'dusk sensor, on request')], [LEAD, weeks(3)]] },
  istra: { name: t('Истра', 'Istra'), kind: t('Спот, зелёная эмаль', 'Spotlight, green enamel'), price: 14000, image: img('w-istra.jpg'), alt: t('Зелёный спот на латунной штанге светит вниз', 'A green spotlight on a brass rod shining downward'),
    story: t('Поворотный спот на штанге. Ставим у кресла, чтобы свет падал на книгу, а не в глаза.', 'A swivelling spot on a rod. We place it by the armchair, so the light falls on the page, not in your eyes.'),
    spec: [[t('Плафон', 'Shade'), t('сталь, эмаль', 'steel, enamel')], [t('Поворот', 'Swivel'), t('320° по кругу', '320° all round')], [LIGHT, t('2700 K, направленный', '2700 K, directional')], [LEAD, weeks(2)]] },
  sestra: { name: t('Сестра', 'Sestra'), kind: t('Настольная лампа', 'Table lamp'), price: 16000, image: img('w-sestra.jpg'), alt: t('Мятная настольная лампа на письменном столе рядом с растением', 'A mint table lamp on a desk beside a plant'),
    story: t('Мятная лампа на тонкой стойке. Высоту и наклон плафона меняют одной рукой.', 'A mint lamp on a slender stem. Height and shade angle adjust with one hand.'),
    spec: [[t('Высота', 'Height'), t('52 см', '52 cm')], [t('Основание', 'Base'), t('чугун, мятная эмаль', 'cast iron, mint enamel')], [LIGHT, t('3000 K, 600 лм', '3000 K, 600 lm')], [LEAD, weeks(2)]] },
  vyazma: { name: t('Вязьма', 'Vyazma'), kind: t('Лампа на шнуре', 'Bulb on a cord'), price: 6000, image: img('w-vyazma.jpg'), alt: t('Лампа накаливания на шнуре висит у деревянной лестницы', 'An incandescent bulb on a cord hanging by a wooden staircase'),
    story: t('Один шар с тонкой спиралью на текстильном шнуре. Вешаем гроздью или по одной над лестницей.', 'A single globe with a fine coil on a fabric cord. Hung in a cluster, or one by one over a staircase.'),
    spec: [[t('Колба', 'Bulb'), t('шар 125 мм', '125 mm globe')], [t('Нить', 'Filament'), t('угольная, 2200 K', 'carbon, 2200 K')], [t('Шнур', 'Cord'), t('текстиль, 20 цветов', 'fabric, 20 colours')], [LEAD, weeks(1)]] },
  yauza: { name: t('Яуза', 'Yauza'), kind: t('Торшер на штативе', 'Tripod floor lamp'), price: 32000, image: img('w-yauza.jpg'), alt: t('Мятный торшер на хромированном штативе с шарниром', 'A mint floor lamp on a chrome tripod with a hinge'),
    story: t('Штатив от фотостудии и шарнир, который держит плафон в любом положении.', 'A photo-studio tripod and a hinge that holds the shade at any angle.'),
    spec: [[t('Высота', 'Height'), t('до 170 см', 'up to 170 cm')], [t('Шарнир', 'Hinge'), t('латунь, с фиксатором', 'brass, with a lock')], [LIGHT, t('2700 K, 900 лм', '2700 K, 900 lm')], [LEAD, weeks(3)]] },
};

// Where the light already burns: sample projects for the demo, placed on a night scheme of Moscow (x, y in a
// 1000 × 1000 box with the Kremlin at the centre; the rings are the Boulevard, Garden, Third and MKAD).
export const projects = [
  { id: 'patriki', x: 452, y: 448, place: t('Патриаршие пруды', 'Patriarch’s Ponds'), kind: t('Квартира, 140 м²', 'Apartment, 140 m²'), did: t('32 точки света, «Мста» в гостиной, пара «Нерль» в спальне', '32 points of light, Msta in the living room, a pair of Nerl in the bedroom'), image: img('c-lantern.jpg'), alt: t('Бумажный фонарь над обеденным столом в квартире', 'A paper lantern over the dining table in an apartment') },
  { id: 'khamovniki', x: 455, y: 560, place: t('Хамовники', 'Khamovniki'), kind: t('Квартира, 96 м²', 'Apartment, 96 m²'), did: t('бра по коридору рисуют узор на стене', 'sconces along the hallway draw a pattern on the wall'), image: img('c-pattern.jpg'), alt: t('Бра на стене рисуют узор из света', 'Wall sconces drawing a pattern of light') },
  { id: 'zamoskvorechye', x: 532, y: 548, place: t('Замоскворечье', 'Zamoskvorechye'), kind: t('Кофейня, 70 м²', 'Café, 70 m²'), did: t('дымчатые подвесы над стойкой, 2200 K', 'smoked-glass pendants over the bar, 2200 K'), image: img('oka-smoke.jpg'), alt: t('Подвес из дымчатого стекла горит в темноте', 'A smoked-glass pendant glowing in the dark') },
  { id: 'chistye', x: 560, y: 452, place: t('Чистые пруды', 'Chistye Prudy'), kind: t('Квартира, 118 м²', 'Apartment, 118 m²'), did: t('настольные лампы с тремя шарами в кабинете', 'three-globe table lamps in the study'), image: img('c-globes.jpg'), alt: t('Настольная лампа с тремя опаловыми шарами', 'A table lamp with three opal globes') },
  { id: 'barvikha', x: 205, y: 470, place: t('Барвиха', 'Barvikha'), kind: t('Дом, 420 м²', 'House, 420 m²'), did: t('торшеры «Москва» и гирлянды над террасой', 'Moskva floor lamps and festoon lights over the terrace'), image: img('c-birdcage.jpg'), alt: t('Торшер с латунной клеткой у кожаного кресла', 'A brass birdcage floor lamp beside a leather armchair') },
  { id: 'zvenigorod', x: 70, y: 395, place: t('Звенигород', 'Zvenigorod'), kind: t('Дача, 160 м²', 'Dacha, 160 m²'), did: t('фонари «Пахра» на веранде, датчик сумерек', 'Pakhra lanterns on the veranda, a dusk sensor'), image: img('dacha-snow.jpg'), alt: t('Дом в зимнем лесу, тёплый свет в окнах', 'A house in a winter forest, warm light in the windows') },
  { id: 'istra', x: 150, y: 250, place: t('Истра', 'Istra'), kind: t('Сад, 30 соток', 'Garden, 0.3 ha'), did: t('гирлянды из ламп над садом, IP65', 'festoon bulbs over the garden, IP65'), image: img('dacha-garden.jpg'), alt: t('Гирлянды из ламп над садом вечером', 'Strings of bulbs over a garden in the evening') },
  { id: 'sokolniki', x: 600, y: 330, place: t('Сокольники', 'Sokolniki'), kind: t('Ресторан, 220 м²', 'Restaurant, 220 m²'), did: t('сто ламп накаливания над залом', 'a hundred incandescent bulbs over the dining room'), image: img('hero-bulbs.jpg'), alt: t('Много ламп накаливания под потолком', 'Rows of incandescent bulbs under the ceiling') },
];

export const finishes = [['brass', t('Латунь', 'Brass'), '#b8894a'], ['black', t('Чёрный металл', 'Black metal'), '#2a2725'], ['copper', t('Медь', 'Copper'), '#a8613a']];

export const steps = [
  { line: t('Сначала вы присылаете план.', 'First, you send us a plan.'), text: t('Квартиры, дома или участка; фото от руки тоже подойдёт. Расскажите, где вы читаете, едите и встречаете гостей.', 'Of your apartment, house or plot; a photo of a hand sketch will do. Tell us where you read, dine and welcome guests.'), image: img('c-lantern.jpg'), alt: t('Бумажный фонарь над обеденным столом', 'A paper lantern over a dining table') },
  { line: t('Мы ставим на нём точки света.', 'We place the points of light.'), text: t('Считаем освещённость по комнатам и подбираем оттенок под ваши стены и пол. Через три дня присылаем план со сметой.', 'We calculate the light level room by room and match the colour temperature to your walls and floors. Three days later, the plan arrives with an estimate.'), image: img('c-pattern.jpg'), alt: t('Бра рисуют на стене узор из света', 'Sconces drawing a pattern of light on the wall') },
  { line: t('Вы включаете их в шоуруме.', 'You switch them on in our showroom.'), text: t('В тёмной комнате шоурума видно, как каждая лампа будет гореть у вас дома. Меняем, пока не понравится.', 'In the showroom’s dark room you see exactly how each lamp will glow at home. We keep swapping until you love it.'), image: img('oka-smoke.jpg'), alt: t('Подвес из дымчатого стекла горит в темноте', 'A smoked-glass pendant glowing in the dark') },
  { line: t('Через неделю мы их вешаем.', 'A week later, we hang them.'), text: t('Привозим, собираем и подключаем. На светильники и работу даём гарантию три года.', 'We deliver, assemble and connect everything. Fixtures and installation come with a three-year warranty.'), image: img('c-globes.jpg'), alt: t('Настольная лампа с тремя опаловыми шарами', 'A table lamp with three opal globes') },
];

export const menu = [
  { label: t('Каталог', 'Collection'), link: '#collection', ariaLabel: t('Каталог светильников', 'The lighting collection') },
  { label: t('Тёмная комната', 'Dark room'), link: '#room', ariaLabel: t('Тёмная комната', 'The dark room') },
  { label: t('Дача', 'Dacha'), link: '#dacha', ariaLabel: t('Свет для дачи', 'Light for the dacha') },
  { label: t('Объекты', 'Projects'), link: '#projects', ariaLabel: t('Наши объекты', 'Our projects') },
  { label: t('Бюро', 'Trade'), link: '#trade', ariaLabel: t('Дизайнерам и архитекторам', 'For designers and architects') },
  { label: t('Связаться', 'Contact'), link: '#request', ariaLabel: t('Связаться', 'Get in touch') },
];

export const socials = [
  { label: 'Telegram', link: '#request' },
  { label: 'WhatsApp', link: '#request' },
  { label: 'Pinterest', link: '#request' },
];
