'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo/Logo';
import { Icon } from '@/components/Icons/Icons';
import './Login.css';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return setError('შეიყვანე ელფოსტა');
    if (!password) return setError('შეიყვანე პაროლი');
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'შესვლა ვერ მოხერხდა');
      router.replace('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <section className="login">
      <form className="login__card" onSubmit={onSubmit} noValidate>
        <Logo size="lg" />
        <h1 className="login__title mt">ადმინ პანელი</h1>
        <p className="login__sub">შედი, რომ ნახო შეკვეთები და გადახდები</p>

        <div className="login__form">
          <label className="fld">
            <span className="mt">ელფოსტა</span>
            <input
              className="inp"
              type="email"
              autoComplete="username"
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="fld">
            <span className="mt">პაროლი</span>
            <span className="login__pw">
              <input
                className="inp"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShow((v) => !v)} aria-label="პაროლის ჩვენება">
                <Icon.eye />
              </button>
            </span>
          </label>

          <p className="login__err" role="alert">{error}</p>

          <button type="submit" className="btn gold mt" disabled={busy}>
            {busy ? 'მოწმდება…' : 'შესვლა'}
          </button>
        </div>
      </form>
    </section>
  );
}
