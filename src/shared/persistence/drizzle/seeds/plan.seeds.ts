import { MEMORY_UNITS } from '@/shared/constants';
import { plansTable } from '../schema';
import { excluded } from '../utils';
import { type DrizzleDB } from '../client';

export async function seed_plans(db: DrizzleDB) {
  await db
    .insert(plansTable)
    .values([
      {
        id: 'free',
        allowedMimeTypes: ['image/jpeg', 'image/png'],
        maxFileSizeBytes: 1 * MEMORY_UNITS.MiB,
        maxStorageBytes: 100 * MEMORY_UNITS.MiB,
      },
      {
        id: 'pro',
        allowedMimeTypes: ['image/jpeg', 'image/png'],
        maxFileSizeBytes: 5 * MEMORY_UNITS.MiB,
        maxStorageBytes: 1 * MEMORY_UNITS.GiB,
      },
    ])
    .onConflictDoUpdate({
      target: plansTable.id,
      set: {
        allowedMimeTypes: excluded(plansTable.allowedMimeTypes),
        maxFileSizeBytes: excluded(plansTable.maxFileSizeBytes),
        maxStorageBytes: excluded(plansTable.maxStorageBytes),
      },
    });
}
