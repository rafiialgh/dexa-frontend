import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMonthlyAttendance, getAttendanceDetail, checkIn, checkOut } from "@/services/attendance/attendance.service";
import { format } from "date-fns";
import { toast } from "sonner";

export function useMonthlyAttendance(
  month: number,
  year: number,
  userId?: string
) {
  return useQuery({
    queryKey: ["attendance-monthly", month, year, userId],
    queryFn: () => getMonthlyAttendance(month, year, userId),
    enabled: !!month && !!year,
  });
}

export function useAttendanceDetail(
  date: Date | null,
  userId?: string
) {
  const dateStr = date ? format(date, "yyyy-MM-dd") : "";
  
  return useQuery({
    queryKey: ["attendance-detail", dateStr, userId],
    queryFn: () => getAttendanceDetail(dateStr, userId),
    enabled: !!date,
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkIn,
    onSuccess: (res) => {
      toast.success(res.message || "Check-in successful! Welcome to work.");
      queryClient.invalidateQueries({ queryKey: ["attendance-monthly"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-detail"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to check-in. Please try again.");
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkOut,
    onSuccess: (res) => {
      toast.success(res.message || "Check-out successful! Great job today.");
      queryClient.invalidateQueries({ queryKey: ["attendance-monthly"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-detail"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to check-out. Please try again.");
    },
  });
}
