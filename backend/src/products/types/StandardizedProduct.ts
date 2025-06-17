export interface StandardizedProduct {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string[];
  origin: 'BR' | 'EU';
}
