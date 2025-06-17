import { Button } from '@heroui/button';
import { Product } from '../types/product';
import { ProductImageCarousel } from './ProductImageCarousel';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <ProductImageCarousel images={product.image} />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">
            ${product.price}
          </span>
          <Button
            onPress={() => onAddToCart(product)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
} 