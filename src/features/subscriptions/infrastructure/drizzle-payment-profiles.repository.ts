import type { DrizzleDB, DrizzleTransaction } from '@/shared/db/drizzle/client';
import { paymentProfilesTable } from '@/shared/db/drizzle/schema';
import { and, eq, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { PaymentProfile } from '../domain/payment-profile';
import type { PaymentProfilesRepository } from '../domain/payment-profiles.repository';

export class DrizzlePaymentProfilesRepository implements PaymentProfilesRepository {
  constructor(private readonly db: DrizzleDB | DrizzleTransaction) {}

  async save(profile: PaymentProfile): Promise<void> {
    await this.db
      .insert(paymentProfilesTable) //
      .values(this.toInsertModel(profile));
  }

  async findById(id: string): Promise<PaymentProfile | null> {
    const row = await this.db.query.paymentProfilesTable.findFirst({
      where: eq(paymentProfilesTable.id, id),
    });

    if (!row) return null;
    return this.toDomain(row);
  }

  async findByUserId(userId: string): Promise<PaymentProfile | null> {
    const row = await this.db.query.paymentProfilesTable.findFirst({
      where: eq(paymentProfilesTable.userId, userId),
    });

    if (!row) return null;
    return this.toDomain(row);
  }

  async findByProviderCustomerId(customerId: string): Promise<PaymentProfile | null> {
    const row = await this.db.query.paymentProfilesTable.findFirst({
      where: and(
        eq(paymentProfilesTable.provider, 'stripe'), //
        eq(paymentProfilesTable.providerCustomerId, customerId),
      ),
    });

    if (!row) return null;
    return this.toDomain(row);
  }

  private toDomain(row: InferSelectModel<typeof paymentProfilesTable>) {
    return new PaymentProfile(
      row.id,
      row.userId,
      row.provider,
      row.providerCustomerId,
      row.createdAt,
      row.updatedAt,
    );
  }

  private toInsertModel(profile: PaymentProfile): InferInsertModel<typeof paymentProfilesTable> {
    return {
      id: profile.id,
      userId: profile.userId,
      provider: profile.provider,
      providerCustomerId: profile.providerCustomerId,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
