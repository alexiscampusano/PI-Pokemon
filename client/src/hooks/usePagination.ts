import { useMemo } from 'react';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  maxPageNumbers?: number;
}

interface UsePaginationReturn {
  totalPages: number;
  pages: number[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startIndex: number;
  endIndex: number;
}

export const usePagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  maxPageNumbers = 5,
}: UsePaginationProps): UsePaginationReturn => {
  return useMemo(() => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
    let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);
    
    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(1, endPage - maxPageNumbers + 1);
    }
    
    const pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    return {
      totalPages,
      pages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      startIndex: (currentPage - 1) * itemsPerPage,
      endIndex: Math.min(currentPage * itemsPerPage, totalItems),
    };
  }, [totalItems, itemsPerPage, currentPage, maxPageNumbers]);
};

