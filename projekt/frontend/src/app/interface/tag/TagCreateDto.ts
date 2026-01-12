import { UUIDTypes } from "uuid";

export interface TagCreateDto {
    name: string;
    categoryId: UUIDTypes;
};