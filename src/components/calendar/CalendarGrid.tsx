import { cn } from "@/lib/utils";

interface CalendarGridProps {
  date: Date;
  onDateClick: (date: Date) => void;
  renderCell?: (date: Date) => React.ReactNode;
}

export function CalendarGrid({ date, onDateClick, renderCell }: CalendarGridProps) {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Get the first day of the month (0 = Sunday, 6 = Saturday)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Get the last day of the month
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

  const daysHeader = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const cells: (Date | null)[] = [];

  // Add prefix empty cells
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push(null);
  }

  // Add current month days
  for (let i = 1; i <= lastDayOfMonth; i++) {
    cells.push(new Date(year, month, i));
  }

  // Add suffix empty cells to complete the grid
  const totalCells = Math.ceil(cells.length / 7) * 7;
  for (let i = cells.length; i < totalCells; i++) {
    cells.push(null);
  }

  const isToday = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cellDate = new Date(d);
    cellDate.setHours(0, 0, 0, 0);
    return cellDate.getTime() === today.getTime();
  };

  const isFuture = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cellDate = new Date(d);
    cellDate.setHours(0, 0, 0, 0);
    return cellDate.getTime() > today.getTime();
  };

  const isWeekend = (d: Date) => {
    const day = d.getDay();
    return day === 0 || day === 6;
  };

  return (
    <div className="w-full bg-white border shadow-sm">
      <div className="grid grid-cols-7 border-b bg-zinc-50">
        {daysHeader.map((day) => (
          <div
            key={day}
            className={cn(
              "p-4 text-center text-xs font-bold uppercase tracking-widest border-r last:border-r-0",
              (day === "Sun" || day === "Sat") ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-collapse">
        {cells.map((cellDate, index) => {
          const isDateWeekend = cellDate ? isWeekend(cellDate) : false;
          const isDateToday = cellDate ? isToday(cellDate) : false;
          const isDateFuture = cellDate ? isFuture(cellDate) : false;

          return (
            <div
              key={index}
              onClick={() => cellDate && !isDateFuture && onDateClick(cellDate)}
              className={cn(
                "min-h-[120px] p-2 border-b border-r last:border-r-0 transition-all group relative",
                !cellDate && "bg-zinc-50/20",
                cellDate && !isDateFuture && "cursor-pointer hover:bg-zinc-50/80",
                isDateFuture && "bg-zinc-50/10 opacity-50 cursor-not-allowed",
                isDateWeekend && cellDate && "bg-zinc-50/40 text-destructive font-medium",
                isDateToday && "bg-primary/5 ring-1 ring-primary/20 ring-inset"
              )}
            >
              {cellDate && (
                <>
                  <div className="flex justify-between items-start">
                    <span 
                      className={cn(
                        "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors font-geist",
                        isDateToday ? "bg-primary text-white" : "",
                        isDateFuture ? "text-zinc-400" : ""
                      )}
                    >
                      {cellDate.getDate()}
                    </span>
                    {isDateToday && (
                      <span className="text-[10px] font-bold text-primary uppercase mr-1">Today</span>
                    )}
                    {isDateFuture && !isDateWeekend && (
                      <span className="text-[10px] font-bold text-zinc-400 uppercase mr-1"></span>
                    )}
                  </div>
                  
                  <div className="mt-2 min-h-[40px]">
                    {!isDateFuture && renderCell && renderCell(cellDate)}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
