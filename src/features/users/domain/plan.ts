import { MEMORY_UNITS } from '@/shared/constants';

export class Plan {
  static FREE = new Plan(
    'free',
    ['image/jpeg', 'image/png', 'image/gif'],
    1 * MEMORY_UNITS.MiB,
    100 * MEMORY_UNITS.MiB,
  );

  static PRO = new Plan(
    'pro',
    ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
    5 * MEMORY_UNITS.MiB,
    1 * MEMORY_UNITS.GiB,
  );

  constructor(
    readonly id: string,
    readonly allowedMimeTypes: string[],
    readonly maxFileSizeBytes: number,
    readonly maxStorageBytes: number,
  ) {}
}
