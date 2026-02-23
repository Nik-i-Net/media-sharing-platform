const vars = [
  'PORT',

  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_DB',

  'SECRETS_PATH',

  'JWT_ISSUER',
  'JWT_AUDIENCE',
] as const;

const env = {} as Record<(typeof vars)[number], string>;

for (const name of vars) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[env] ${name} is missing`);
  }
  env[name] = value;
}

export { env };
