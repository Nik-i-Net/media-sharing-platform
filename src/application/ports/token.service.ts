type Payload = Record<string, unknown>;

export interface TokenService {
  sign(payload: Payload, expiresIn: number | string): Promise<string>;
  verify(token: string): Promise<Payload>;
}
