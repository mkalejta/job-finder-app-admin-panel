import { UUIDTypes } from "uuid";

export interface User {
    id: UUIDTypes;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phoneNumber: number;
    profileDescription: string;
    profilePhoto?: string;
    createdAt: Date;
    updatedAt: Date;
};