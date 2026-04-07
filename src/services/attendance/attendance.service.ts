import { privateInstance } from "@/lib/axios";
import type { BaseResponse } from "@/types/response";
import type { MonthlyAttendanceResponse, AttendanceDetail } from "./attendance.type";

export const getMonthlyAttendance = async (
  month: number,
  year: number,
  userId?: string
): Promise<BaseResponse<MonthlyAttendanceResponse>> => {
  const params = { month, year, userId };
  return privateInstance
    .get("/attendance/monthly", { params })
    .then((res) => res.data);
};

export const getAttendanceDetail = async (
  date: string,
  userId?: string
): Promise<BaseResponse<AttendanceDetail>> => {
  const params = { date, userId };
  return privateInstance
    .get("/attendance/detail", { params })
    .then((res) => res.data);
};

export const checkIn = async (payload: { photo: File }): Promise<BaseResponse<any>> => {
  const formData = new FormData();
  formData.append("photo", payload.photo);

  return privateInstance
    .post("/attendance/check-in", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const checkOut = async (payload: { attendanceId: string, photo: File }): Promise<BaseResponse<any>> => {
  const formData = new FormData();
  formData.append("attendanceId", payload.attendanceId);
  formData.append("photo", payload.photo);

  return privateInstance
    .post("/attendance/check-out", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};
