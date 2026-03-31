import { ProductView } from "../../domain/models/ProductView";

export interface ProductViewPort {
  findAll(params: {
    limit: number;
    skip: number;
  }): Promise<{
    items: ProductView[];
    total: number;
  }>;

  search(query: string): Promise<ProductView[]>;
}