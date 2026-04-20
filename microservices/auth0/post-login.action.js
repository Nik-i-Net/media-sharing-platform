const JWT_AUDIENCE = 'http://your-domain.com';
const URL = `${JWT_AUDIENCE}/api/v1/users/auth0`;

/**
 * @param {string} url
 * @param {string} apiToken
 * @param {{provider: string, sub: string, email: {value: string, verified: boolean} | null}} userInfo
 */
async function fetchUserId(url, apiToken, userInfo) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 1000);

  const [provider, providerUserId] = userInfo.user_id.split('|');

  const response = await fetch(url, {
    method: 'POST',
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiToken,
    },
    body: JSON.stringify({
      provider,
      providerUserId,
      email: userInfo.email,
      emailVerified: userInfo.email_verified,
    }),
  });

  const { data } = await response.json();
  return data.userId;
}

exports.onExecutePostLogin = async (event, api) => {
  let userId = event.user.app_metadata?.userId;
  if (!userId) {
    const apiToken = event.secrets.AUTH0_API_KEY;
    userId = await fetchUserId(URL, apiToken, event.user);
    api.user.setAppMetadata('userId', userId);
  }
  api.accessToken.setCustomClaim(`${JWT_AUDIENCE}/userId`, userId);
};

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
