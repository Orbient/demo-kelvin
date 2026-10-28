// Looping films play only while they are on screen, one at a time, and hold a decoder only while they play.
// Chrome drops the whole page to 30 frames a second, and keeps it there, once two films play at the same
// moment; so a film that starts sends the one before it to sleep, and a film that leaves the screen lets go
// of its source and wakes whichever film is still in view. The file is in the browser cache by then.
// A scrubbed film (play: false) is only released and restored; its scene seeks it back into place.
const films = new Map(); // video -> { play, visible }

const release = (video) => {
  if (!video.getAttribute('src')) return;
  video.pause();
  video.dataset.src = video.getAttribute('src');
  video.removeAttribute('src');
  video.load();
};

const start = (video) => {
  films.forEach((f, other) => { if (other !== video && f.play) release(other); });
  if (!video.getAttribute('src') && video.dataset.src) video.src = video.dataset.src;
  video.play().catch(() => {});
};

export function playWhileOnScreen(video, margin = '-10% 0px', { play = true } = {}) {
  const film = { play, visible: false };
  films.set(video, film);
  const io = new IntersectionObserver(([entry]) => {
    film.visible = entry.isIntersecting;
    if (film.visible) {
      if (play) start(video);
      else if (!video.getAttribute('src') && video.dataset.src) video.src = video.dataset.src;
      return;
    }
    release(video);
    if (!play) return;
    for (const [other, f] of films) if (other !== video && f.play && f.visible) { start(other); break; }
  }, { rootMargin: margin });
  io.observe(video);
  return () => { io.disconnect(); films.delete(video); };
}
