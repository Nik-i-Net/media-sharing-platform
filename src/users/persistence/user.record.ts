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
