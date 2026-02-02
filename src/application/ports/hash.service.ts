export interface HashService {
  hash(rawPassword: string): Promise<string>;
  verify(rawPassword: string, hash: string): Promise<boolean>;
}
