const JWT_AUDIENCE = 'http://your-api.com';

exports.onExecuteCredentialsExchange = async (event, api) => {
  const userId = event.request.body?.user_id;
  api.accessToken.setCustomClaim(`${JWT_AUDIENCE}/userId`, userId);
};
