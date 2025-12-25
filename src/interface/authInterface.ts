export interface UserInterface {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  username: string;
  app_ids: number[];
}

export interface LoginInterface {
  username: string;
  password: string;
  app_ids: number[];
}

export interface EmailOptionsInterface {
  to: string;
  subject: string;
  text: string;
}

export interface ForgotpasswordInterface {
  email: string;
}
