import { UUIDTypes } from "uuid";
import { CategoryColor } from "../../shared/enums/CategoryColor";

export default interface Tag {
    id: UUIDTypes;
    name: string;
    categoryName: string;
    categoryColor: CategoryColor;
}