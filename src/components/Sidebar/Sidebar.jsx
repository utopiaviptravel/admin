'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/Logo/Logo';
import { Icon } from '@/components/Icons/Icons';
import { logout } from '@/lib/logout';
import './Sidebar.css';

export const NAV = [
  { href: '/dashboard', label: 'მიმოხილვა', icon: Icon.grid },
  { href: '/orders', label: 'შეკვეთები', icon: Icon.receipt, badge: true },
  { href: '/tours', label: 'ტურები', icon: Icon.pyramid },
];

// desktop menu (hidden on phones)
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, setPending] = useState(0);

  useEffect(() => {
    fetch('/api/stats/pending', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { pending: 0 }))
      .then((d) => setPending(d.pending || 0))
      .catch(() => {});
  }, [pathname]);

  return (
    <aside className="side">
      <div className="side__logo">
        <Logo />
      </div>

      {NAV.map(({ href, label, icon: I, badge }) => (
        <Link key={href} href={href} className={`side__item${pathname.startsWith(href) ? ' side__item--on' : ''}`}>
          <I />
          <span className="mt">{label}</span>
          {badge && pending > 0 && <span className="badge">{pending}</span>}
        </Link>
      ))}

      <div className="side__foot">
        <span className="side__avatar">A</span>
        <div>
          <b>ადმინი</b>
          <small>Utopia Vip Travel</small>
        </div>
        <button className="btn" onClick={() => logout(router)} aria-label="გამოსვლა" title="გამოსვლა">
          <Icon.logout />
        </button>
      </div>
    </aside>
  );
}
