export type UserRole =
  | "ADMIN"
  | "HR"
  | "INTERVIEWER"
  | "REVIEWER"
  | "CANDIDATE";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  role: UserRole;
  userId: number;
  name: string;
}
