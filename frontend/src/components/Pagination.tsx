import { Button } from '@heroui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="mt-8 flex justify-center items-center space-x-2">
      <Button
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
      >
        Previous
      </Button>
      <span className="text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
      >
        Next
      </Button>
    </div>
  );
} 