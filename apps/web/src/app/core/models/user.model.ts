export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
