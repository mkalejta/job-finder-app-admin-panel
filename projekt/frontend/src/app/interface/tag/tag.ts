import { UUIDTypes } from "uuid";
import { CategoryColor } from "../../shared/enums/CategoryColor";

export interface Tag {
    readonly id: UUIDTypes;
    readonly name: string;
    readonly categoryName: string;
    readonly categoryColor: CategoryColor;
};