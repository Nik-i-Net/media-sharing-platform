export interface UserCountersRepository {
  initializeCounters(userId: string): Promise<void>;
  findCounters(userId: string): Promise<UserCounters | null>;

  setTotalStorageBytes(userId: string, totalBytes: number): Promise<void>;
  setTotalUploads(userId: string, totalUploads: number): Promise<void>;
  setTotalAlbums(userId: string, totalAlbums: number): Promise<void>;
}

export type UserCounters = {
  totalStorageBytes: number;
  totalUploads: number;
  totalAlbums: number;
};
