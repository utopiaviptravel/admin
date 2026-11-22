'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import './Toast.css';

const ToastContext = createContext(() => {});

// const toast = useToast(); toast('შენახულია');
export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('');
  const [on, setOn] = useState(false);
  const timer = useRef();

  const show = useCallback((text) => {
    setMsg(text);
    setOn(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOn(false), 2400);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className={`toast${on ? ' toast--on' : ''}`} role="status">
        {msg}
      </div>
    </ToastContext.Provider>
  );
}
