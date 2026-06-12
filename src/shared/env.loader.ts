const vars = [
  'NODE_ENV',

  'PORT',
  'HOST',

  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_DB',

  'JWT_ISSUER',
  'JWT_AUDIENCE',
  'AUTH0_API_KEY',

  'CLOUDFLARE_ACCOUNT_ID',
  'CLOUDFLARE_ACCESS_KEY_ID',
  'CLOUDFLARE_SECRET_ACCESS_KEY',
  'CLOUDFLARE_BUCKET',
  'CLOUDFLARE_API_KEY',

  'CLIENT_BASE_URL',
  'MEDIA_BASE_URL',

  'STRIPE_API_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRO_PLAN_PRICE_ID',

  'REDIS_HOST',
  'REDIS_PORT',
] as const;

const ENV = {} as Record<(typeof vars)[number], string>;

for (const name of vars) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[env] ${name} is missing`);
  }
  ENV[name] = value;
}

export { ENV };
