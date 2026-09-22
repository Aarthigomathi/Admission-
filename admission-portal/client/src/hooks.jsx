import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api, clearToken, getToken, joinCollegeRoom, on, setToken } from './api.js';

/* ------------------------------------------------------------------ *
 * Toasts
 * ------------------------------------------------------------------ */
const ToastContext = createContext({ push: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const push = useCallback((message, tone = 'info', ttl = 4800) => {
    const id = (idRef.current += 1);
    setToasts((list) => [...list, { id, message, tone }]);
    if (ttl) setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), ttl);
    return id;
  }, []);

  const value = useMemo(
    () => ({
      push,
      success: (m) => push(m, 'success'),
      error: (m) => push(m, 'error'),
      info: (m) => push(m, 'info'),
      live: (m) => push(m, 'live', 6500),
      dismiss: (id) => setToasts((list) => list.filter((t) => t.id !== id)),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-wrap" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.tone}`}>
            <span>{t.tone === 'live' ? '📡' : t.tone === 'success' ? '✅' : t.tone === 'error' ? '⚠️' : 'ℹ️'}</span>
            <span>{t.message}</span>
            <button onClick={() => value.dismiss(t.id)} aria-label="Dismiss">
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

/* ------------------------------------------------------------------ *
 * Auth (college session)
 * ------------------------------------------------------------------ */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setSession(null);
      setLoading(false);
      return null;
    }
    try {
      const data = await api.me();
      setSession(data);
      return data;
    } catch {
      clearToken();
      setSession(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (identifier, password) => {
    const data = await api.login(identifier, password);
    setToken(data.token);
    const me = await api.me();
    setSession(me);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await api.register(payload);
    setToken(data.token);
    const me = await api.me();
    setSession(me);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    clearToken();
    setSession(null);
  }, []);

  // join the private realtime room for this college
  useEffect(() => {
    if (session?.college?.id) joinCollegeRoom(session.college.id);
  }, [session?.college?.id]);

  const value = useMemo(
    () => ({ session, college: session?.college, account: session?.account, completeness: session?.completeness, loading, login, register, logout, refresh, setSession }),
    [session, loading, login, register, logout, refresh],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

/* ------------------------------------------------------------------ *
 * Data fetching + realtime
 * ------------------------------------------------------------------ */
export function useSocketEvent(event, handler, deps = []) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    const off = on(event, (...args) => ref.current?.(...args));
    return off;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, ...deps]);
}

/** Small async-state helper with loading/error + manual reload. */
export function useAsync(fn, deps = [], { immediate = true } = {}) {
  const [state, setState] = useState({ data: null, loading: immediate, error: null });
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fnRef.current();
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      setState({ data: null, loading: false, error: err.message || 'Something went wrong' });
      return null;
    }
  }, []);

  useEffect(() => {
    if (immediate) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, reload: run, setData: (data) => setState((s) => ({ ...s, data })) };
}

/** Live connection indicator. */
export function useLiveStatus() {
  const [live, setLive] = useState(false);
  useEffect(() => {
    const offConnect = on('connect', () => setLive(true));
    const offDisconnect = on('disconnect', () => setLive(false));
    return () => {
      offConnect();
      offDisconnect();
    };
  }, []);
  return live;
}

/** Debounced value (search boxes). */
export function useDebounced(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
