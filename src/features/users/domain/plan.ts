export class Plan {
  constructor(
    readonly id: string,
    readonly allowedMimeTypes: string[],
    readonly maxFileSizeBytes: number,
    readonly maxStorageBytes: number,
  ) {}
}
