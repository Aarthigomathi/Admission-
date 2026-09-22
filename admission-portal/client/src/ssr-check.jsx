/**
 * Server-side render smoke check.
 *
 *   npm run check:render   (from the client folder)
 *
 * Renders every route with mocked browser globals and a stubbed API so that any
 * broken import, hook-order problem or JSX error is caught without a browser.
 * Because React effects do not run during SSR, every page is exercised in its
 * initial/loading state — exactly what a first visit renders.
 */
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider, ToastProvider } from './hooks.jsx';

const ROUTES = [
  '/',
  '/colleges',
  '/colleges/psg-college-of-technology',
  '/seats',
  '/track',
  '/college/login',
  '/college/register',
  '/college/dashboard',
  '/college/dashboard/profile',
  '/college/dashboard/import',
  '/college/dashboard/applications',
  '/college/dashboard/enquiries',
  '/college/dashboard/section/courses',
  '/college/dashboard/section/media',
  '/college/dashboard/settings',
  '/definitely-not-a-route',
];

let passed = 0;
let failed = 0;

for (const route of ROUTES) {
  try {
    const html = renderToString(
      <ToastProvider>
        <AuthProvider>
          <MemoryRouter initialEntries={[route]}>
            <App />
          </MemoryRouter>
        </AuthProvider>
      </ToastProvider>,
    );
    const ok = html.length > 200;
    if (ok) passed += 1;
    else failed += 1;
    console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${route.padEnd(46)} ${html.length} chars`);
  } catch (err) {
    failed += 1;
    console.log(` FAIL  ${route.padEnd(46)} ${err.message}`);
  }
}

console.log(`\n  ${passed} routes rendered, ${failed} failed\n`);
if (failed) process.exit(1);
