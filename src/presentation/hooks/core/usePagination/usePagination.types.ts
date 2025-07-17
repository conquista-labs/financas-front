export interface UsePaginationProps {
  skip: number;
  totalPages: number;
  page: number;
  pageSize: number;
  onChangePage: (pagination: { page: number; pageSize: number }) => void;
  onChangePageSize: (pageSize: number) => void;
  getTotalPages: (total: number) => number;
}
