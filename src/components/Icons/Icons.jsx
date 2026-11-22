// all icons in one place: <Icon.check />
const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Svg = ({ children, ...p }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...s} {...p}>
    {children}
  </svg>
);

export const Icon = {
  check: (p) => <Svg {...p}><path d="M5 12l5 5 9-10" /></Svg>,
  clock: (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Svg>,
  x: (p) => <Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>,
  back: (p) => <Svg {...p}><path d="M9 14L4 9l5-5" /><path d="M4 9h10a6 6 0 0 1 0 12h-3" /></Svg>,
  phone: (p) => <Svg {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></Svg>,
  wa: (p) => <Svg {...p}><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" /><path d="M9 9.5c.3 1.8 1.7 3.3 3.5 4l1.2-1.2 2 .8c-.2 1.2-1.1 1.9-2.2 1.9A6 6 0 0 1 8 9.5c0-1.1.7-2 1.9-2.2l.8 2z" /></Svg>,
  doc: (p) => <Svg {...p}><path d="M6 3h9l4 4v14H6z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></Svg>,
  grid: (p) => <Svg {...p}><rect x="3" y="3" width="7" height="9" rx="2" /><rect x="14" y="3" width="7" height="5" rx="2" /><rect x="14" y="12" width="7" height="9" rx="2" /><rect x="3" y="16" width="7" height="5" rx="2" /></Svg>,
  receipt: (p) => <Svg {...p}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6" /></Svg>,
  pyramid: (p) => <Svg {...p}><path d="M12 3L2 21h20z" /><path d="M12 3l2 18M7 14h10" /></Svg>,
  logout: (p) => <Svg {...p}><path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" /></Svg>,
  arrow: (p) => <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>,
  search: (p) => <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></Svg>,
  eye: (p) => <Svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Svg>,
};
