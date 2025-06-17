export interface EuropeanProduct {
  id: string;
  hasDiscount: boolean;
  name: string;
  gallery: string[];
  description: string;
  price: string;
  discountValue: string; // em porcentagem
  details: {
    adjective: string;
    material: string;
  };
}