import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, LogOut, CheckCircle2, AlertCircle, Loader2, Camera, ShieldAlert } from "lucide-react";
import { useAttendanceDetail, useCheckIn, useCheckOut } from "@/hooks/useAttendance";
import { useState, useEffect } from "react";
import { CameraCapture } from "./CameraCapture";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";

interface AttendanceDialogProps {
  date: Date | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
}

export function AttendanceDialog({ date, open, onOpenChange, userId }: AttendanceDialogProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureMode, setCaptureMode] = useState<"IN" | "OUT">("IN");
  
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { data: response, isLoading } = useAttendanceDetail(date, userId);
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();
  
  const detail = response?.data;

  const isOwnRecord = !userId || userId === currentUser?.id;

  useEffect(() => {
    if (!open) {
      setIsCapturing(false);
      setCaptureMode("IN");
    }
  }, [open]);

  if (!date) return null;

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isToday = date.toDateString() === new Date().toDateString();
  const hasCheckedIn = !!detail?.checkIn?.time;
  const hasCheckedOut = !!detail?.checkOut?.time;

  const handleCapture = (file: File) => {
    if (captureMode === "IN") {
      checkInMutation.mutate({ photo: file }, {
        onSuccess: () => setIsCapturing(false)
      });
    } else {
      if (detail?.id) {
        checkOutMutation.mutate({ attendanceId: detail.id, photo: file }, {
          onSuccess: () => setIsCapturing(false)
        });
      }
    }
  };

  const isPending = checkInMutation.isPending || checkOutMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!isPending) {
        onOpenChange(val);
      }
    }}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl p-0 overflow-hidden">
        <div className="bg-primary/5 p-6 border-b">
          <DialogHeader>
            <div className="flex items-center gap-2">
               <div className="flex gap-2">
                 <Badge variant={isToday ? "default" : "outline"} className="w-fit mb-2 text-[10px] h-5">
                  {isToday ? "Today" : "View Record"}
                 </Badge>
                 {(isWeekend || detail?.status === "WEEKEND") && (
                   <Badge variant="destructive" className="w-fit mb-2 text-[10px] h-5">Weekend</Badge>
                 )}
               </div>
               {!isOwnRecord && (
                 <Badge variant="secondary" className="w-fit mb-2 text-[9px] h-5 bg-zinc-200 text-zinc-600 font-bold uppercase tracking-tight">
                   <ShieldAlert className="h-3 w-3 mr-1" />
                   View Only Mode
                 </Badge>
               )}
            </div>
            <DialogTitle className="text-xl font-bold">
              {isCapturing ? `Capture ${captureMode === "IN" ? "Check In" : "Check Out"}` : formattedDate}
            </DialogTitle>
            <DialogDescription>
              {isCapturing 
                ? `Please take a clear photo of yourself to confirm your ${captureMode === "IN" ? "check-in" : "check-out"}.`
                : isWeekend 
                  ? "This is a non-working day. Attendance records are usually not required." 
                  : "Manage your attendance record for this business day."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          {isLoading || isPending ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs font-bold uppercase tracking-widest text-center">
                {isPending ? "Uploading Photo..." : "Fetching Record..."}
              </p>
            </div>
          ) : isCapturing ? (
            <CameraCapture 
              onCapture={handleCapture} 
              onCancel={() => setIsCapturing(false)} 
            />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Check In Card */}
                <div className="flex flex-col gap-3">
                  <div className="aspect-4/3 border bg-zinc-100 overflow-hidden relative flex items-center justify-center group">
                    {detail?.checkIn?.photo ? (
                      <img 
                        src={`${detail.checkIn.photo}`} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                        alt="Check In" 
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-zinc-400">
                        <Camera className="h-6 w-6 opacity-40" />
                        <span className="text-[10px] font-bold uppercase">No Photo</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-bold shadow-sm uppercase tracking-widest">
                      In
                    </div>
                  </div>
                  
                  <div className="space-y-1 px-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                      <Clock className="h-3 w-3" />
                      Time
                    </div>
                    <div className="text-lg font-black text-zinc-800">
                      {detail?.checkIn?.time || "--:--"}
                    </div>
                    {detail?.checkIn?.time && (
                      <div className={`flex items-center gap-1 text-[10px] font-bold ${detail.meta.isLate ? "text-amber-600" : "text-emerald-600"}`}>
                        {detail.meta.isLate ? (
                          <>
                            <AlertCircle className="h-3 w-3" />
                            Late ({detail.meta.lateDuration}m)
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            On Time
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="aspect-4/3 border bg-zinc-100 overflow-hidden relative flex items-center justify-center group">
                    {detail?.checkOut?.photo ? (
                      <img 
                        src={`${detail.checkOut.photo}`} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                        alt="Check Out" 
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-zinc-400">
                        <Camera className="h-6 w-6 opacity-40" />
                        <span className="text-[10px] font-bold uppercase">No Photo</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-rose-600 text-white text-[9px] font-bold shadow-sm uppercase tracking-widest">
                      Out
                    </div>
                  </div>

                  <div className="space-y-1 px-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                      <LogOut className="h-3 w-3" />
                      Time
                    </div>
                    <div className="text-lg font-black text-zinc-800">
                      {detail?.checkOut?.time || "--:--"}
                    </div>
                    {detail?.checkOut?.time && (
                      <div className="text-[10px] text-zinc-500 font-medium italic">
                        Duration: {detail.meta.workDuration}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border bg-zinc-50/30">
                  <div>
                    <p className="text-xs font-bold uppercase text-zinc-500">Attendance Status</p>
                    <p className="text-sm uppercase font-bold">
                       {detail?.status || "PENDING"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isCapturing && (
          <DialogFooter className="p-6 bg-zinc-50/50 border-t flex gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1">Close</Button>
            </DialogClose>
            
            {isToday && !isWeekend && isOwnRecord && (
              <>
                {!hasCheckedIn && (
                  <Button 
                    onClick={() => { setIsCapturing(true); setCaptureMode("IN"); }}
                    className="flex-1 font-bold"
                  >
                    Check In
                  </Button>
                )}
                
                {hasCheckedIn && !hasCheckedOut && (
                  <Button 
                    variant="destructive"
                    onClick={() => { setIsCapturing(true); setCaptureMode("OUT"); }}
                    className="flex-1 font-bold"
                  >
                    Check Out
                  </Button>
                )}
              </>
            )}

            {hasCheckedOut && (
              <Badge variant="outline" className="flex-1 flex justify-center py-2 h-auto text-rose-600 border-rose-200 bg-rose-50 italic">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Work Completed
              </Badge>
            )}
            
            {hasCheckedIn && !hasCheckedOut && (!isToday || !isOwnRecord) && (
              <Badge variant="outline" className="flex-1 flex justify-center py-2 h-auto text-amber-600 border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 mr-2" />
                {isToday ? "Wait for Checkout" : "No Checkout Recorded"}
              </Badge>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
