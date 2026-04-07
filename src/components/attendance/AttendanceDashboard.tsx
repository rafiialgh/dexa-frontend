import { useState } from "react";
import { MonthNavigator } from "@/components/calendar/MonthNavigator";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { AttendanceDialog } from "@/components/attendance/AttendanceDialog";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { useMonthlyAttendance } from "@/hooks/useAttendance";
import { format } from "date-fns";
import { formatTime } from "@/lib/utils";

interface AttendanceDashboardProps {
  userId?: string;
  title?: string;
  subtitle?: string;
}

export function AttendanceDashboard({ userId, title, subtitle }: AttendanceDashboardProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Derive month (1-12) and year for the API
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const { data: attendanceResponse, isLoading } = useMonthlyAttendance(month, year, userId);
  const summary = attendanceResponse?.data?.summary;
  const records = attendanceResponse?.data?.records || [];

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const renderAttendanceCell = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const record = records.find((r) => r.date === dateStr);

    if (!record) return null;

    const isAbsent = record.status === "ABSENT";
    
    if (isAbsent) {
      return (
        <div className="mt-1">
          <Badge variant="outline" className="text-[8px] py-0 px-1 border-rose-200 bg-rose-50 text-rose-700 font-bold uppercase transition-none h-4">
             ABSENT
          </Badge>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1.5 mt-1">
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">
            {formatTime(record.checkIn)} - {formatTime(record.checkOut)}
          </span>
        </div>
        {record.isLate && (
          <Badge variant="outline" className="text-[8px] py-0 px-1 border-amber-200 bg-amber-50 text-amber-700 font-bold uppercase transition-none h-4">
            LATE
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title || "Attendance Dashboard"}</h1>
          <p className="text-muted-foreground">{subtitle || "Manage your monthly work schedule and check-in logs."}</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-1.5 border shadow-sm">
          <MonthNavigator date={currentDate} onChange={setCurrentDate} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         <div className="flex flex-col justify-center border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-bold uppercase text-muted-foreground">Present Days</span>
            </div>
            <div className="mt-2 text-3xl font-black text-zinc-900">
               {isLoading ? "..." : summary?.present ?? 0}
            </div>
         </div>
         <div className="flex flex-col justify-center border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-bold uppercase text-muted-foreground">Late Arrivals</span>
            </div>
            <div className="mt-2 text-3xl font-black text-zinc-900">
               {isLoading ? "..." : summary?.late ?? 0}
            </div>
         </div>
         <div className="flex flex-col justify-center border bg-card p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-bold uppercase text-muted-foreground">Absences</span>
            </div>
            <div className="mt-2 text-3xl font-black text-zinc-900">
               {isLoading ? "..." : summary?.absent ?? 0}
            </div>
         </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-zinc-50 p-3 border border-dashed rounded-lg">
          <Info className="h-4 w-4 text-blue-500" />
          Click on any date cell to view detailed attendance records{userId ? " for this employee" : ""} or perform check-in/out actions.
        </div>
        
        <div className={isLoading ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
          <CalendarGrid 
            date={currentDate} 
            onDateClick={handleDateClick}
            renderCell={renderAttendanceCell}
          />
        </div>
      </div>

      <AttendanceDialog 
        date={selectedDate}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        userId={userId}
      />
    </div>
  );
}
