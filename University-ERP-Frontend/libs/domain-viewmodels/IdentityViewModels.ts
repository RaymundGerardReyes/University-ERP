export interface AuthResponseViewModel {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface UserSessionViewModel {
  sessionId: string;
  device: string;
  location: string;
  lastActive: string;
}

export interface MfaChallengeViewModel {
  challengeId: string;
  method: 'Email' | 'Authenticator';
  expiresInMinutes: number;
}
