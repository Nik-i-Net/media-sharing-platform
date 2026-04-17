import { z } from 'zod';

export const Auth0RequestSchema = z
  .object({
    user_id: z.string().regex(/^(auth0|google-oauth2)\|\w+$/),
    email: z.email(),
    email_verified: z.boolean(),
  })
  .pipe(
    z.transform(({ user_id, email, email_verified }) => {
      return {
        provider: user_id.split('|')[0]!,
        providerUserId: user_id.split('|')[1]!,
        email,
        emailVerified: email_verified,
      };
    }),
  );

// event.user
// {
//   app_metadata: {},
//   created_at: '0000-00-00T00:00:00.000Z',
//   email_verified: true,
//   email: 'email@gmail.com',
//   given_name: 'Name',
//   identities: [
//     {
//       connection: 'google-oauth2',
//       isSocial: true,
//       provider: 'google-oauth2',
//       userId: '000000000000000000000',
//       user_id: '000000000000000000000'
//     }
//   ],
//   name: 'Name',
//   nickname: 'nickname',
//   picture: 'https://lh3.googleusercontent.com/a/00000000000000000',
//   updated_at: '0000-00-00T00:00:00.000Z',
//   user_id: 'google-oauth2|000000000000000000000',
//   user_metadata: {},
//   multifactor: []
// }
//
