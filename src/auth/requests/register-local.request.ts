export interface IRegisterRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;

  password: string;
  confirmPassword: string;
}
