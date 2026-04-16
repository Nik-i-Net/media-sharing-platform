import type { Knex } from 'knex';
import { Identity } from '../entities/identity';

export class IdentitiesRepository {
  constructor(private readonly qb: Knex | Knex.Transaction) {}

  async save(identity: Identity): Promise<void> {
    const data = this.toPersistence(identity);
    await this.identities
      .insert(data)
      .onConflict('id')
      .merge(['email', 'email_verified', 'updated_at']);
  }

  async findByProviderIdentity(provider: string, providerUserId: string): Promise<Identity | null> {
    const record = await this.identities
      .where({ provider, provider_user_id: providerUserId })
      .first();
    if (!record) return null;
    return this.toDomain(record);
  }

  async findByEmail(email: string): Promise<Identity | null> {
    const record = await this.identities.where({ email }).first();
    if (!record) return null;
    return this.toDomain(record);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const found = await this.identities.where({ email }).first('id');
    return Boolean(found);
  }

  async delete(id: string): Promise<boolean> {
    const affectedRows = await this.identities.where({ id }).del();
    return affectedRows > 0;
  }

  private get identities() {
    return this.qb('identities');
  }

  private toPersistence(identity: Identity): InsertIdentityRecord {
    return {
      id: identity.id,
      user_id: identity.userId,
      provider: identity.provider,
      provider_user_id: identity.providerUserId,
      email: identity.email,
      email_verified: identity.emailVerified,
      created_at: identity.createdAt,
      updated_at: identity.updatedAt,
    };
  }

  private toDomain(record: IdentityRecord): Identity {
    return new Identity({
      id: record.id,
      userId: record.user_id,
      provider: record.provider,
      providerUserId: record.provider_user_id,
      email: record.email,
      emailVerified: record.email_verified,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
    });
  }
}

export interface IdentityRecord {
  id: string;
  user_id: string;
  provider: string;
  provider_user_id: string;
  email: string | null;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export type InsertIdentityRecord = IdentityRecord;
export type UpdateIdentityRecord = Partial<
  Pick<IdentityRecord, 'email' | 'email_verified' | 'updated_at'>
>;
