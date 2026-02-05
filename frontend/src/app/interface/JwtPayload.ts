import { UUIDTypes } from "uuid";

export interface JwtPayload {
  readonly sub?: UUIDTypes;
  readonly email?: string;
  readonly username?: string;
  readonly role?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phoneNumber?: number;
  readonly profileDescription?: string;
  readonly profilePhoto?: string;
  readonly exp?: number;
  readonly iat?: number;
};
