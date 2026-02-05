export interface UserCreateDto {
  readonly username: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly profileDescription: string;
};