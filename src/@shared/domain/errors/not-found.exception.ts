import { BaseError } from './base.error.js';

export class NotFoundException extends BaseError {
  constructor(entity: string) {
    const message = `${entity} not found`;
    const code = `${entity.toUpperCase()}_NOT_FOUND`;
    super(message, code);
  }
}
