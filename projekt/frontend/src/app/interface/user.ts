import { UUIDTypes } from "uuid";

export default interface User {
    id: UUIDTypes;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
}