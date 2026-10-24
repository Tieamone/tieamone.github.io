// GitHub OAuth bridge for Decap CMS. Deploy as a Cloudflare module Worker.
// Secrets are supplied by Cloudflare, never by the browser or the repository.
const COOKIE = '__Host-cms-oauth';
const TTL = 600;
const encode = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const random = () => encode(crypto.getRandomValues(new Uint8Array(32)));
const clearCookie = COOKIE + '=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';
const headers = {
  'Cache-Control': 'no-store',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

function reply(message, status = 200, extra = {}) {
  return new Response(message, { status, headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8', ...extra } });
}

function popup(origin, payload) {
  const nonce = random();
  const literal = value => JSON.stringify(value).replace(/</g, '\\u003c');
  const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>GitHub 登录完成</title><p>登录完成，正在返回编辑器。若未自动返回，请关闭此窗口并重试。</p>
<script nonce="${nonce}">
const origin = ${literal(origin)};
const message = ${literal('authorization:github:success:' + JSON.stringify(payload))};
function receive(event) {
  if (event.origin !== origin || event.source !== window.opener || event.data !== 'authorizing:github') return;
  window.opener.postMessage(message, origin);
  window.removeEventListener('message', receive);
  window.close();
}
window.addEventListener('message', receive);
if (window.opener) window.opener.postMessage('authorizing:github', origin);
</script></html>`;
  return new Response(html, { headers: {
    ...headers, 'Content-Type': 'text/html; charset=utf-8', 'Set-Cookie': clearCookie,
    'Content-Security-Policy': "default-src 'none'; script-src 'nonce-" + nonce + "'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
  } });
}

export async function handleRequest(request, env, fetcher = fetch) {
  const url = new URL(request.url);
  if (request.method !== 'GET') return reply('Method not allowed', 405, { Allow: 'GET' });
  if (!['/auth', '/callback', '/health'].includes(url.pathname)) return reply('Not found', 404);

  let origin;
  try {
    origin = new URL(env.SITE_ORIGIN);
    if (origin.protocol !== 'https:' || origin.origin !== env.SITE_ORIGIN ||
        !env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET ||
        !/^[a-z\d-]+$/i.test(env.ALLOWED_GITHUB_USER || '') ||
        !/^[a-z\d_.-]+\/[a-z\d_.-]+$/i.test(env.GITHUB_REPO || '')) throw new Error();
  } catch {
    return reply('认证服务尚未配置完成。', 503);
  }
  if (url.protocol !== 'https:') return reply('HTTPS required', 400);
  if (url.pathname === '/health') return reply('ok');

  if (url.pathname === '/auth') {
    if (url.searchParams.get('provider') !== 'github' ||
        url.searchParams.get('site_id') !== origin.hostname) return reply('无效的登录来源。', 400);
    const state = random();
    const verifier = random();
    const challenge = encode(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))));
    const github = new URL('https://github.com/login/oauth/authorize');
    github.search = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: url.origin + '/callback',
      scope: 'public_repo',
      state, code_challenge: challenge, code_challenge_method: 'S256',
      login: env.ALLOWED_GITHUB_USER,
    }).toString();
    const cookie = encode(new TextEncoder().encode(JSON.stringify({ state, verifier, expires: Date.now() + TTL * 1000 })));
    return new Response(null, { status: 302, headers: {
      ...headers, Location: github.href,
      'Set-Cookie': COOKIE + '=' + cookie + '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=' + TTL,
    } });
  }

  try {
    const raw = request.headers.get('Cookie')?.split(';').map(value => value.trim()).find(value => value.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1);
    if (!raw) throw new Error();
    const session = JSON.parse(atob(raw.replace(/-/g, '+').replace(/_/g, '/')));
    const state = url.searchParams.get('state');
    const code = url.searchParams.get('code');
    if (!state || state !== session.state || !code || url.searchParams.has('error') ||
        !Number.isFinite(session.expires) || Date.now() > session.expires ||
        !/^[A-Za-z0-9_-]{43}$/.test(session.verifier)) throw new Error();

    const response = await fetcher('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET,
        code, redirect_uri: url.origin + '/callback', code_verifier: session.verifier,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error();
    const token = await response.json();
    if (typeof token.access_token !== 'string' || !token.access_token || token.error) throw new Error();
    const apiHeaders = { Authorization: 'Bearer ' + token.access_token, Accept: 'application/vnd.github+json', 'User-Agent': 'personal-site-cms' };
    const profileResponse = await fetcher('https://api.github.com/user', { headers: apiHeaders, signal: AbortSignal.timeout(15000) });
    if (!profileResponse.ok) throw new Error();
    const profile = await profileResponse.json();
    if (String(profile.login).toLowerCase() !== env.ALLOWED_GITHUB_USER.toLowerCase()) {
      return reply('此账号无权管理该网站。请使用站点所有者账号重新登录。', 403, { 'Set-Cookie': clearCookie });
    }
    const repoResponse = await fetcher('https://api.github.com/repos/' + env.GITHUB_REPO, { headers: apiHeaders, signal: AbortSignal.timeout(15000) });
    if (!repoResponse.ok) throw new Error();
    const repo = await repoResponse.json();
    if (!repo.permissions?.push || repo.private !== false ||
        String(repo.full_name).toLowerCase() !== env.GITHUB_REPO.toLowerCase()) {
      return reply('请确认账号具有目标公开仓库的写入权限。', 403, { 'Set-Cookie': clearCookie });
    }
    return popup(origin.origin, { token: token.access_token, provider: 'github' });
  } catch {
    // Never return GitHub error bodies, codes, tokens, cookies or secrets.
    return reply('登录未完成或已过期，请关闭此窗口并重新登录。', 400, { 'Set-Cookie': clearCookie });
  }
}

export default { fetch(request, env) { return handleRequest(request, env); } };
