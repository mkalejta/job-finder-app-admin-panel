import { UUIDTypes } from "uuid";
import { CategoryColor } from "../../shared/enums/CategoryColor";

export default interface Category {
    id: UUIDTypes;
    name: string;
    color: CategoryColor;
}