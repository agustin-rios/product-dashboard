import { ProductViewPort } from "../../application/ports/ProductView";
import { ProductView, Review } from "../../domain/models/ProductView";
import { DummyJsonClient } from "@/util/DummyJsonCli";

const SORT_FIELD_MAP: Record<string, string> = {
  title:        "title",
  category:     "category",
  price:        "price",
  finalPrice:   "price",   // no hay campo nativo → ordenamos por precio base
  rating:       "rating",
  stock:        "stock",
};

export class ProductRepository implements ProductViewPort {
  constructor(private client: DummyJsonClient) {}

  async findAll({ limit, skip, sortBy, order }: {
    limit:  number;
    skip:   number;
    sortBy: string;
    order:  "asc" | "desc";
    }) {
    const field = SORT_FIELD_MAP[sortBy] ?? sortBy;
    
    const data = await this.client.get<any>(
        `/products?limit=${limit}&skip=${skip}&sortBy=${field}&order=${order}`
    );
    
    return {
        items: data.products.map((p: any) => this.toView(p)),
        total: data.total,
    };
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
      availabilityStatus: dto.availabilityStatus ?? "Unknown",

      stock: dto.stock ?? 0,
      minimumOrderQuantity: dto.minimumOrderQuantity ?? 1,
      warrantyInformation: dto.warrantyInformation ?? "No warranty info",
      shippingInformation: dto.shippingInformation ?? "Standard shipping",
      returnPolicy: dto.returnPolicy ?? "No return policy",

      reviewCount: reviews.length,
      reviews,

      thumbnail: dto.thumbnail ?? "",
    };
  }

  private calculateFinalPrice(price: number, discount: number): number {
    return Number((price * (1 - discount / 100)).toFixed(2));
  }

}