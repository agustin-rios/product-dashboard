export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

export interface ProductView {
  id: number;

  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  finalPrice: number;

  brand: string;
  category: string;
  tags: string[];

  rating: number;
  availabilityStatus: string;
  
  stock: number;
  minimumOrderQuantity: number;
  warrantyInformation: string;
  shippingInformation: string;
  returnPolicy: string;

  reviewCount: number;
  reviews: Review[];

  thumbnail: string;

}