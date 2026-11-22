import { useId } from 'react';
import './Logo.css';

export default function Logo({ size }) {
  const id = useId().replace(/:/g, '');
  return (
    <span className={`logo${size === 'lg' ? ' logo--lg' : ''}`} aria-label="Utopia Vip Travel">
      <span className="logo__word">
        <span className="logo__txt">Utopi</span>
        <svg viewBox="0 0 100 92" aria-hidden="true">
          <defs>
            <linearGradient id={`aL${id}`} x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFFBF0" />
              <stop offset=".45" stopColor="#FFD58C" />
              <stop offset="1" stopColor="#B9822E" />
            </linearGradient>
            <linearGradient id={`aS${id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#D9A04E" />
              <stop offset="1" stopColor="#6E4A1C" />
            </linearGradient>
          </defs>
          <polygon points="50,0 0,92 58,92" fill={`url(#aS${id})`} />
          <polygon points="50,0 58,92 100,92" fill={`url(#aL${id})`} />
          <polygon points="26,60 74,60 77,66 23,66" fill="#140F2C" />
          <polygon points="50,0 43,13 51,14 57,13" fill="#fff" />
        </svg>
      </span>
      <span className="logo__sub">VIP TRAVEL</span>
    </span>
  );
}
