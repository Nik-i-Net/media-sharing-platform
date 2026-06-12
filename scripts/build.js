import { spawn } from 'child_process';

const builds = [
  {
    entry: 'src/server.ts',
    out: 'dist/server.js',
  },
  {
    entry: 'cron/scheduler.ts',
    out: 'dist/cron.js',
  },
  {
    entry: 'src/shared/db/drizzle/migrate.ts',
    out: 'dist/migrate.js',
  },
  {
    entry: 'src/shared/db/drizzle/seeds/index.ts',
    out: 'dist/seed.js',
  },
];

for (const { entry, out } of builds) {
  await new Promise((resolve, reject) => {
    const args = [
      entry,
      '--bundle',
      '--format=esm',
      '--platform=node',
      '--packages=external',
      '--target=node24.16',
      `--outfile=${out}`,
    ];

    const child = spawn('esbuild', args, {
      stdio: 'inherit',
    });

    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Build failed: ${entry}`));
    });
  });
}

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

// "build:server": "esbuild src/server.ts --bundle --format=esm --platform=node --packages=external --target=node24.16 --outfile=dist/server.js",
// "build:cron": "esbuild cron/scheduler.ts --bundle --format=esm --platform=node --packages=external --target=node24.16 --outfile=dist/cron.js",
// "build:migrate": "esbuild src/shared/db/drizzle/migrate.ts --bundle --format=esm --platform=node --packages=external --target=node24.16 --outfile=dist/migrate.js",
// "build:seed": "esbuild ./src/shared/db/drizzle/seeds/index.ts --bundle --format=esm --platform=node --packages=external --target=node24.16 --outfile=dist/seed.js",
// "build": "tsgo --noEmit && pnpm build:server && pnpm build:cron && pnpm build:migrate && pnpm build:seed",
