export type ROLE = "ADMIN" | "USER" | "LIBRARIAN";

export type SignInData = {
  email: string;
  password_hash: string;
};

export type UserResponse = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  role: ROLE;
  lendings: any[];
  reservations: any[];
};

export type UpdateUserRequest = {
  name?: string;
  email?: string;
  role?: ROLE;
};

export type CreateUserRequest = {
  name: string;
  email: string;
  password_hash: string;
};
