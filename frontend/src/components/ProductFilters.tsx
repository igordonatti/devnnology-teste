import { Button } from '@heroui/button';

interface ProductFiltersProps {
  origin: 'BR' | 'EU' | '';
  sortBy: string;
  order: 'asc' | 'desc';
  onFilterChange: (filters: {
    origin: 'BR' | 'EU' | '';
    sortBy: string;
    order: 'asc' | 'desc';
  }) => void;
}

export function ProductFilters({ origin, sortBy, order, onFilterChange }: ProductFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex items-center gap-2">
        <span className="text-gray-600">Origin:</span>
        <select
          value={origin}
          onChange={(e) => onFilterChange({ origin: e.target.value as 'BR' | 'EU' | '', sortBy, order })}
          className="border rounded px-2 py-1"
        >
          <option value="">All</option>
          <option value="BR">Brazil</option>
          <option value="EU">Europe</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-600">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => onFilterChange({ origin, sortBy: e.target.value, order })}
          className="border rounded px-2 py-1"
        >
          <option value="">None</option>
          <option value="name">Name</option>
          <option value="price">Price</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-600">Order:</span>
        <select
          value={order}
          onChange={(e) => onFilterChange({ origin, sortBy, order: e.target.value as 'asc' | 'desc' })}
          className="border rounded px-2 py-1"
          disabled={!sortBy}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <Button
        onPress={() => onFilterChange({ origin: '', sortBy: '', order: 'asc' })}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded"
      >
        Clear Filters
      </Button>
    </div>
  );
} 