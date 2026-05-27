export interface UserCountersRepository {
  initializeCounters(userId: string): Promise<void>;
  findCounters(userId: string): Promise<UserCounters | null>;

  incrementTotalStorageBytes(userId: string, amountBytes: number): Promise<void>;
  decrementTotalStorageBytes(userId: string, amountBytes: number): Promise<void>;

  incrementTotalUploads(userId: string, amount: number): Promise<void>;
  decrementTotalUploads(userId: string, amount: number): Promise<void>;

  incrementTotalAlbums(userId: string, amount: number): Promise<void>;
  decrementTotalAlbums(userId: string, amount: number): Promise<void>;
}

export type UserCounters = {
  totalStorageBytes: number;
  totalUploads: number;
  totalAlbums: number;
};
