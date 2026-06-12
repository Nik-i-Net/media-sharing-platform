import { plansTable } from '@/shared/db/drizzle/schema';
import type { DrizzleDB } from '@/shared/db/drizzle/types';
import { TodoError } from '@/shared/errors';
import { ms } from '@/shared/utils';
import { eq } from 'drizzle-orm';
import type { PlanProvider } from '../application/ports/plan.provider';
import { Plan } from '../domain/plan';

export class DrizzlePlanProvider implements PlanProvider {
  private readonly defaultPlanId = 'free';
  private readonly cache = new Map<string, Plan>();

  constructor(private readonly db: DrizzleDB) {}

  async getPlan(id: 'free' | 'pro'): Promise<Plan> {
    if (this.cache.has(id)) return this.cache.get(id)!;

    const row = await this.db.query.plansTable.findFirst({
      where: eq(plansTable.id, id),
    });
    if (!row) throw new TodoError('Plan not found');

    const plan = new Plan(row.allowedMimeTypes, row.maxFileSizeBytes, row.maxTotalStorageBytes);
    this.cache.set(id, plan);
    setTimeout(() => this.cache.delete(id), ms('5m'));

    return plan;
  }

  async getDefaultPlan(): Promise<Plan> {
    return await this.getPlan(this.defaultPlanId);
  }
}
