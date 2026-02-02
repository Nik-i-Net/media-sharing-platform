export abstract class BaseError extends Error {
  public readonly timestamp: Date;

  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.timestamp = new Date();
    this.name = this.constructor.name;
  }
}
