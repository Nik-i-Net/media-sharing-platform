import type { Plan } from '../../domain/plan';

export interface PlanProvider {
  getPlan(id: string): Promise<Plan>;
  getDefaultPlan(): Promise<Plan>;
}
