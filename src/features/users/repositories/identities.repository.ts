import { Identity } from '../domain/identity';
import type { Knex } from 'knex';

export class IdentitiesRepository {
  constructor(private readonly db: Knex | Knex.Transaction) {}

  async save(identity: Identity): Promise<void> {
    const data = this.toPersistence(identity);
    await this.db('identities')
      .insert(data)
      .onConflict('id')
      .merge(['email', 'email_verified', 'updated_at']);
  }

  async findByProviderIdentity(provider: string, providerUserId: string): Promise<Identity | null> {
    const record = await this.db('identities')
      .where({ provider, provider_user_id: providerUserId })
      .first();
    if (!record) return null;
    return this.toDomain(record);
  }

  async findByEmail(email: string): Promise<Identity | null> {
    const record = await this.db('identities').where({ email }).first();
    if (!record) return null;
    return this.toDomain(record);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const found = await this.db('identities').where({ email }).first('id');
    return Boolean(found);
  }

  async delete(id: string): Promise<boolean> {
    const affectedRows = await this.db('identities').where({ id }).del();
    return affectedRows > 0;
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

interface IdentityRecord {
  id: string;
  user_id: string;
  provider: string;
  provider_user_id: string;
  email: string | null;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;
}
type InsertIdentityRecord = IdentityRecord;
type UpdateIdentityRecord = Partial<
  Pick<IdentityRecord, 'email' | 'email_verified' | 'updated_at'>
>;

declare module 'knex/types/tables' {
  interface Tables {
    identities: Knex.CompositeTableType<IdentityRecord, InsertIdentityRecord, UpdateIdentityRecord>;
  }
}
