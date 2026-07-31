export interface UserRegistrationData {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  role: 'Student' | 'Faculty' | 'Admin';
}
