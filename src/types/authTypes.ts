export type AuthRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  id: number;
  email: string;
};
