import type { UsersRepository } from '../domain/users.repository';
import { User, UserWithIdentities } from '../domain/user';
import { Identity } from '../domain/identity';
import { identitiesTable, usersTable } from '@/shared/persistence/drizzle/schema';
import { eq, sql, type AnyColumn } from 'drizzle-orm';
import type { DrizzleDB, DrizzleTransaction } from '@/shared/persistence/drizzle/client';

function excluded(col: AnyColumn) {
  return sql.raw(`excluded.${col.name}`);
}

export class DrizzleUsersRepository implements UsersRepository {
  constructor(private readonly db: DrizzleDB | DrizzleTransaction) {}

  async save(user: User | UserWithIdentities): Promise<void> {
    if ('identities' in user) {
      await this.db.transaction(async (tx) => {
        await this.saveUser(user, tx);
        await this.saveIdentities(user.identities, tx);
      });
    } else {
      await this.saveUser(user);
    }
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.db.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
    });
    if (!row) return null;

    return new User(row);
  }

  async findByIdWithIdentities(id: string): Promise<UserWithIdentities | null> {
    const row = await this.db.query.usersTable.findFirst({
      where: eq(usersTable.id, id),
      with: { identities: true },
    });
    if (!row) return null;

    const identities = row.identities.map((i) => new Identity(i));
    return new UserWithIdentities({ ...row, identities });
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

  private async saveUser(user: User, tx?: DrizzleTransaction): Promise<void> {
    const { id, email, emailVerified, totalStorageBytes, createdAt, updatedAt } = user;

    await (tx ?? this.db)
      .insert(usersTable)
      .values({ id, email, emailVerified, totalStorageBytes, createdAt, updatedAt })
      .onConflictDoUpdate({
        target: usersTable.id,
        set: { email, emailVerified, totalStorageBytes, updatedAt },
      });
  }

  // FIXME: removing an identity doesn't delete it from the database
  // TODO:
  // - implement soft deletes or find a working solution
  // - test other edge cases
  private async saveIdentities(identities: Identity[], tx?: DrizzleTransaction): Promise<void> {
    const data: (typeof identitiesTable.$inferInsert)[] = identities.map((i) => ({
      id: i.id,
      userId: i.userId,
      provider: i.provider,
      providerUserId: i.providerUserId,
      email: i.email,
      emailVerified: i.emailVerified,
      createdAt: i.createdAt,
      updatedAt: i.updatedAt,
    }));

    await (tx ?? this.db)
      .insert(identitiesTable)
      .values(data)
      .onConflictDoUpdate({
        target: identitiesTable.id,
        set: {
          // email: sql`excluded.${identitiesTable.email}`,
          // emailVerified: sql`excluded.${identitiesTable.emailVerified}`,
          // updatedAt: sql`excluded.${identitiesTable.updatedAt}`,

          email: excluded(identitiesTable.email),
          emailVerified: excluded(identitiesTable.emailVerified),
          updatedAt: excluded(identitiesTable.updatedAt),
        },
      });
  }
}
