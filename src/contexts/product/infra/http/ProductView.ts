import { ProductViewPort } from "../../application/ports/ProductView";
import { ProductView, Review } from "../../domain/models/ProductView";
import { DummyJsonClient } from "@/util/DummyJsonCli";

export class ProductRepository implements ProductViewPort {
  constructor(private client: DummyJsonClient) {}

  async findAll({ limit, skip }: { limit: number; skip: number }) {
    const data = await this.client.get<any>(
      `/products?limit=${limit}&skip=${skip}`
    );

    return {
      items: data.products.map((p: any) => this.toView(p)),
      total: data.total,
    };
  }

  async search(query: string): Promise<ProductView[]> {
    const data = await this.client.get<any>(
      `/products/search?q=${query}`
    );

    return data.products.map((p: any) => this.toView(p));
  }

  private toView(dto: any): ProductView {
    const reviews: Review[] = (dto.reviews ?? []).map((r: any) => ({
      rating: r.rating,
      comment: r.comment,
      date: r.date,
      reviewerName: r.reviewerName,
    }));

    const discount = dto.discountPercentage ?? 0;
    const price = dto.price ?? 0;

    return {
      id: dto.id,

      title: dto.title,
      description: dto.description,
      price,
      discountPercentage: discount,
      finalPrice: this.calculateFinalPrice(price, discount),

      brand: dto.brand,
      category: dto.category,
      tags: dto.tags ?? [],

      rating: dto.rating ?? 0,
      availabilityStatus: this.mapAvailability(dto.stock),

      stock: dto.stock ?? 0,
      minimumOrderQuantity: dto.minimumOrderQuantity ?? 1,
      warrantyInformation: dto.warrantyInformation ?? "No warranty info",
      shippingInformation: dto.shippingInformation ?? "Standard shipping",
      returnPolicy: dto.returnPolicy ?? "No return policy",

      reviewCount: reviews.length,
      reviews,
    };
  }

  private calculateFinalPrice(price: number, discount: number): number {
    return Number((price * (1 - discount / 100)).toFixed(2));
  }

  private mapAvailability(stock: number): string {
    if (stock > 10) return "In Stock";
    if (stock > 0) return "Low Stock";
    return "Out of Stock";
  }
}