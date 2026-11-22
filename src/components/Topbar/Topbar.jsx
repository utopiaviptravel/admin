'use client';

import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo/Logo';
import { logout } from '@/lib/logout';
import './Topbar.css';

// phone header (hidden on desktop)
export default function Topbar() {
  const router = useRouter();
  return (
    <header className="topbar">
      <Logo />
      <button className="btn sm mt" onClick={() => logout(router)}>
        გამოსვლა
      </button>
    </header>
  );
}
