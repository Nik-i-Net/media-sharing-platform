export interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}
