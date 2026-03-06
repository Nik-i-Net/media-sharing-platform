import { User } from '../../../domain/user';

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertUserRecord = UserRecord;
export type UpdateUserRecord = Partial<
  Pick<InsertUserRecord, 'username' | 'email' | 'emailVerified' | 'passwordHash' | 'updatedAt'>
>;

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

  public static toDomain(record: UserRecord): User {
    return new User(
      record.id,
      record.username,
      record.email,
      record.emailVerified,
      record.passwordHash,
      record.createdAt,
      record.updatedAt,
    );
  }
}
