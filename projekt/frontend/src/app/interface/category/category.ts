import { UUIDTypes } from "uuid";
import { CategoryColor } from "../../shared/enums/CategoryColor";

export interface Category {
    readonly id: UUIDTypes;
    readonly name: string;
    readonly color: CategoryColor;
};