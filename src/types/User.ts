/* eslint-disable @typescript-eslint/no-explicit-any */
export type ROLE = "ADMIN" | "USER" | "LIBRARIAN";

export type SignInData = {
  email: string;
  password_hash: string;
};

export type UserResponse = {
  id: number;
  name: string;
  email: string;
  created_at: Date;
  role: ROLE;
  lendings: any[];
  reservations: any[];
  image: string;
};

export type CreateUserRequest = {
  name: string;
  email: string;
  password_hash: string;
};
