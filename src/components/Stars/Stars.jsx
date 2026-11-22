import './Stars.css';

// fixed star sky behind everything (same stars on server and client)
function makeStars(count = 110) {
  let seed = 3;
  const r = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: count }, () => {
    const z = r() < 0.1 ? 1.8 : 0.6 + r();
    return {
      left: (r() * 100).toFixed(2) + '%',
      top: (r() * 100).toFixed(2) + '%',
      size: z.toFixed(1) + 'px',
      o: (0.2 + r() * 0.5).toFixed(2),
      delay: (r() * 6).toFixed(1) + 's',
      dur: (3 + r() * 4).toFixed(1) + 's',
    };
  });
}
const STARS = makeStars();

export default function Stars() {
  return (
    <div className="sky" aria-hidden="true">
      {STARS.map((s, i) => (
        <span
          key={i}
          className="sky__star"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, '--o': s.o, animationDelay: s.delay, animationDuration: s.dur }}
        />
      ))}
    </div>
  );
}
