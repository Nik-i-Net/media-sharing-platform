import { MEMORY_UNITS } from '@/shared/constants';
import { plansTable } from '../schema';
import { excluded } from '../utils';
import { type DrizzleDB } from '../client';

const freeMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/avif',
];

const proMimeTypes = [
  ...freeMimeTypes,

  'audio/mpeg',
  'audio/mp4',
  'audio/m4a',
  'audio/x-m4a',
  'audio/wav',
  'audio/ogg',
  'audio/webm',

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
        maxStorageBytes: 100 * MEMORY_UNITS.MiB,
      },
      {
        id: 'pro',
        allowedMimeTypes: proMimeTypes,
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
