export const createAuthConfig = (authority: string, clientId: string) => ({
  authority,
  client_id: clientId,
  redirect_uri: `${window.location.origin}/callback`,
  response_type: 'code',
  scope: 'openid profile email university_erp.read',
  post_logout_redirect_uri: window.location.origin
});
