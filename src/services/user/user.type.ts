import type { Pagination } from "@/types/response";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  status: string;
  role: string;
  departmentId?: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface GetAllUsersResponse {
  data: User[];
  pagination: Pagination;
}

export interface GetUserParams {
  role?: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}