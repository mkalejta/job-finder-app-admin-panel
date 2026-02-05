import { CategoryColor } from "../../shared/enums/CategoryColor";

export interface CategoryCreateDto {
    readonly name: string;
    readonly color: CategoryColor;
};