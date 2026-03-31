import { ProductViewPort } from "../../application/ports/ProductView";
import { ProductView } from "../../domain/models/ProductView";
import { DummyJsonClient } from "@/util/DummyJsonCli";

export class ProductRepository implements ProductViewPort {
  constructor(private client: DummyJsonClient) {}

  async findAll({ limit, skip }: { limit: number; skip: number }) {
    const data = await this.client.get<any>(
      `/products?limit=${limit}&skip=${skip}`
    );

    return {
      items: data.products.map(this.toView),
      total: data.total,
    };
  }

  async search(query: string): Promise<ProductView[]> {
    const data = await this.client.get<any>(
      `/products/search?q=${query}`
    );

    return data.products.map(this.toView);
  }

  private toView(dto: any): ProductView {
    return {
      id: String(dto.id),
      title: dto.title,
      price: dto.price * (1 - dto.discountPercentage / 100),
      rating: dto.rating,
      category: dto.category,
      tags: dto.tags ?? [],
      thumbnail: dto.thumbnail,
      availability: dto.stock > 0,
    };
  }
}