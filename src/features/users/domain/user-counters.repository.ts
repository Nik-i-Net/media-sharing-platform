export interface UserCountersRepository {
  initializeUserCounters(userId: string): Promise<void>;
  getUserCounters(userId: string): Promise<UserCounters | null>;

  setTotalStorageBytes(userId: string, totalBytes: number): Promise<void>;
  setTotalUploads(userId: string, totalUploads: number): Promise<void>;
  setTotalAlbums(userId: string, totalAlbums: number): Promise<void>;
}

export type UserCounters = {
  totalStorageBytes: number;
  totalUploads: number;
  totalAlbums: number;
};
