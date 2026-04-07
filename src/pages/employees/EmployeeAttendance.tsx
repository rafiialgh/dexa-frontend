import { useParams } from "react-router-dom";
import { AttendanceDashboard } from "@/components/attendance/AttendanceDashboard";

export default function EmployeeAttendancePage() {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="space-y-6">
      <AttendanceDashboard 
        userId={id} 
        title="Employee Attendance" 
        subtitle="Review attendance history and detailed activity logs for this individual."
      />
    </div>
  );
}
