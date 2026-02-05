import { UUIDTypes } from "uuid";

export interface User {
    readonly id: UUIDTypes;
    readonly username: string;
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly role: string;
    readonly phoneNumber: number;
    readonly profileDescription: string;
    readonly profilePhoto?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
};