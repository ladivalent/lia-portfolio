// Password lock for unfinished case studies.
// Runs on Vercel before any file is served. Locked pages need a cookie that is
// only set after the right password is entered on /unlock.html.
import { next } from '@vercel/functions';

// SHA-256 of "lia-portfolio-v1|<password>". To change the password, replace this hash.
const PASSWORD_HASH = '512658cf97f74501ff547f393d518d6bebc6a2ac2a2c1be28e226549d91ffb98';
const COOKIE = 'lia_preview';
const MAX_AGE = 60 * 60 * 24 * 30; // stay unlocked for 30 days

const LOCKED = [
  /^\/Work-SizePersonalization\.dc\.html$/,
  /^\/Work-LocalPickup\.dc\.html$/,
  /^\/embeds\/AI-Size-Intelligence-/,
  /^\/embeds\/Local-Pickup-/,
  /^\/embeds\/proto-video\//,
];

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function safeNext(value) {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/';
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = decodeURIComponent(url.pathname);

  // Password form submits here.
  if (path === '/__unlock') {
    const target = safeNext(url.searchParams.get('next'));
    const pw = (url.searchParams.get('pw') || '').trim();
    if (pw && (await sha256('lia-portfolio-v1|' + pw)) === PASSWORD_HASH) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: target,
          'Set-Cookie': `${COOKIE}=${PASSWORD_HASH}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
          'Cache-Control': 'no-store',
        },
      });
    }
    return new Response(null, {
      status: 303,
      headers: { Location: '/unlock.html?error=1&next=' + encodeURIComponent(target), 'Cache-Control': 'no-store' },
    });
  }

  if (!LOCKED.some((re) => re.test(path))) return next();

  const cookies = request.headers.get('cookie') || '';
  const ok = cookies.split(/;\s*/).some((c) => c === `${COOKIE}=${PASSWORD_HASH}`);
  if (ok) return next({ headers: { 'Cache-Control': 'private, no-store' } });

  return new Response(null, {
    status: 307,
    headers: { Location: '/unlock.html?next=' + encodeURIComponent(url.pathname + url.search), 'Cache-Control': 'no-store' },
  });
}

export const config = {
  runtime: 'nodejs',
};
