import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MonthNavigatorProps {
  date: Date;
  onChange: (date: Date) => void;
}

export function MonthNavigator({ date, onChange }: MonthNavigatorProps) {
  const handlePrevMonth = () => {
    const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    onChange(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    onChange(nextMonth);
  };

  const monthName = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="icon" onClick={handlePrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="min-w-[140px] text-center font-semibold text-lg">
        {monthName} {year}
      </div>
      <Button variant="outline" size="icon" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
