import { useEffect, useRef, useState } from 'react';

// A light effect is mounted only while its section is near the screen and taken down when it leaves,
// so the page never holds more than one or two WebGL scenes at once. Without motion it never mounts.
export default function Lazy({ children, className = '', margin = '50%' }) {
  const ref = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: `${margin} 0px` });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [margin]);

  return <div ref={ref} className={`lazy-fx ${className}`.trim()} aria-hidden="true">{near ? children : null}</div>;
}
