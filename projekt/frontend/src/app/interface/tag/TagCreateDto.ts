import { UUIDTypes } from "uuid";

export default interface TagCreateDto {
    name: string;
    categoryId: UUIDTypes;
}