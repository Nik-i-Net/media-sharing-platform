exports.onExecuteCredentialsExchange = async (event, api) => {
  const userId = event.request.body?.user_id;
  api.accessToken.setCustomClaim('http://localhost:5000/userId', userId);
};
