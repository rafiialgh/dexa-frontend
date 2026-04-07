import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllUsers, getUserById, updateUser, deleteUser, createUser, type UpdateUserValues, type CreateUserValues } from "@/services/user/user.service"
import { toast } from "sonner"

export const useUser = (roleFilter: string, statusFilter: string, debouncedSearch: string, page: number, limit: number) => {
  return useQuery({
    queryKey: ['users', roleFilter, statusFilter, debouncedSearch, page, limit],
    queryFn: () => getAllUsers({
      role: roleFilter,
      status: statusFilter,
      search: debouncedSearch,
      page,
      limit,
    }),
  })
}

export const useUserDetail = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id && enabled,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUserValues) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create user')
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserValues }) => updateUser(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['user', res.data.id] })
      toast.success('User updated successfully')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update user')
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted successfully')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete user')
    },
  })
}