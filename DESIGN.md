---
name: Кельвин
description: A lighting studio told as a scroll story in which the light comes on.
colors:
  soot: "#0d0c0b"
  soot-raised: "#1a1816"
  soot-deep: "#12100e"
  ink: "#ecebe8"
  ink-muted: "#a39d93"
  filament: "#ffd8a1"
  kelvin-2700: "#ffad47"
  plaster-muted: "#b3ab9f"
  dusk: "#141b18"
  night: "#070809"
  error: "#ff7a6b"
typography:
  monument:
    fontFamily: "Oranienbaum, Times New Roman, serif"
    fontSize: "min(31.8vw, 58vh)"
    fontWeight: 400
    lineHeight: 0.88
    letterSpacing: "-0.045em"
  display:
    fontFamily: "Oranienbaum, Times New Roman, serif"
    fontSize: "min(22vw, 42vh)"
    fontWeight: 400
    lineHeight: 0.8
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Oranienbaum, Times New Roman, serif"
    fontSize: "clamp(2.5rem, 1.4rem + 4.4vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  statement:
    fontFamily: "Oranienbaum, Times New Roman, serif"
    fontSize: "clamp(1.75rem, 1.2rem + 1.2vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Oranienbaum, Times New Roman, serif"
    fontSize: "clamp(1.375rem, 1.2rem + 0.8vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 1.15
  body:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(1.125rem, 1.05rem + 0.2vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.5
  action:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(1.375rem, 1.2rem + 0.8vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.2
  label:
    fontFamily: "Onest, system-ui, sans-serif"
    fontSize: "clamp(0.8125rem, 0.79rem + 0.1vw, 0.875rem)"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  field: "14px"
  frame: "20px"
  pane: "24px"
  stage: "28px"
  pill: "999px"
spacing:
  margin: "clamp(16px, 2vw, 32px)"
  chapter: "clamp(96px, 10vw, 160px)"
  stack-sm: "16px"
  stack-md: "28px"
  stack-lg: "48px"
  stack-xl: "96px"
components:
  switch-cta:
    backgroundColor: "{colors.kelvin-2700}"
    textColor: "{colors.soot}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "8px 26px 8px 8px"
    height: "56px"
  header-bar:
    backgroundColor: "rgba(13, 12, 11, 0.86)"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "56px"
  header-cta:
    backgroundColor: "{colors.soot}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 13px"
    height: "40px"
  nav-link-current:
    backgroundColor: "rgba(255, 216, 161, 0.12)"
    textColor: "{colors.filament}"
  kelvin-dial:
    backgroundColor: "rgba(236, 235, 232, 0.06)"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 14px 0 12px"
    height: "40px"
  lang-switch:
    backgroundColor: "rgba(236, 235, 232, 0.06)"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "40px"
  pane:
    backgroundColor: "rgba(18, 16, 14, 0.88)"
    textColor: "{colors.ink}"
    rounded: "{rounded.pane}"
  room-chip:
    backgroundColor: "rgba(236, 235, 232, 0.08)"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 20px 0 16px"
    height: "48px"
  room-chip-on:
    backgroundColor: "rgba(255, 216, 161, 0.18)"
    textColor: "{colors.filament}"
  room-chip-all-on:
    backgroundColor: "{colors.kelvin-2700}"
    textColor: "{colors.soot}"
  sheet-chip:
    backgroundColor: "rgba(236, 235, 232, 0.08)"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "44px"
  sheet-chip-selected:
    backgroundColor: "{colors.filament}"
    textColor: "{colors.soot}"
  sheet-add:
    backgroundColor: "{colors.kelvin-2700}"
    textColor: "{colors.soot}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
    height: "60px"
  sheet-add-done:
    backgroundColor: "{colors.filament}"
  trade-cta:
    backgroundColor: "rgba(255, 216, 161, 0.12)"
    textColor: "{colors.filament}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "56px"
  form-next:
    backgroundColor: "{colors.kelvin-2700}"
    textColor: "{colors.soot}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "52px"
  form-back:
    backgroundColor: "rgba(236, 235, 232, 0.08)"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 26px"
    height: "52px"
  form-send-letter:
    backgroundColor: "{colors.kelvin-2700}"
    textColor: "{colors.soot}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 22px 0 28px"
    height: "56px"
  chip:
    backgroundColor: "rgba(236, 235, 232, 0.07)"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "44px"
  chip-selected:
    backgroundColor: "{colors.kelvin-2700}"
    textColor: "{colors.soot}"
  input:
    backgroundColor: "rgba(236, 235, 232, 0.07)"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "0 18px"
    height: "52px"
  input-focus:
    backgroundColor: "rgba(236, 235, 232, 0.1)"
  cta-link:
    textColor: "{colors.filament}"
    typography: "{typography.action}"
    padding: "6px 0 10px"
  form-frame:
    backgroundColor: "rgba(20, 18, 16, 0.86)"
    textColor: "{colors.ink}"
    rounded: "{rounded.frame}"
  vitrine-frame:
    backgroundColor: "#050403"
    rounded: "{rounded.frame}"
---

# Design System: Кельвин

## Overview

**Creative North Star: "The Dark Room, Switched On"**

The page is a dark room and the visitor's scroll is the hand on the switch. Everything rests on soot black, from the first screen to the footer, the request form and the menu included; light arrives through footage, photographs, one warm filament colour that marks what is lit (the name, the lamp names, the prices, the readouts, whatever is switched on) and drawn light placed where a lamp would throw it. Chapters are told apart by the chapter gap, the cinematic black of the scenes, the dusk-green ground of the dacha and the night ground of the map, and by one veil of black that dims softly as each seam between rooms crosses the middle of the screen.

Type works at two extremes. Oranienbaum, a narrow, sharp Cyrillic display serif, sets the name as a monument across the full width and every heading at large scale; Onest carries everything that is read or pressed. The name itself is drawn as filament: a glowing wire traces each letter, the glow stutters as the coil catches, then the letters fill with warm light. Surfaces are flat fills with soft corners (the owner rejects square buttons): pill controls and flat panes (soot at 88% with a 1px warm hairline) laid over the films and photographs. There is no glass and no backdrop blur: nothing behind a panel is re-filtered while the page scrolls.

The visitor can hold the light themselves. A dimmer in the header sets the colour temperature of the whole page (1800 to 4000 K, a multiply layer, off at 2700 K); the dark room switches four sources on its photograph; the product sheet re-tints its photograph in three shades and lets the lamp be tried on a photo of the visitor's own room. The page speaks Russian or English and can wear the name of the company it was sent to (`?brand=`): the hero, header, footer, tab title and the mark's filament initial all follow.

Motion is the system's second material. Two curves govern it, and each kind of content arrives its own way, once: words tip up out of a masked line, running text surfaces line by line, labels roll letter by letter, the name draws as filament, lamps catch with a flicker. Scrubbed and held scenes (the switch-on room, the chandelier, the vitrine row and the process wire on desktop, the dusk film) are pinned to scroll.

**Key Characteristics:**
- Soot-black ground on every chapter (dusk for the dacha, night for the map); light carried by footage, the filament colour and drawn light in its named places.
- Oranienbaum at monument scale against Onest text; two weights of Onest only (400, 500).
- Chapters told apart by the chapter gap, cinematic black, the dusk and night fields and the veil that dims at each seam.
- Pill controls and flat 20 to 28px panes with a warm hairline; no glass, no backdrop blur.
- Calls to action in the story are words with a drawn line and an arrow; filled controls are reserved for switches, selections and sending.
- The visitor holds the light: a page-wide Kelvin dimmer, switchable sources in the dark room, tints and try-on in the product sheet.
- One arrival per kind of content, on the lux and silk curves.

## Colors

A near-monochrome warm-black palette in which a single filament amber stands for light and a single 2700 K orange stands for touch.

### Primary
- **Filament** (filament): the colour of light being on. The filament name in the hero, footer and 404, the chandelier's name, the product sheet's name, display figures (the kelvin readout, the loader odometer, «Щёлк.», the estimate total), the lit lamp's name in the vitrine and its counter, prices on the chandelier and in the cart, footer places, menu social links, lit points on the map and the map card's name, the candela curve and the text-link calls to action. As a translucent tint it marks something switched on: the nav pill under the current section (12%), a lit dark-room source chip (18%), a chosen finish and the try-on button when active (16%), the trade call (12%). Solid, it fills a selected colour temperature in the product sheet and the «Уже в заявке» state. At 12% it is the hairline of every pane, the header bar, the map card and the try-on bar; at 10 to 12% the form frame.

### Secondary
- **2700 K** (kelvin-2700): touch. Fills the hero switch, the dark room's «Весь свет» when everything is on, the form's «Дальше» and «Отправить заявку», a selected form chip, the send-by-letter button, «Добавить в заявку», «Оформить заявку» on the cart pill; also the focus outline and its 18% halo, input focus ring, text selection, the skip link, the menu's accent (hover colour of items and one of its two opening wipe layers), process step counters, trade term numbers and file arrows. Inside drawn light it is the light itself: the header comet, the filament glow of the name, the footer rays, the bulbs on the process wire, the glow under the logo's filament. Never a resting background field, never body text.

### Neutral
- **Soot** (soot): the page ground everywhere, including the request, and the ink on 2700 K and filament fills.
- **Soot Raised** (soot-raised): one step up from soot for the dark room's «Весь свет» chip at rest.
- **Soot Deep** (soot-deep): the open menu panel and the map's project card.
- **Lamp-shade Ink** (ink): primary text on every ground; section intros are ink at 72% opacity, process body text at 78%.
- **Ash** (ink-muted): secondary text (captions, unlit lamp names and the vitrine counter, spec terms, slider ends, the dark-room lede, loader labels, legal, the menu's socials title, map list at rest, trade notes and file sizes).
- **Plaster Muted** (plaster-muted): the plaster palette survives only as variable names. `--plaster`, `--plaster-ink` and `--plaster-muted` are still declared on `:root` with the old light-ground values, but nothing paints with `--plaster`; inside `.request` the other two are redefined to light tones for dark ground (`--plaster-ink` becomes ink, `--plaster-muted` becomes #b3ab9f) and carry the form's labels, legends, descriptions, hints, the estimate's terms and the intro text.
- **Dusk** (dusk): the green-black ground of the dacha chapter only.
- **Night** (night): the cool near-black ground of the light map only, the city at night.
- **Error** (error): the invalid-field ring; its text is a lighter #ff9a8c for legibility on dark.

Footage wells, the scrubbed scenes and the dark room sit on pure black (#000) so letterboxing disappears into the film; the vitrine and process photographs sit on #050403; the «made by Orbient» card on #080706.

### Named Rules
**The Lit Thing Rule.** Filament marks what is lit: the name, lamp names, prices, readouts, calls to action, lit points and whatever the visitor has switched on (as a 12 to 18% tint, or solid on a chosen colour temperature). It is never a resting background; as a line it appears only as the 10 to 12% hairline at the edge of panes, the header bar, the map card, the try-on bar and the form frame.

**The Touch Rule.** 2700 K fills only something the visitor switches, selects or sends, including adding to and opening the request. If it does not change state or submit, it does not get an orange fill; inside drawn light 2700 K is light, not fill.

**The Rooms Not Boxes Rule.** Sections are separated by the chapter gap, the black of the cinematic scenes, the dusk and night fields and the veil, never by rules or dividers between sections. Hairlines between rows inside a list (map places, trade terms, files, estimate rows) are part of the list, not the page.

## Typography

**Display Font:** Oranienbaum (with Times New Roman, serif), self-hosted, Cyrillic and Latin subsets, weight 400 only.
**Body Font:** Onest (with system-ui, sans-serif), self-hosted, Cyrillic and Latin subsets, weights 400 and 500.

**Character:** A narrow, high-contrast Cyrillic serif carved at monument scale, set against a calm, contemporary grotesque that never competes with it.

### Hierarchy
- **Monument** (400, min(31.8vw, 58vh), 0.88; 30vw on phones): the name set whole across the foot of the hero, drawn by FilamentText as an SVG that hugs the word and spans the width (never taller than 1.12em), so any `?brand=` name fits. It returns full width in the footer, drawn when it scrolls into view, and the 404 number is drawn the same way.
- **Display** (400, min(22vw, 42vh), 0.8): the name of the featured piece inside its scene («Мста»); the product sheet's name at clamp(4.5rem, 2rem + 8vw, 10rem), 0.82; also the scroll beats and figures (kelvin readout, loader odometer, the loader's greeting) at their own clamps with tabular numerals.
- **Headline** (400, the `--step-head` clamp, 0.95, -0.02em, balanced): every chapter heading, process step lines (2.25rem on phones), prices in the chandelier scene and the product sheet, the sent-request title, the «made by» heading, the 404 line.
- **Statement** (400, 1.75 to 2.25rem, 1.1): one-sentence declarations: the hero's closing line, the dacha overlay; 1.5rem on phones. The manifesto is a larger statement at clamp(2rem, 1.2rem + 2.6vw, 4rem), 1.75rem on phones.
- **Title** (400, the `--step-lead` clamp, 1.15): specification values, vitrine lamp names and counter, contact values, footer places, process counters, the stepper title, the wordmark in the header (scaled down for long `?brand=` names). Smaller fixed titles at 1.375 to 1.5rem: map places and card name, trade terms, sheet spec values, the cart total.
- **Body** (Onest 400, the `--step-body` clamp, 1.5): all running text, 34 to 46ch measure, `text-wrap: pretty`.
- **Action** (Onest 500, the `--step-lead` clamp, 1.2): text-link calls to action. Buttons use Onest 500 at body size, line-height 1; the header call, nav links, dimmer readout, language switch, room and sheet chips use Onest 500 at label size.
- **Label** (Onest 400/500, the `--step-small` clamp): field labels, captions, term labels, legal, the menu toggle. Sentence case, no tracking, never uppercase.

### Named Rules
**The Two Voices Rule.** Oranienbaum speaks (names, headings, figures, statements); Onest explains and acts. No third face, no italics, no uppercase labels. Names that are capitals by nature (the language codes RU/EN, the map's МКАД and ТТК) are names, not labels.

**The Monument Rule.** The name is set whole, at full width, once at the top and once at the end, always drawn as filament. It is never cropped, wrapped or used as a texture; a longer `?brand=` name is set smaller so it still spans the screen.

**The Whole Glyph Rule.** Display type is set tight, so every GSAP SplitText call passes `charsClass`, `wordsClass` and `linesClass`. SplitText names its masks after those classes, and only then do the `.char-mask`, `.word-mask` and `.line-mask` paddings in styles.css (with equal negative margins) reach the masks and keep descenders, the bowl of «ь» and overshoots from being clipped. Masks inside headings and the hero title take `pointer-events: none`, because their padding reaches tens of pixels past a monument letter and once covered the hero switch.

## Layout

Full-bleed chapters with a fluid side margin (`margin` token) and a fluid chapter gap (`chapter` token) top and bottom. Section heads (vitrine, dacha, process) stack the headline and the short intro under it, both left-aligned, 20px apart, the intro at 46ch in ink at 72% opacity; the vitrine head carries its lit counter on the right. The manifesto uses a 12-column grid (text 1 to 7, the bulb film 8 to 12). Two-column splits: the map (0.8fr copy / 1.2fr scheme), the trade (1fr / 0.9fr), the request (0.9fr sticky intro with the estimate pane / 1.1fr form), the product sheet (1.15fr photograph / 1fr words). Cinematic and held chapters (hero, chandelier, vitrine and process on desktop, dark room) are 100svh. The header bar appears after half a screen, and the in-bar nav follows the section under the middle of the screen.

Inner rhythm uses 16, 28, 48 and 96px steps (gaps of 20, 24, 40, 56, 64 and 72px also occur between head and content). Breakpoints: 1240px (the in-bar nav leaves, the dimmer narrows), 1023px (manifesto, dark room and request stack; the dark-room pane drops under the picture), 899px (vitrine becomes a swipe row, process a column with its wire on the left, map and trade stack), 900px (the product sheet stacks), 767px (phone: the dimmer leaves the header, hero copy stacks) and 520px (the header call leaves; the request stays one tap away in the menu and at the foot).

## Elevation & Depth

Flat surfaces, drawn light. No `box-shadow` for elevation and no text shadows on the page's own surfaces; React Bits defaults that carried shadows are zeroed where the page restyles them (slider thumb, stepper frame, glider and buttons). Panels are flat soot at 86 to 88% with an inset 1px filament hairline at 12%; no backdrop blur anywhere. Depth comes from footage, tonal steps of soot and drawn light. A neutral-black radial scrim under the chandelier's text is the one darkening gradient on footage and is off on phones. The veil, a single fixed black layer, rises to 45% at each seam between reading sections and falls again. No page-wide animated grain overlay: the footage carries its own. Box-shadow appears otherwise only as the keyboard focus halo (6px, 2700 K at 18%), the input focus and error rings (2px, solid) and as drawn light (glowing bulbs, the dimmer's dot).

### Named Rules
**The Drawn Light Rule.** By the owner's request, glows, gradients, rays and animated lines are allowed, but only as light in its places: the StarBorder comet round the header call, the FilamentText name (hero, footer, 404) and the logo's filament initial, the dappled sun through leaves behind the dacha heading, the bulbs and wire of the process, the halos of lit projects on the map, the candela curve in the trade section, the glow round a lamp tried on in the product sheet, the torch under the pointer in the dark room, the LightRays cone over the request, the SideRays in the footer and the faint pool of light on the 404. They draw in filament and 2700 K (the process wire and the dimmer's track also reach #ff8a3d, and the dimmer's track runs to cool white because it is the colour-temperature scale itself), they never carry content, and the surfaces around them stay flat.

**The Single Scrim Rule.** Outside drawn light, a gradient is allowed only as a neutral darkening under text on footage, or as an alpha mask that lets a film or a row fade into the dark (the manifesto bulb, the vitrine's edges, the dappled light), never as colour or decoration.

## Shapes

Soft and round. Every pressable control is a full pill (999px), including chips, the header bar and its nav pill, the dimmer, the language switch, the header call, the product sheet's Kelvin strip and the cart pill; the count steppers and the sheet's close button are round. Panes default to 24px; the chandelier spec card, the dark-room control pane and the product sheet's photograph use 28px (22px on phones); the vitrine frames, the map card and the form frame use 20px; process photographs 24px; fields 14px; the letter preview 16px and summary rows 12px. Films and the dark-room photograph fill the screen square-cornered. Borders appear only as the faint filament hairline (inset, 12%) on panes, the header bar, the nav pill, the map card and the try-on bar, the 12% border of the form frame, the 16% ink ring of the sheet's close button, and hairlines between rows inside lists.

## Components

### Buttons
Filled controls are rare by design: the switches, selections and the request.
- **Shape:** full pill (999px).
- **Hero switch:** 2700 K pill with a soot knob track (64 by 40px) whose dot slides 24px and turns filament on hover, focus and when the scene plays. Press scales to 0.97.
- **Header call («Подобрать свет»):** a soot pill (StarBorder) with a 1px filament track at 18% and a 2700 K comet with a filament trail circling it every 5s; ink label at label size, rolling letters; held in a Magnet so it leans toward the pointer.
- **Form buttons:** «Дальше» and «Отправить заявку» are 2700 K pills with soot text (hover #ffc06e); «Назад» is a translucent ink pill (8%); disabled is 45% opacity. The send-by-letter fallback is a 2700 K pill with a dot that grows on hover. Secondary post-send actions are translucent ink pills.
- **Product sheet:** «Добавить в заявку» is a 60px 2700 K pill that scales to 1.03 on hover and turns filament once added («Уже в заявке»); «Примерить у себя» is a translucent ink pill that takes a filament tint while try-on is open.
- **Cart pill:** «Оформить заявку», a 48px 2700 K pill at the end of the cart.
- **Trade call:** «Получить доступ к библиотеке», a 56px pill tinted filament at 12% with filament text, never filled.
- **Hover / Focus:** colour shifts over 180 to 250ms; labels roll letter by letter; keyboard focus is a 2px 2700 K outline offset 3px with a 6px 2700 K halo at 18%, round on pills (`src/polish.css`); mouse focus shows nothing.

### Text-link calls to action
The default way to ask for anything in the story. Onest 500 at the action size in filament, a 2px line underneath and an arrow (→, set in the text face). On hover and focus the line draws back to 30% from the left on lux over 700ms, the arrow slides 6px, the letters roll. Used at the end of the hero scene and under the chandelier's price. Plain `.link` text links (footer, «made by» card) underline on hover only.

### Chips
- **Form chips:** pill, translucent ink (7%) on the dark form, ink text, 44px tall; selected is solid 2700 K with soot text; hover deepens to 13%; press scales to 0.96.
- **Dark-room source chips:** 48px pills at 8% ink with a dot; a lit source turns filament at 18% with filament text and a filament dot. «Весь свет» rests on soot raised with a small toggle and turns solid 2700 K when everything is on.
- **Sheet chips:** 44px pills at 8% ink. The Kelvin chips (2200, 2700, 3000 K) sit on a pane strip over the photograph; the chosen one is solid filament with soot text and tints the photograph through a multiply layer. Finish chips carry a swatch dot and turn filament at 16% when chosen.

### Cards / Containers
- **Pane** (`src/components/Pane.jsx`, `.pane` / `.pane__in`): the one panel. Flat rgba(18, 16, 14, 0.88) with an inset 1px filament hairline at 12%, 24px by default. It carries the chandelier's spec and price, the dark room's controls, the dacha overlay, the request estimate, the sheet's Kelvin strip and the cart pill. It replaced the liquid glass, so nothing behind it is re-filtered while the page scrolls.
- **Form frame:** the stepper, rgba(20, 18, 16, 0.86) with a 1px filament border at 12% and 20px corners.
- **Vitrine frame:** 4:5 photograph on #050403 with 20px corners, resting at 0.9 scale and unlit; the lamp in the middle of the row grows to full size and its lit photograph catches with a flicker.
- **Map card:** soot deep, 20px, hairline, photograph over the place name in filament.
- **Internal padding:** 32 by 36px on the chandelier card (22 by 20 on phones), 18 to 20px on the dark-room pane, 24 by 28px on the dacha overlay and estimate.
- **Shadow strategy:** none for elevation (see Elevation & Depth).

### Inputs / Fields
- **Style:** 14px corners, translucent ink (7%) on the dark form, no stroke, 52px tall, ink text; labels above in plaster-muted (#b3ab9f) at label size.
- **Focus:** field lifts to 10% with a 2px 2700 K ring.
- **Error:** 2px error ring (#ff7a6b) and a sentence of help below in #ff9a8c; disabled actions drop to 45% opacity.
- **Live estimate:** beside the form, a pane whose total (filament, tabular figures) rolls to each new value as the answers and the cart change; the plan is struck through as free above 150 000 ₽. In English, money shows in dollars at 90 ₽ to the dollar.

### Navigation
Fixed 72px header. After half a screen a flat soot bar (`.hdr-glass`: soot at 86%, 12% filament hairline, pill, inset 8px) settles in under it; it is not glass. On it: the mark (the bulb logo and the name at title size, hidden on the first screen until the keyboard reaches it), the in-bar section nav (`HeaderNav`: label-size links at 72% ink, a filament pill at 12% with a hairline that slides on silk to the section under the middle of the screen, the current link in filament), the RU/EN switch, the Kelvin dimmer (`KelvinDial`: a dot in the chosen colour, a 1800 to 4000 K range, a tabular readout; double-click returns to 2700 K) and the StarBorder call. A React Bits StaggeredMenu sits at the right. The menu opens dark: two wipe layers (#2a2520, then 2700 K) run ahead of a soot-deep panel with Oranienbaum items sized from the panel (up to 4.5rem) in ink, hover 2700 K, socials in filament under an ash title. The cart pill steps aside while the menu is open.

### The mark
`src/components/Logo.jsx`: an incandescent bulb drawn in a thin outline at 55% of the text colour, whose filament is the first letter of the brand in Oranienbaum, stroked in filament with a 2700 K glow. It follows `?brand=`, and the same drawing on soot is the favicon.

### Chapters
- **Prologue:** the switch-on film scrubbed by scroll, the filament name, the switch, beats «Вечер начинается с темноты.» → «Щёлк.» → the kelvin readout → closing line and CTA.
- **Manifesto:** a frameless filament film screened onto the soot through `.manifesto-glow` with a soft radial mask; the scroll brings the coil up while ScrollReveal lights the sentence word by word in filament.
- **Chandelier «Мста»:** a pinned locked-off film opening from a narrow window with a counter-zoom; the name in display filament, the spec and price on a 28px pane.
- **Vitrine** (`Vitrine.jsx`): eight lamps of the «Реки» collection standing in the dark; only the one in the middle is on. Pinned on desktop while the row slides through with the scroll, a snapping swipe row on phones; the row fades into the dark at both edges through a mask. A press opens the product sheet.
- **Dark room** (`Room.jsx`): one photograph, dark and lit; four sources (table lamp, shelf lamp, string lights, the stove) switched by spots on the photo or by chips, each lighting only its own pool; they come on by themselves the first time; a torch under the pointer shows the lit room in the dark; ElasticSliders for brightness and warmth.
- **Dacha** (`DuskFilm.jsx`): the dappled-light shader behind the heading; a ScrollExpand frame grows to the screen over a still where the windows light one by one, then the film plays from that frame; the overlay sits on a pane.
- **Light map** (`LightMap.jsx`): Moscow at night as rings, roads and the river on the night ground; projects light up one by one, and pointing at a name or a light shows its card.
- **Process** (`Process.jsx`): four steps on a filament wire with bulbs; pinned on desktop, each bulb catching as its step comes up and its photograph opens from the top; a column with a lit wire on the left on phones.
- **Trade** (`Trade.jsx`): for designers and architects; a polar candela curve drawn as the section arrives, numbered terms, the file list, the trade call.
- **Request:** the stepper form on dark under a LightRays cone, with the live estimate pane in the sticky intro.
- **Footer and «made by Orbient» card:** SideRays fall from the corner onto the filament name; the last screen (`.made`) names the studio that built the demo, with a Telegram call and contacts.

### Product sheet
`ProductSheet.jsx`, a full-screen dialog on soot at 98.5%. The photograph you pressed lifts off the page and flies (FLIP, 0.95s silk) into a 28px frame; the words arrive under it on lux. Kelvin chips tint the photograph, finish chips, spec, price, «Примерить у себя» and «Добавить в заявку». Try-on: a local photograph (kept in the browser as an object URL) or the sample room; the lamp is screened onto it so its dark backdrop drops away, dragged into place and sized by a slider, with a soft glow round it. What is added waits on the cart pill (`CartPill.jsx`) at the foot of the screen.

### 404
`src/sections/NotFound.jsx`, rendered by `src/main.jsx` for any path other than `/`; the build copies index.html to dist/404.html. A dark room with a faint pool of 2700 K light, the number drawn as filament, «Здесь не горит свет.» and the way back.

### Effects and media (engineering rules)
- **WebGL only through Lazy.** Every WebGL scene (LightRays, SideRays, DappledLight) mounts only inside `src/components/Lazy.jsx`, which mounts it while its section is within 50% of the screen and takes it down when it leaves, so the page never holds more than one or two scenes; with reduced motion it never mounts.
- **Video only through playWhileOnScreen.** Every video plays only through `playWhileOnScreen` in `src/lib/media.js`: one film plays at a time, a starting film sends the previous one to sleep, and a film that leaves the screen releases its source and decoder and wakes the next one still in view. Chrome drops the whole page to 30 Hz, and keeps it there, once two videos ever play together. Looping films with `autoplay` (manifesto filament) are registered in App; the chandelier loop registers itself; the dusk film registers when its still gives way and releases when scrolled back; the hero film registers with `play: false`, so it is only released and restored.
- **Hero scrub.** The hero lamp film is an all-intra encoding (`lamp-1920.mp4`, `lamp-m.mp4` below 768px) held in memory and scrubbed by scroll as its playhead, forwards and backwards, with one seek in flight at a time.
- **Photography.** The collection is one stock shoot, cottonbro studio on Pexels, a vintage lighting workshop (`public/assets/img/w-*.jpg`, unlit versions in `img/off/`). The dark room is one living-room photograph (Annie Spratt, Unsplash), `room-on.jpg` lit and `room-off.jpg` a grade of it. Every raster is listed in `public/credits.html`.
- **The page tint.** `.kelvin-tint` is one fixed multiply layer over the page, hidden at 2700 K so it costs nothing at rest.
- **Language and brand.** `src/lib/i18n.js` (`t(ru, en)`, `money()`, `?lang=en`, remembered) and `src/lib/brand.js` (`?brand=Name`, kept for the visit) are read once at load; no string is set without both languages.
- **No sound.** The page is silent.
- **Owner notifications.** `src/lib/track.js` sends open, leave and lead beacons as text/plain to an n8n webhook (`VITE_TRACK_WEBHOOK`), silent on localhost unless `?track=1`; the workflow «Kelvin demo · визиты и заявки» posts them to the owner's Telegram.

### Arrivals (motion grammar)
- **Headings:** words in line masks rise 170% with a 12 degree tip from the bottom-left, 1.1s on lux, 0.05s stagger, once.
- **Running text:** lines surface from 12% opacity over 1.8s, 0.1s stagger, while the block drifts up 50px.
- **The name:** FilamentText draws each letter's wire over 1.5s (0.09s stagger), the glow stutters as the coil catches, the letters fill over 1.1s; the hero waits for the loader, the footer and 404 start in view.
- **Lamps:** a lamp that comes on catches with a flicker (`catch`, 700 to 900ms) in the vitrine, the process bulbs and the map.
- **Labels:** letters roll up one by one (520ms, lux, 16ms stagger) on links and buttons.
- **Seams:** the veil dims to 45% as a seam between reading sections crosses the middle of the screen.
- **Reduced motion:** arrivals, beats, the loader, the veil and the WebGL scenes are skipped; scenes render at rest, the name is drawn complete.

## Do's and Don'ts

### Do:
- **Do** keep every ground flat soot (dusk for the dacha, night for the map, black for footage), with footage and drawn light supplying the light.
- **Do** set the name, lamp names, prices, readouts and whatever is switched on in filament, and nothing structural.
- **Do** ask with words in the story: a text link with a 2px line and an arrow, in filament.
- **Do** reserve filled pills for switches, selections and the request; fill 2700 K only on what the visitor switches, selects or sends.
- **Do** put panels on the flat `Pane`: soot at 88% with the 12% filament hairline.
- **Do** draw the name with FilamentText and let it follow `?brand=`.
- **Do** write every string as `t(ru, en)` and every price through `money()`.
- **Do** mount every WebGL scene through `Lazy.jsx` and play every video through `playWhileOnScreen`.
- **Do** pass `charsClass`, `wordsClass` and `linesClass` to every SplitText call, and keep masks inside headings at `pointer-events: none`.
- **Do** use the lux curve (0.35, 0, 0, 1) for type and lines and the silk curve (0.16, 1, 0.3, 1) for pictures, pills and flights.
- **Do** give each kind of content its one arrival, once per element.
- **Do** show keyboard focus as the warm ring and halo, and give every control a 44px target on coarse pointers.

### Don't:
- **Don't** add drop shadows, text shadows or coloured gradient washes to surfaces; outside drawn light the only gradient is the neutral scrim under text on the chandelier film or an alpha fade into the dark.
- **Don't** bring back glass or backdrop blur; panels are flat.
- **Don't** add drawn light outside its named places, or draw it in colours other than filament and 2700 K.
- **Don't** let two videos play at once, or mount a WebGL scene outside `Lazy.jsx`.
- **Don't** bring back a light plaster ground; the page, the form, the sheet and the menu are dark.
- **Don't** draw borders, hairlines or dividers between sections.
- **Don't** use square buttons or square chips; controls are pills.
- **Don't** use filament or 2700 K as a resting background field or for body text.
- **Don't** add a third typeface, italics, or uppercase tracked labels.
- **Don't** fill a call to action that is not a switch, a selection or part of the request; the header call is a soot pill lit by its comet, the trade call a filament tint.
- **Don't** add sound.
