import { env } from './env';

export const authConfig = {
  authority: env.AUTH_AUTHORITY,
  client_id: env.CLIENT_ID,
  redirect_uri: `${window.location.origin}/callback`,
  response_type: 'code',
  scope: 'openid profile email university_erp.read',
  post_logout_redirect_uri: window.location.origin
};
