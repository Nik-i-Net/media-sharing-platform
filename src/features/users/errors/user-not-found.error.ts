import { NotFoundError } from '@/shared/errors';

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('User not found', 'USER_NOT_FOUND');
  }
}
