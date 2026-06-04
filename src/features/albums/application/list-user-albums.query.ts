import type { UserCountersRepository } from '@/features/users/domain/user-counters.repository';
import { albumsTable, albumsUploadsTable } from '@/shared/db/drizzle/schema';
import type { DrizzleDB } from '@/shared/db/drizzle/types';
import assert from 'assert';
import { desc, eq } from 'drizzle-orm';

export interface ListUserAlbumsQuery {
  userId: string;
  page?: number | undefined;
  limit?: number | undefined;
}

export class ListUserAlbumsQueryHandler {
  constructor(
    private readonly db: DrizzleDB,
    private readonly userCountersRepo: UserCountersRepository,
  ) {}

  async execute({ userId, page = 1, limit = 20 }: ListUserAlbumsQuery): Promise<PaginatedResult> {
    if (limit > 50) throw new Error('Max limit is 50');

    const albumsPromise = this.db
      .select({
        id: albumsTable.id,
        name: albumsTable.name,
        isPublic: albumsTable.isPublic,
        // NOTE: N+1
        totalItems: this.db.$count(
          albumsUploadsTable,
          eq(albumsUploadsTable.albumId, albumsTable.id),
        ),
        createdAt: albumsTable.createdAt,
      })
      .from(albumsTable)
      .where(eq(albumsTable.userId, userId))
      .orderBy(desc(albumsTable.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    const [albums, counters] = await Promise.all([
      albumsPromise,
      this.userCountersRepo.findCounters(userId),
    ]);
    assert(counters !== null);

    return {
      data: albums,
      meta: {
        page,
        limit,
        totalItems: counters.totalAlbums,
        totalPages: Math.ceil(counters.totalAlbums / limit) || 1,
      },
    };
  }
}

interface PaginatedResult {
  data: {
    id: string;
    name: string;
    isPublic: boolean;
    totalItems: number;
    createdAt: Date;
  }[];

  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
