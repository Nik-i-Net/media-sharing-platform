import type { UsersRepository } from '../domain/users.repository';
import { User } from '../domain/user';
import { Identity } from '../domain/identity';
import { identitiesTable, usersTable } from '@/shared/persistence/drizzle/schema';
import { eq, inArray } from 'drizzle-orm';
import { excluded } from '@/shared/persistence/drizzle/utils';
import type { DrizzleDB, DrizzleTransaction } from '@/shared/persistence/drizzle/client';

export class DrizzleUsersRepository implements UsersRepository {
  constructor(private readonly db: DrizzleDB | DrizzleTransaction) {}

  async save(user: User): Promise<void> {
    await this.db.transaction(async (tx) => {
      const { id, email, emailVerified, totalStorageBytes, createdAt, updatedAt } = user;
      const identitiesData: (typeof identitiesTable.$inferInsert)[] = user.identities.map((i) => ({
        id: i.id,
        userId: user.id,
        provider: i.provider,
        providerUserId: i.providerUserId,
        email: i.email,
        emailVerified: i.emailVerified,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
      }));

      await tx
        .insert(usersTable)
        .values({ id, email, emailVerified, totalStorageBytes, createdAt, updatedAt })
        .onConflictDoUpdate({
          target: usersTable.id,
          set: { email, emailVerified, totalStorageBytes, updatedAt },
        });

      await tx
        .insert(identitiesTable)
        .values(identitiesData)
        .onConflictDoUpdate({
          target: identitiesTable.id,
          set: {
            email: excluded(identitiesTable.email),
            emailVerified: excluded(identitiesTable.emailVerified),
            updatedAt: excluded(identitiesTable.updatedAt),
          },
        });

      if (user._removedIdentityIds.length > 0) {
        await tx
          .delete(identitiesTable)
          .where(inArray(identitiesTable.id, user._removedIdentityIds));
        user._removedIdentityIds = [];
      }
    });
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.db.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
      with: { identities: true },
    });
    if (!row) return null;

    const { identities, ...rest } = row;
    return new User({ ...rest, identities: identities.map((i) => new Identity(i)) });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const found = await this.db.query.usersTable.findFirst({
      columns: { id: true },
      where: eq(usersTable.email, email),
    });

    return found !== undefined;
  }

  async delete(id: string): Promise<boolean> {
    const deletedRows = await this.db.delete(usersTable).where(eq(usersTable.id, id)).returning();
    return deletedRows.length > 0;
  }
}
