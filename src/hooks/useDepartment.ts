import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { departmentService, type CreateDepartmentValues, type UpdateDepartmentValues } from "@/services/department/department.service";
import { toast } from "sonner";

export const useDepartments = (
  search: string = "",
  page: number = 1,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ["departments", search, page, limit],
    queryFn: () => departmentService.getDepartments(search, page, limit),
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDepartmentValues) => departmentService.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create department");
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDepartmentValues }) =>
      departmentService.updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update department");
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => departmentService.deleteDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Department deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete department");
    },
  });
};
