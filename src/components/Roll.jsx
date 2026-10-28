// A label whose letters roll over on hover: each letter slides up and its twin follows from below,
// one after another. Assistive tech reads the plain words; the letters are only drawn.
export default function Roll({ children }) {
  const text = String(children);
  return (
    <span className="roll">
      <span className="sr">{text}</span>
      <span className="roll-in" aria-hidden="true">
        {[...text].map((c, i) => {
          const ch = c === ' ' ? ' ' : c;
          return <span key={i} className="roll-c" style={{ '--i': i }} data-c={ch}>{ch}</span>;
        })}
      </span>
    </span>
  );
}
