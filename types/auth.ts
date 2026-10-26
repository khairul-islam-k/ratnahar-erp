export type AuthUser = {
  id: string;
  name: string;
  email: string;
  status: string;
  type: 'ADMIN' | 'TENANT' | 'EMPLOYEE';
  photo?: string | null;
};

export type Permissions = {
      id: string; 
      featureKey: string; 
      actionKey: string; 
      description: string; 
    };

export type AuthResponse = {
  user: AuthUser;
  permission: Permissions[];
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
