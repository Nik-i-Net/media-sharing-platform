import { TodoError } from '@/shared/errors';
import type { DrizzleDB } from '@/shared/db/drizzle/client';
import { plansTable } from '@/shared/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import { Plan } from '../domain/plan';
import { ms } from '@/shared/utils';
import type { PlanProvider } from '../application/ports/plan.provider';

export class DrizzlePlanProvider implements PlanProvider {
  private readonly cache = new Map<string, Plan>();

  constructor(
    private readonly db: DrizzleDB,
    private readonly defaultPlanId: string = 'free',
  ) {}

  async getPlan(id: string): Promise<Plan> {
    if (this.cache.has(id)) return this.cache.get(id)!;

    const row = await this.db.query.plansTable.findFirst({
      where: eq(plansTable.id, id),
    });
    if (!row) throw new TodoError('Plan not found');

    const plan = new Plan(row.id, row.allowedMimeTypes, row.maxFileSizeBytes, row.maxStorageBytes);
    this.cache.set(id, plan);
    setTimeout(() => this.cache.delete(id), ms('5m'));

    return plan;
  }

  async getDefaultPlan(): Promise<Plan> {
    return await this.getPlan(this.defaultPlanId);
  }
}
