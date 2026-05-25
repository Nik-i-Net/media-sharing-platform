import { ENV } from '@/shared/env.loader';
import { db } from '../client';
import { seed_plans } from './plan.seeds';
// import { seed_test_users } from './test-users.seeds';

await seed_plans(db);

if (ENV.NODE_ENV === 'development') {
  // await seed_test_users(db);
}

await db.$client.end();
