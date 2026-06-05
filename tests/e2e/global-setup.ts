import { exec } from 'node:child_process';
import { loadEnvFile } from 'node:process';
import { setTimeout as sleep } from 'node:timers/promises';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const envFile = '.env.test';

export async function setup() {
  console.log('Setting up test environment');
  loadEnvFile(envFile);

  console.log('Starting services');
  await execAsync(`docker compose -f docker-compose.test.yml --env-file ${envFile} up -d`);

  await Promise.all([
    waitForService('docker exec postgres-test pg_isready', 'postgres'),
    waitForService('docker exec redis-test redis-cli ping', 'redis'),
  ]);

  console.log('Pushing database schema');
  await execAsync(`pnpm drizzle-kit push --config=drizzle.test.config.ts`);

  console.log('Seeding database');
  const { db } = await import('@/shared/db/drizzle/client');
  const { seed_plans } = await import('@/shared/db/drizzle/seeds/plan.seeds');
  await seed_plans(db);
}

export async function teardown() {
  console.log('Tearing down test environment');
  await sleep(1000);
  await execAsync(`docker compose -f docker-compose.test.yml --env-file ${envFile} down`);
}

// Helpers
export async function waitForService(checkCommand: string, serviceName: string) {
  let attempts = 0;
  while (attempts < 10) {
    try {
      await execAsync(checkCommand);
      console.log(`${serviceName} started`);
      return;
    } catch {
      attempts += 1;
      await sleep(1000);
    }
  }

  throw new Error(`${serviceName} failed to start`);
}
