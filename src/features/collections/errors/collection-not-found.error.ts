import { NotFoundError } from '@/shared/errors';

export class CollectionNotFoundError extends NotFoundError {
  constructor() {
    super('Collection not found', 'COLLECTION_NOT_FOUND');
  }
}
