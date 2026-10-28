import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';
import App from './App.jsx';
import NotFound from './sections/NotFound.jsx';
import './styles.css';
import './polish.css';
import { startTracking } from './lib/track.js';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP);
// one family of curves for the whole page: 'lux' for type and things that arrive, 'silk' for pictures
CustomEase.create('lux', '.35,0,0,1');
CustomEase.create('silk', '.16,1,.3,1');

// No StrictMode: its double mount hands WebGL components a canvas whose context they already released.
// any address other than the page itself (and its files) gets the dark room with the way back
const BASE = import.meta.env.BASE_URL;
const home = location.pathname === BASE || location.pathname === `${BASE}index.html`;
createRoot(document.getElementById('root')).render(home ? <App /> : <NotFound />);
// the visit is watched only once the page stands (see lib/track.js)
if (home) setTimeout(startTracking, 1500);
