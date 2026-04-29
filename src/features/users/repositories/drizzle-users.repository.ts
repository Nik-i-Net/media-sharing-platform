import type { UsersRepository } from '../domain/users.repository';
import { User } from '../domain/user';
import { usersTable } from '@/shared/persistence/drizzle/schema';
import { eq } from 'drizzle-orm';
import type { DrizzleDB, DrizzleTransaction } from '@/shared/persistence/drizzle/client';

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
    const row = await this.db.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
    });
    if (!row) return null;
    return new User({ ...row, externalId: row.auth0UserId });
  }

  async findByExternalId(id: string): Promise<User | null> {
    const row = await this.db.query.usersTable.findFirst({
      where: eq(usersTable.auth0UserId, id),
    });
    if (!row) return null;
    return new User({ ...row, externalId: row.auth0UserId });
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });
    if (!row) return null;
    return new User({ ...row, externalId: row.auth0UserId });
  }
}
