import type { APIContext } from 'astro';
import { site } from '../config/site';

/** 动态 robots.txt：Sitemap 地址从 site 配置生成，不硬编码域名。 */
export function GET(context: APIContext) {
  const base = context.site ?? new URL(site.url);
  const sitemapURL = new URL('sitemap-index.xml', base).href;

  const body = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: ${sitemapURL}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
