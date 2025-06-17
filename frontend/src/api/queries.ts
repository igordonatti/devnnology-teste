import api from './config';
import { ProductResponse } from '../types/product';

export const fetchProducts = async (page: number, limit: number, origin: string, sortBy: string, order: string): Promise<ProductResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (origin) params.append('origin', origin);
  if (sortBy) params.append('sortBy', sortBy);
  if (order) params.append('order', order);

  const { data } = await api.get<ProductResponse>(`/products?${params.toString()}`);
  return data;
}