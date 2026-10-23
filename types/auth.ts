export type AuthUser = {
  id: string;
  name: string;
  email: string;
  status: string;
  type: 'ADMIN' | 'TENANT';
  photo?: string | null;
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

// register
export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  businessName: string;
};

// refresh response
export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};
