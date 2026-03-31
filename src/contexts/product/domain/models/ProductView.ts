export interface ProductView {
  id: string;
  title: string;
  price: number;
  rating: number;
  category: string;
  tags: string[];
  thumbnail: string;
  availability: boolean;
}