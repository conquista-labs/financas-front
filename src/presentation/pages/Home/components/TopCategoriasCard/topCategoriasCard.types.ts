import { CategoriaAnalyticsDto } from "@/domain/models/categoriaAnalyticsDto";

export interface TopCategoriasCardProps {
  categorias?: CategoriaAnalyticsDto[];
  totalGeral?: number;
  isLoading?: boolean;
  title?: string;
}
