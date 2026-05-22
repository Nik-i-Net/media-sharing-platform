import type { DrizzleDB } from '@/shared/db/drizzle/client';
import { albumsTable, albumsUploadsTable } from '@/shared/db/drizzle/schema';
import { desc, eq } from 'drizzle-orm';

export interface ListUserUploadsQuery {
  userId: string;
  page?: number;
  limit?: number;
}

export class ListUserUploadsQueryHandler {
  constructor(private readonly db: DrizzleDB) {}

  async execute({ userId, page = 1, limit = 20 }: ListUserUploadsQuery): Promise<PaginatedResult> {
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

    const [albums, totalAlbums] = await Promise.all([
      albumsPromise,
      this.db.$count(albumsTable, eq(albumsTable.userId, userId)),
    ]);

    return {
      data: albums,
      meta: {
        page,
        limit,
        totalItems: totalAlbums,
        totalPages: Math.ceil(totalAlbums / limit),
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
