import { CategoryColor } from "../../shared/enums/CategoryColor";

export default interface CategoryCreateDto {
    name: string;
    color: CategoryColor;
}