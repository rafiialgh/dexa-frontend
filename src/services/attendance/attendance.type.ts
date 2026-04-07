export interface AttendanceRecord {
  id: string | null;
  date: string; // YYYY-MM-DD
  status: "PRESENT" | "LATE" | "ABSENT" | "LEAVE" | "OFF_DAY" | "WEEKEND";
  checkIn: string | null;
  checkOut: string | null;
  isLate: boolean;
}

export interface AttendanceDetail {
  id: string | null;
  date: string;
  status: string;
  checkIn: {
    time: string | null;
    photo: string | null;
  };
  checkOut: {
    time: string | null;
    photo: string | null;
  };
  meta: {
    isLate: boolean;
    lateDuration: number;
    isEarlyCheckout: boolean;
    workDuration: string;
  };
}

export interface MonthlyAttendanceResponse {
  summary: {
    present: number;
    late: number;
    absent: number;
    totalDays: number;
  };
  records: AttendanceRecord[];
}
