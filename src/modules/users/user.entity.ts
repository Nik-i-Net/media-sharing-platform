export interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserInsert = Omit<User, 'emailVerified' | 'createdAt' | 'updatedAt'>;
export type UserUpdate = Partial<Omit<UserInsert, 'id'>>;
