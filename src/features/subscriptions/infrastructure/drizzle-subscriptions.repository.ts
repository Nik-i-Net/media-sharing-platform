import type { DrizzleDB, DrizzleTransaction } from '@/shared/db/drizzle/client';
import { subscriptionsTable } from '@/shared/db/drizzle/schema';
import { and, eq, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { Subscription } from '../domain/subscription';
import type { SubscriptionsRepository } from '../domain/subscriptions.repository';
import assert from 'assert';

export class DrizzleSubscriptionsRepository implements SubscriptionsRepository {
  constructor(private readonly db: DrizzleDB | DrizzleTransaction) {}

  async save(subscription: Subscription): Promise<void> {
    await this.db
      .insert(subscriptionsTable)
      .values(this.toInsertModel(subscription))
      .onConflictDoUpdate({
        target: subscriptionsTable.id,
        set: {
          status: subscription.status,
          expiresAt: subscription.expiresAt,
          updatedAt: subscription.updatedAt,
        },
      });
  }

  async findByProviderSubscriptionId(id: string): Promise<Subscription | null> {
    const row = await this.db.query.subscriptionsTable.findFirst({
      where: eq(subscriptionsTable.providerSubscriptionId, id),
    });

    if (!row) return null;
    return this.toDomain(row);
  }

  async findActiveByUserId(userId: string): Promise<Subscription[]> {
    const rows = await this.db.query.subscriptionsTable.findMany({
      where: and(
        eq(subscriptionsTable.userId, userId), //
        eq(subscriptionsTable.status, 'active'),
      ),
    });

    return rows.map((row) => this.toDomain(row));
  }

  private toDomain(row: InferSelectModel<typeof subscriptionsTable>) {
    assert(row.planId === 'pro');
    return new Subscription(
      row.id,
      row.userId,
      row.planId,
      row.provider,
      row.providerSubscriptionId,
      row.status,
      row.expiresAt,
      row.createdAt,
      row.updatedAt,
    );
  }

  private toInsertModel(subscription: Subscription): InferInsertModel<typeof subscriptionsTable> {
    return {
      id: subscription.id,
      userId: subscription.userId,
      planId: subscription.planId,
      provider: subscription.provider,
      providerSubscriptionId: subscription.providerSubscriptionId,
      status: subscription.status,
      expiresAt: subscription.expiresAt,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }
}
