import { useCart } from '../context/CartContext';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchProducts } from '../api/queries';
import { ProductResponse } from '../types/product';
import { ProductCard } from '../components/ProductCard';
import { Pagination } from '../components/Pagination';
import { ProductFilters } from '@/components/ProductFilters';

type Filters = {
  origin: '' | 'BR' | 'EU';
  sortBy: string;
  order: 'asc' | 'desc';
};

export function Products() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    origin: '',
    sortBy: '',
    order: 'asc',
  });
  const limit = 12;

  const { addToCart } = useCart();
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery<ProductResponse, Error, ProductResponse, [string, number, number, string, string, string]>({
    queryKey: ['products', page, limit, filters.origin, filters.sortBy, filters.order],
    queryFn: ({ queryKey }) => {
      const [_key, page, limit, origin, sortBy, order] = queryKey;
      return fetchProducts(page, limit, origin, sortBy, order);
    },
  });

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Ocorreu um erro: {error.message}
        </div>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  const { data: products, totalPages } = response;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      
      <ProductFilters
        origin={filters.origin}
        sortBy={filters.sortBy}
        order={filters.order}
        onFilterChange={handleFilterChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
} 