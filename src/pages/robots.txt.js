// robots.txt: every crawler is welcome, including AI search and AI training bots
// (decided Nov 27, 2026). Change this file to block any of them later.
export function GET({ site }) {
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap.xml', site)}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
