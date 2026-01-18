import { CategoryEnum } from '../../features/category/CategoryEnum';

export interface CategoryDTO {
  name: string;
  type: CategoryEnum;
  icon?: string;
}
