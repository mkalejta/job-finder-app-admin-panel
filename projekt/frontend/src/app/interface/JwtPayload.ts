import { UUIDTypes } from "uuid";

export interface JwtPayload {
  sub?: UUIDTypes;
  email?: string;
  username?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: number;
  profileDescription?: string;
  profilePhoto?: string;
  exp?: number;
  iat?: number;
};
