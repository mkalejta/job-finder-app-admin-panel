import { UUIDTypes } from "uuid";
import { CategoryColor } from "../../shared/enums/CategoryColor";

export interface Tag {
    id: UUIDTypes;
    name: string;
    categoryName: string;
    categoryColor: CategoryColor;
};