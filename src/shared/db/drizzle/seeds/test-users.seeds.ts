// TODO: rewrite. `users` table no longer includes `planId`

// import type { DrizzleDB } from '../client';
// import { usersTable } from '../schema';
// import { excluded } from '../utils';
//
// const freeUser = {
//   id: '4bc7c1e1-4ba1-467b-82be-49275391e3c3',
//   auth0UserId: 'auth0|0000',
//   planId: 'free',
//   email: 'free@mail.com',
//   emailVerified: true,
//   identities: [{ provider: 'auth0', userId: '0000' }],
//   totalStorageBytes: 0,
// };
//
// const proUser = {
//   id: 'b2caf517-4137-4611-bab9-5a978d4db483',
//   auth0UserId: 'auth0|9999',
//   planId: 'pro',
//   email: 'pro@mail.com',
//   emailVerified: true,
//   identities: [{ provider: 'auth0', userId: '9999' }],
//   totalStorageBytes: 0,
// };
//
// export async function seed_test_users(db: DrizzleDB) {
//   await db
//     .insert(usersTable)
//     .values([freeUser, proUser])
//     .onConflictDoUpdate({
//       target: usersTable.id,
//       set: {
//         auth0UserId: excluded(usersTable.auth0UserId),
//         planId: excluded(usersTable.planId),
//         email: excluded(usersTable.email),
//         emailVerified: excluded(usersTable.emailVerified),
//         identities: excluded(usersTable.identities),
//         totalStorageBytes: excluded(usersTable.totalStorageBytes),
//       },
//     });
//   console.log('Seeded test users');
// }
