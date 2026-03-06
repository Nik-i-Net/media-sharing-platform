import { User } from '../../../domain/entities/user';

export interface UserRecord {
  id: string;
  username: string;
  email: string;
  email_verified: boolean;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export type InsertUserRecord = UserRecord;
export type UpdateUserRecord = Partial<
  Pick<InsertUserRecord, 'username' | 'email' | 'email_verified' | 'password_hash' | 'updated_at'>
>;

export class UserMapper {
  public static toPersistence(user: User): UserRecord {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      email_verified: user.emailVerified,
      password_hash: user.passwordHash,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }

  public static toDomain(record: UserRecord): User {
    return new User(
      record.id,
      record.username,
      record.email,
      record.email_verified,
      record.password_hash,
      record.created_at,
      record.updated_at,
    );
  }
}
