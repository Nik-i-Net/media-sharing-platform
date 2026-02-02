import { User } from '../../../domain/user';
import type { UserRecord } from './user.record';

export class UserMapper {
  public static toPersistence(user: User): UserRecord {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      passwordHash: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  public static toDomain(row: UserRecord): User {
    return new User(row.id, row.username, row.email, row.emailVerified, row.passwordHash, row.createdAt, row.updatedAt);
  }
}
