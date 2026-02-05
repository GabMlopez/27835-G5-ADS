import { useEffect, useRef } from 'react';
import { useAuth } from '../context/auth_context';
import { useNavigate } from 'react-router-dom';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; 

export function use_inactivity_timeout() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const timeout_ref = useRef(null);

  const reset_timer = () => {
    if (timeout_ref.current) {
      clearTimeout(timeout_ref.current);
    }

    if (token) {
      timeout_ref.current = set_timeout(() => {
        logout();
        navigate('/login');
        alert('Sesión cerrada por inactividad (30 minutos)');
      }, INACTIVITY_TIMEOUT);
    }
  };

  useEffect(() => {
    if (!token) {
      if (timeout_ref.current) clear_timeout(timeoutRef.current);
      return;
    }

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    const handler = () => reset_timer();

    events.forEach(event => window.addEventListener(event, handler));

    reset_timer;

    return () => {
      events.forEach(event => window.removeEventListener(event, handler));
      if (timeout_ref.current) clear_timeout(timeout_ref.current);
    };
  }, [token, logout, navigate]);
}