// robots.txt: every crawler welcome (rules in src/core/seo.ts).
import type { APIRoute } from 'astro';
import { robotsTxt } from '../core/seo';

export const GET: APIRoute = ({ site, url }) =>
  new Response(robotsTxt(site ?? url), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
