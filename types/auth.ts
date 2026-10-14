export type AuthUser = {
  id: string;
  name: string;
  email: string;
  status: string;
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

// login payload
export type LoginPayload = {
  email: string;
  password: string;
};

// refresh response
export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};