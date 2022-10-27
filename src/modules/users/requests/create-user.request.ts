export interface ICreateUserRequest {
  firstName: string;
  lastName?: string;
  email: string;
  imageUrl?: string;
  googleId?: string;
  facebookId?: string;
  phoneNumber?: string;

  password?: string;
}
