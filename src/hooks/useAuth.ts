import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { LoginValues } from "../services/auth/auth.service"
import { getMe, login, logout } from "../services/auth/auth.service"
import { toast } from "sonner"
import { store } from "@/store"
import { setUser, clearUser } from "@/store/authSlice"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"

export const useAuth = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginValues) => login(data),
    onSuccess: (data) => {
      toast.success(data.message)

      const user = data.data

      store.dispatch(
        setUser({
          id: user.id,
          name: user.name,
          email: user.email,
          status: 'active',
          role: user.role,
        })
      );

      navigate('/', { replace: true });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || error?.message || 'Failed to login'
      );
    },
  })
}

export const useMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: true,
    staleTime: 0,
  });
}

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      dispatch(clearUser());
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });
}