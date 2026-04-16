export abstract class BaseError extends Error {
  readonly timestamp: Date;

  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.timestamp = new Date();
    this.name = this.constructor.name;
  }
}
