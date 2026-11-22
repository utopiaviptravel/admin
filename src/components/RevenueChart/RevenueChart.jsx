'use client';

import { useEffect, useRef, useState } from 'react';
import { gel, shortDate } from '@/lib/format';
import './RevenueChart.css';

const H = 220, L = 46, B = 26, T = 12;

// one gold line, hover shows the day's revenue
export default function RevenueChart({ days }) {
  const box = useRef(null);
  const [W, setW] = useState(640);
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(Math.max(300, el.clientWidth)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = days.length - 1;
  const max = Math.max(...days.map((d) => d.value)) || 1;
  const nice = Math.ceil(max / 10000) * 10000;
  const X = (i) => L + (i * (W - L - 8)) / n;
  const Y = (v) => T + (H - T - B) * (1 - v / nice);
  const line = days.map((d, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(d.value).toFixed(1)}`).join(' ');
  const area = `${line} L${X(n)} ${H - B} L${X(0)} ${H - B} Z`;
  const ticks = [0, 1, 2, 3, 4].map((k) => (nice * k) / 4);

  function onMove(e) {
    const r = e.currentTarget.ownerSVGElement.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    setHover(Math.max(0, Math.min(n, Math.round((x - L) / ((W - L - 8) / n)))));
  }

  const h = hover !== null ? days[hover] : null;

  return (
    <div className="chart" ref={box}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="შემოსავალი დღეების მიხედვით">
        <defs>
          <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E8B86B" stopOpacity=".35" />
            <stop offset="1" stopColor="#E8B86B" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="chart__grid">
          {ticks.map((v) => (
            <line key={v} x1={L} x2={W - 8} y1={Y(v)} y2={Y(v)} />
          ))}
        </g>
        <path d={area} fill="url(#chartArea)" />
        <path d={line} fill="none" stroke="#E8B86B" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {h && (
          <>
            <line x1={X(hover)} x2={X(hover)} y1={T} y2={H - B} stroke="rgba(255,226,168,.5)" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
            <circle cx={X(hover)} cy={Y(h.value)} r="5" fill="#FFE6B4" stroke="#140F2C" strokeWidth="2" />
          </>
        )}
        <g className="chart__ax">
          {ticks.map((v) => (
            <text key={v} x={L - 8} y={Y(v) + 3} textAnchor="end">
              {v / 1000}k
            </text>
          ))}
          {days.map((d, i) =>
            i % 3 === 1 || i === n ? (
              <text key={i} x={X(i)} y={H - 6} textAnchor="middle">
                {shortDate(d.date)}
              </text>
            ) : null
          )}
        </g>
        <rect x={L} y="0" width={W - L} height={H} fill="transparent" onPointerMove={onMove} onPointerDown={onMove} onPointerLeave={() => setHover(null)} />
      </svg>
      {h && (
        <div className="chart__tip" style={{ left: `${(X(hover) / W) * 100}%`, top: `${(Y(h.value) / H) * 100}%` }}>
          {shortDate(h.date)}
          <b>{gel(h.value)}</b>
        </div>
      )}
    </div>
  );
}
