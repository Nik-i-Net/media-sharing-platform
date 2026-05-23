import type { DrizzleDB } from '@/shared/db/drizzle/client';
import { albumsTable, albumsUploadsTable } from '@/shared/db/drizzle/schema';
import { eq } from 'drizzle-orm';
import { AlbumNotFoundError } from '../errors/album-not-found.error';

export interface GetAlbumByIdQuery {
  albumId: string;
  userId: string | null;
}

export class GetAlbumByIdQueryHandler {
  constructor(private readonly db: DrizzleDB) {}

  async execute({ albumId, userId }: GetAlbumByIdQuery): Promise<PublicInfo | PrivateInfo> {
    const album = await this.db.query.albumsTable.findFirst({
      where: eq(albumsTable.id, albumId),
    });

    if (!album) throw new AlbumNotFoundError();
    if (!album.isPublic && userId !== album.userId) throw new AlbumNotFoundError();

    const basicInfo: BasicInfo = {
      id: album.id,
      name: album.name,
      totalItems: await this.db.$count(
        albumsUploadsTable,
        eq(albumsUploadsTable.albumId, albumsTable.id),
      ),
    };

    return userId !== album.userId
      ? { ...basicInfo, canEdit: false }
      : {
          ...basicInfo,
          canEdit: true,
          isPublic: album.isPublic,
        };
  }
}

interface BasicInfo {
  id: string;
  name: string;
  totalItems: number;
}

interface PublicInfo extends BasicInfo {
  canEdit: false;
}

interface PrivateInfo extends BasicInfo {
  canEdit: true;
  isPublic: boolean;
}
