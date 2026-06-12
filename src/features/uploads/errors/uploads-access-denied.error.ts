import { StatusCodes } from '@/shared/constants';
import { ForbiddenError, type ErrorResponse } from '@/shared/errors';

export class UploadsAccessDeniedError extends ForbiddenError {
  constructor(
    userId: string,
    readonly uploadIds: string[],
  ) {
    super(
      `User ${userId} does not have access to uploads with IDs: ${uploadIds.join(', ')}`,
      'UPLOADS_ACCESS_DENIED',
    );
  }

  toPublicResponse(): ErrorResponse {
    return {
      status: StatusCodes.FORBIDDEN,
      code: this.code,
      message: 'Access to some uploads was denied',
      details: {
        uploadIds: this.uploadIds,
      },
    };
  }
}
