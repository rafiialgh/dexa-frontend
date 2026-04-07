import { privateInstance as axiosInstance } from "@/lib/axios";
import { z } from "zod";
import type { Department, DepartmentResponse } from "./department.type";

export const createDepartmentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
});

export const updateDepartmentSchema = createDepartmentSchema;

export type CreateDepartmentValues = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentValues = z.infer<typeof updateDepartmentSchema>;

export const departmentService = {
  getDepartments: async (
    search: string = "",
    page: number = 1,
    limit: number = 10
  ): Promise<DepartmentResponse> => {
    const response = await axiosInstance.get("/department", {
      params: { search, page, limit },
    });
    return response.data;
  },

  createDepartment: async (data: CreateDepartmentValues): Promise<Department> => {
    const response = await axiosInstance.post("/department", data);
    return response.data;
  },

  updateDepartment: async (
    id: string,
    data: UpdateDepartmentValues
  ): Promise<Department> => {
    const response = await axiosInstance.patch(`/department/${id}`, data);
    return response.data;
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/department/${id}`);
  },
};
