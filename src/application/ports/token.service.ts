import type { Duration } from '../../core/types';

export type Payload = Record<string, unknown>;

export interface TokenService {
  sign(payload: Payload, expiresIn: Duration): Promise<string>;
  verify(token: string): Promise<Payload>;
}
