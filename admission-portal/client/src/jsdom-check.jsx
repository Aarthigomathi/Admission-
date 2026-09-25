/**
 * jsdom integration harness (bundled by Vite, executed by scripts/jsdom-runner.cjs).
 *
 * Mounts the real application with real API calls against a running server and
 * returns the rendered HTML for assertions.
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider, ToastProvider } from './hooks.jsx';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

export async function renderRoute(path, token, { settleMs = 900 } = {}) {
  if (token) localStorage.setItem('cc_token', token);
  else localStorage.removeItem('cc_token');

  const host = document.createElement('div');
  host.id = 'test-root';
  document.body.appendChild(host);
  const root = createRoot(host);

  await act(async () => {
    root.render(
      <ToastProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={[path]}>
            <App />
          </MemoryRouter>
        </AuthProvider>
      </ToastProvider>,
    );
  });

  // Let effects + network settle. Each `act` boundary flushes the work queued
  // by the previous round of promises, so chain several short cycles instead of
  // one long sleep (a single long sleep never flushes a chained auth→fetch→render).
  const step = 120;
  const cycles = Math.max(4, Math.ceil(settleMs / step));
  for (let i = 0; i < cycles; i += 1) {
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, step));
    });
  }
  await act(async () => {});

  const html = host.innerHTML;
  await act(async () => {
    root.unmount();
  });
  host.remove();
  return html;
}

const ENTITIES_MAP = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", nbsp: ' ' };

export function textOf(html) {
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(#?[a-z0-9]+);/gi, (m, code) => ENTITIES_MAP[code.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ');
}
