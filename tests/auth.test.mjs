import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest } from '../auth/worker.js';

const env = {
  SITE_ORIGIN: 'https://tieamone.github.io',
  ALLOWED_GITHUB_USER: 'Tieamone',
  GITHUB_REPO: 'Tieamone/tieamone.github.io',
  GITHUB_CLIENT_ID: 'test-client',
  GITHUB_CLIENT_SECRET: 'test-secret',
};
const start = () => handleRequest(new Request('https://auth.example/auth?provider=github&site_id=tieamone.github.io'), env);

async function callback(fetcher, mutate = value => value) {
  const response = await start();
  const state = new URL(response.headers.get('location')).searchParams.get('state');
  const cookie = response.headers.get('set-cookie').split(';')[0];
  return handleRequest(new Request(mutate('https://auth.example/callback?code=fake-code&state=' + state), {
    headers: { Cookie: cookie },
  }), env, fetcher);
}
function mockGithub({ login = 'Tieamone', push = true, fail = false, secretToken = 'test-token' } = {}) {
  const calls = [];
  const fetcher = async (url, options) => {
    calls.push({ url, options });
    if (fail) return new Response('upstream-sensitive-details', { status: 500 });
    if (url.endsWith('/access_token')) return Response.json({ access_token: secretToken });
    if (url.endsWith('/user')) return Response.json({ login });
    return Response.json({ full_name: env.GITHUB_REPO, private: false, permissions: { push } });
  };
  return { fetcher, calls };
}

test('unconfigured service fails closed; unsupported methods and paths are rejected', async () => {
  assert.equal((await handleRequest(new Request('https://auth.example/auth'), {})).status, 503);
  assert.equal((await handleRequest(new Request('https://auth.example/auth', { method: 'POST' }), env)).status, 405);
  assert.equal((await handleRequest(new Request('https://auth.example/unknown'), env)).status, 404);
  assert.equal((await handleRequest(new Request('https://auth.example/health'), env)).status, 200);
});
test('auth restricts site/provider and forces public repository scope', async () => {
  assert.equal((await handleRequest(new Request('https://auth.example/auth?provider=github&site_id=evil.example'), env)).status, 400);
  const response = await start();
  assert.equal(response.status, 302);
  const target = new URL(response.headers.get('location'));
  assert.equal(target.origin, 'https://github.com');
  assert.equal(target.searchParams.get('scope'), 'public_repo');
  assert.equal(target.searchParams.get('redirect_uri'), 'https://auth.example/callback');
  assert.equal(target.searchParams.get('code_challenge_method'), 'S256');
  assert.equal(target.searchParams.get('code_challenge').length, 43);
  assert.match(response.headers.get('set-cookie'), /HttpOnly; Secure; SameSite=Lax; Max-Age=600/);
  assert.notEqual(target.searchParams.get('state'), new URL((await start()).headers.get('location')).searchParams.get('state'));
});
test('missing/mismatched/expired state does not contact GitHub', async () => {
  const { fetcher, calls } = mockGithub();
  assert.equal((await handleRequest(new Request('https://auth.example/callback?code=x&state=x'), env, fetcher)).status, 400);
  assert.equal((await callback(fetcher, url => url.replace(/state=.*/, 'state=wrong'))).status, 400);
  const cookie = Buffer.from(JSON.stringify({ state: 'x', verifier: 'a'.repeat(43), expires: Date.now() - 1 })).toString('base64url');
  const response = await handleRequest(new Request('https://auth.example/callback?code=x&state=x', {
    headers: { Cookie: '__Host-cms-oauth=' + cookie },
  }), env, fetcher);
  assert.equal(response.status, 400);
  assert.equal(calls.length, 0);
});
test('successful login verifies owner and repo, uses PKCE and restricts popup messaging', async () => {
  const { fetcher, calls } = mockGithub();
  const response = await callback(fetcher);
  assert.equal(response.status, 200);
  assert.equal(calls.length, 3);
  assert.equal(calls[0].options.body.get('client_secret'), env.GITHUB_CLIENT_SECRET);
  assert.equal(calls[0].options.body.get('code_verifier').length, 43);
  const html = await response.text();
  assert.ok(html.includes('authorization:github:success:'));
  assert.ok(html.includes('event.origin !== origin'));
  assert.ok(html.includes('event.source !== window.opener'));
  assert.ok(html.includes('https://tieamone.github.io'));
  assert.ok(!html.includes(env.GITHUB_CLIENT_SECRET));
  assert.match(response.headers.get('Content-Security-Policy'), /script-src 'nonce-/);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.match(response.headers.get('Set-Cookie'), /Max-Age=0/);
});
test('other accounts and missing repository access never receive a token', async () => {
  for (const options of [{ login: 'someone-else' }, { push: false }]) {
    const { fetcher } = mockGithub(options);
    const response = await callback(fetcher);
    assert.equal(response.status, 403);
    assert.ok(!(await response.text()).includes('test-token'));
  }
});
test('upstream errors and script-breaking tokens cannot expose secrets or inject scripts', async () => {
  const failed = await callback(mockGithub({ fail: true }).fetcher);
  assert.equal(failed.status, 400);
  assert.ok(!(await failed.text()).includes('upstream-sensitive-details'));
  const response = await callback(mockGithub({ secretToken: '</script><script>alert(1)</script>' }).fetcher);
  const html = await response.text();
  assert.ok(!html.includes('</script><script>'));
});
