import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SplashScreenProps {
  isExiting?: boolean;
}

export default function SplashScreen({ isExiting = false }: SplashScreenProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center h-screen bg-background transition-all",
        isExiting && "animate-slide-out-to-top"
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        <img
          src="/image/dexa.png"
          alt="Logo"
          className="w-40 animate-pulse"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <LoaderCircle className="w-4 h-4 animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}