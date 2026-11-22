'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV } from '@/components/Sidebar/Sidebar';
import './TabBar.css';

// phone bottom menu (hidden on desktop)
export default function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="tabbar" aria-label="მენიუ">
      {NAV.map(({ href, label, icon: I }) => (
        <Link key={href} href={href} className={`tabbar__tab${pathname.startsWith(href) ? ' tabbar__tab--on' : ''}`}>
          <I />
          <span className="mt">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
