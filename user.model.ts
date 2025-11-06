export interface User {
  id?: number;
  name: string;
  username?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  role?: string;
  token?: string;
}
