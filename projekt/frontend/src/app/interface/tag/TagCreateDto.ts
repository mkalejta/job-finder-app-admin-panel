import { UUIDTypes } from "uuid";

export interface TagCreateDto {
    readonly name: string;
    readonly categoryId: UUIDTypes;
};