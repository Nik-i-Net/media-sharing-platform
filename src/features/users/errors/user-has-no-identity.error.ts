import { InternalServerError } from '@/shared/errors';

export class UserHasNoIdentityError extends InternalServerError {
  constructor() {
    super('User has no identity', 'USER_HAS_NO_IDENTITY');
  }
}
