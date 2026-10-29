/**
 * The deployed site's origin, for absolute links in share previews. Resolved at
 * build time, in this order:
 * 1. NEXT_PUBLIC_SITE_URL, when set (any host).
 * 2. On a Vercel production build, the project's production domain (the custom
 *    domain once one is added, else its .vercel.app address).
 * 3. On a Vercel preview build, that preview's branch or deployment address.
 * Otherwise undefined, and Next.js falls back to localhost.
 * Vercel's variables: https://vercel.com/docs/environment-variables/system-environment-variables
 */

/** Build-time environment variables, such as `process.env`. */
export type SiteEnv = Readonly<Record<string, string | undefined>>;

/** Vercel gives bare hosts ("sequill.vercel.app"); share links need the scheme. */
const withScheme = (host: string) => (/^https?:\/\//.test(host) ? host : `https://${host}`);

export function resolveSiteUrl(env: SiteEnv): URL | undefined {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return new URL(withScheme(explicit));
  const host =
    env.VERCEL_ENV === "production"
      ? env.VERCEL_PROJECT_PRODUCTION_URL
      : (env.VERCEL_BRANCH_URL ?? env.VERCEL_URL);
  return host ? new URL(withScheme(host)) : undefined;
}
