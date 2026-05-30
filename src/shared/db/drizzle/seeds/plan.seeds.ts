import { MEMORY_UNITS } from '@/shared/constants';
import { plansTable } from '../schema';
import type { DrizzleDB } from '../types';
import { excluded } from '../utils';

const freeMimeTypes = [
  'image/jpeg', //
  'image/png',
  'image/gif',
  'image/webp',
];

const proMimeTypes = [
  ...freeMimeTypes,

  'audio/mpeg',
  'audio/mp4',
  'audio/wav',
  'audio/ogg',

  'video/mp4',
  'video/webm',
];

export async function seed_plans(db: DrizzleDB) {
  await db
    .insert(plansTable)
    .values([
      {
        id: 'free',
        allowedMimeTypes: freeMimeTypes,
        maxFileSizeBytes: 1 * MEMORY_UNITS.MiB,
        maxTotalStorageBytes: 100 * MEMORY_UNITS.MiB,
      },
      {
        id: 'pro',
        allowedMimeTypes: proMimeTypes,
        maxFileSizeBytes: 5 * MEMORY_UNITS.MiB,
        maxTotalStorageBytes: 1 * MEMORY_UNITS.GiB,
      },
    ])
    .onConflictDoUpdate({
      target: plansTable.id,
      set: {
        allowedMimeTypes: excluded(plansTable.allowedMimeTypes),
        maxFileSizeBytes: excluded(plansTable.maxFileSizeBytes),
        maxTotalStorageBytes: excluded(plansTable.maxTotalStorageBytes),
      },
    });
  console.log('Seeded plans');
}
