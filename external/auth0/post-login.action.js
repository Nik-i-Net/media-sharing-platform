// TODO: handle errors

const JWT_AUDIENCE = 'http://your-domain.com';
const URL = `${JWT_AUDIENCE}/api/v1/users/auth0`;

/**
 * @param {string} url
 * @param {string} apiToken
 */
async function fetchUserId(url, apiToken, userInfo) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 5000);

  const response = await fetch(url, {
    method: 'POST',
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiToken,
    },
    body: JSON.stringify({
      userId: userInfo.user_id,
      email: userInfo.email,
      emailVerified: userInfo.email_verified,
      identities: userInfo.identities.map((i) => ({
        provider: i.provider,
        userId: i.userId,
      })),
    }),
  });

  const { data } = await response.json();
  return data.userId;
}

exports.onExecutePostLogin = async (event, api) => {
  const apiToken = event.secrets.API_TOKEN;
  const userId = await fetchUserId(URL, apiToken, event.user);
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
