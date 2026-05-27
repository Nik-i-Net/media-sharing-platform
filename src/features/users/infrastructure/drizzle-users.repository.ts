import type { DrizzleDB, DrizzleTransaction } from '@/shared/db/drizzle/client';
import { usersTable } from '@/shared/db/drizzle/schema';
import { eq, type SQL } from 'drizzle-orm';
import { User } from '../domain/user';
import type { UsersRepository } from '../domain/users.repository';

export class DrizzleUsersRepository implements UsersRepository {
  constructor(private readonly db: DrizzleDB | DrizzleTransaction) {}

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
