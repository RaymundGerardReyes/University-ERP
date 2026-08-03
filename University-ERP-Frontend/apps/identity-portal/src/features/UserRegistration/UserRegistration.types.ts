export interface UserRegistrationData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: 'Student' | 'Faculty' | 'Admin';
}
