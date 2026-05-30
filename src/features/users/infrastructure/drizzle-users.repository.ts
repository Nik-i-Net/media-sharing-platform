import { subscriptionsTable, userCountersTable, usersTable } from '@/shared/db/drizzle/schema';
import type { DrizzleDB, DrizzleTransaction } from '@/shared/db/drizzle/types';
import { and, eq, type SQL } from 'drizzle-orm';
import type { PlanProvider } from '../application/ports/plan.provider';
import { User } from '../domain/user';
import type { UsersRepository, UserUploadContext } from '../domain/users.repository';

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
          updatedAt: user.updatedAt,
          deletedAt: user.deletedAt,
        },
      });
  }

  async findById(id: string): Promise<User | null> {
    return await this.findOneWithWhereCondition(eq(usersTable.id, id));
  }

  async findByExternalId(id: string): Promise<User | null> {
    return await this.findOneWithWhereCondition(eq(usersTable.auth0UserId, id));
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.findOneWithWhereCondition(eq(usersTable.email, email));
  }

  async findUploadContext(userId: string): Promise<UserUploadContext | null> {
    const [row] = await this.db
      .select({
        currentTotalStorageBytes: userCountersTable.totalStorageBytes,
        planId: subscriptionsTable.planId,
      })
      .from(usersTable)
      .innerJoin(userCountersTable, () => eq(usersTable.id, userCountersTable.userId))
      .leftJoin(subscriptionsTable, () =>
        and(
          eq(usersTable.id, subscriptionsTable.userId), //
          eq(subscriptionsTable.status, 'active'),
        ),
      )
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!row) return null;

    return {
      currentTotalStorageBytes: row.currentTotalStorageBytes,
      plan: row.planId
        ? await this.planProvider.getPlan(row.planId)
        : await this.planProvider.getDefaultPlan(),
    };
  }

  async findEmailById(userId: string): Promise<string | null> {
    const [row] = await this.db
      .select({ email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    return row?.email ?? null;
  }

  private async findOneWithWhereCondition(whereCondition: SQL): Promise<User | null> {
    const [row] = await this.db
      .select({
        id: usersTable.id,
        externalId: usersTable.auth0UserId,
        email: usersTable.email,
        emailVerified: usersTable.emailVerified,
        identities: usersTable.identities,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
        deletedAt: usersTable.deletedAt,
      })
      .from(usersTable)
      .where(whereCondition)
      .limit(1);

    if (!row) return null;
    return new User(row);
  }
}
