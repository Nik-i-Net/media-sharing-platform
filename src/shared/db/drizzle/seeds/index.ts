import { db } from '../client';
import { seed_plans } from './plan.seeds';

await seed_plans(db);

await db.$client.end();
