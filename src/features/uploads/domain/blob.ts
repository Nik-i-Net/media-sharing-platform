import { TodoError } from '@/shared/errors';
import type { HashVO } from './hash.value-object';

interface CreateBlobParams {
  id: string;
  hash: HashVO;
  mimeType: string;
  sizeBytes: number;
}

export class BlobEntity {
  public static create(props: CreateBlobParams) {
    const { id, hash, mimeType, sizeBytes } = props;
    const status = 'pending';
    const now = new Date();
    const blob = new BlobEntity(id, hash, mimeType, sizeBytes, status, now, now);
    return blob;
  }

  #mimeType: string;
  #status: 'pending' | 'ready' | 'rejected';
  #updatedAt: Date;

  constructor(
    readonly id: string,
    readonly hash: HashVO,
    mimeType: string,
    readonly sizeBytes: number,
    status: 'pending' | 'ready' | 'rejected',
    readonly createdAt: Date,
    updatedAt: Date,
  ) {
    this.#mimeType = mimeType;
    this.#status = status;
    this.#updatedAt = updatedAt;
  }

  get mimeType() {
    return this.#mimeType;
  }
  get status() {
    return this.#status;
  }
  get updatedAt() {
    return this.#updatedAt;
  }

  confirm(actualMimeType: string) {
    if (this.status !== 'pending') throw new TodoError('Blob not in pending state');

    if (actualMimeType === 'application/octet-stream') {
      this.#status = 'rejected';
    } else {
      this.#mimeType = actualMimeType;
      this.#status = 'ready';
    }

    this.touch();
  }

  private touch() {
    this.#updatedAt = new Date();
  }
}
