export type UploadUrlParams = {
  key: string;
  hash: string;
  mimeType: string;
  sizeBytes: number;
};

export type UploadInfo = {
  url: string;
  method: 'PUT';
  headers: { [key: string]: string | number };
};

export interface StorageProvider {
  getDirectUploadInfo(params: UploadUrlParams): Promise<UploadInfo>;
  getDownloadUrl(key: string): Promise<string>;
}
