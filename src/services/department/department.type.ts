export interface Department {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentResponse {
  data: Department[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
