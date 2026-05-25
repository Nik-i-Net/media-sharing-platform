import type { UsersRepository } from '../domain/users.repository';
import { User } from '../domain/user';
import { subscriptionsTable, usersTable } from '@/shared/db/drizzle/schema';
import { eq, and, type SQL } from 'drizzle-orm';
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
          updatedAt: user.updatedAt,
          deletedAt: user.deletedAt,
        },
      });
  }

  async findById(id: string): Promise<User | null> {
    return await this.findUserWithPlan(eq(usersTable.id, id));
  }

  async findByExternalId(id: string): Promise<User | null> {
    return await this.findUserWithPlan(eq(usersTable.auth0UserId, id));
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.findUserWithPlan(eq(usersTable.email, email));
  }

  private async findUserWithPlan(whereCondition: SQL): Promise<User | null> {
    const [row] = await this.db
      .select({
        id: usersTable.id,
        externalId: usersTable.auth0UserId,
        email: usersTable.email,
        emailVerified: usersTable.emailVerified,
        identities: usersTable.identities,
        totalStorageBytes: usersTable.totalStorageBytes,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
        deletedAt: usersTable.deletedAt,
        planId: subscriptionsTable.planId,
      })
      .from(usersTable)
      .leftJoin(
        subscriptionsTable,
        and(
          eq(subscriptionsTable.userId, usersTable.id), //
          eq(subscriptionsTable.status, 'active'),
        ),
      )
      .where(whereCondition)
      .limit(1);

    if (!row) return null;

    const plan = row.planId
      ? await this.planProvider.getPlan(row.planId)
      : await this.planProvider.getDefaultPlan();

    return new User({ ...row, plan });
  }
}
