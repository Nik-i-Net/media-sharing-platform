import { z } from 'zod';
import { password } from '@shared/application/primitives.dto.js';

export const UpdatePasswordDto = z
  .object({ oldPassword: password, newPassword: password, newPasswordConfirm: password })
  .superRefine((data, ctx) => {
    if (data.oldPassword === data.newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'New password must be different from the old one',
        path: ['newPassword'],
      });
      return;
    }

    if (data.newPassword !== data.newPasswordConfirm) {
      ctx.addIssue({
        code: 'custom',
        message: "Passwords don't match",
        path: ['newPasswordConfirm'],
      });
    }
  })
  .brand<'UpdatePasswordDto'>();

export type UpdatePasswordDto = z.infer<typeof UpdatePasswordDto>;
