import type { UsersRepository } from '../domain/users.repository';
import { User } from '../domain/user';
import { usersTable } from '@/shared/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import type { DrizzleDB, DrizzleTransaction } from '@/shared/db/drizzle/client';
import type { PlanProvider } from '../application/ports/plan.provider';

export class DrizzleUsersRepository implements UsersRepository {
  constructor(
    private readonly db: DrizzleDB | DrizzleTransaction,
    private readonly planProvider: PlanProvider,
  ) {}

  async save(user: User): Promise<void> {
    await this.db
      .insert(usersTable)
      .values({
        id: user.id,
        auth0UserId: user.externalId,
        email: user.email,
        emailVerified: user.emailVerified,
        identities: user.identities,
        totalStorageBytes: user.totalStorageBytes,
        planId: user.plan.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      })
      .onConflictDoUpdate({
        target: usersTable.id,
        set: {
          email: user.email,
          emailVerified: user.emailVerified,
          identities: user.identities,
          totalStorageBytes: user.totalStorageBytes,
          planId: user.plan.id,
          updatedAt: user.updatedAt,
          deletedAt: user.deletedAt,
        },
      });
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.db.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
    });
    if (!row) return null;

    return new User({
      ...row,
      externalId: row.auth0UserId,
      plan: await this.planProvider.getPlan(row.planId),
    });
  }

  async findByExternalId(id: string): Promise<User | null> {
    const row = await this.db.query.usersTable.findFirst({
      where: eq(usersTable.auth0UserId, id),
    });
    if (!row) return null;

    return new User({
      ...row,
      externalId: row.auth0UserId,
      plan: await this.planProvider.getPlan(row.planId),
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });
    if (!row) return null;

    return new User({
      ...row,
      externalId: row.auth0UserId,
      plan: await this.planProvider.getPlan(row.planId),
    });
  }
}
