import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, Check, X } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImgSrc(imageSrc);
    }
  }, [webcamRef]);

  const handleConfirm = () => {
    if (imgSrc) {
      // Convert base64 to File object
      fetch(imgSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "attendance-photo.jpg", { type: "image/jpeg" });
          onCapture(file);
        });
    }
  };

  const handleRetake = () => {
    setImgSrc(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-video rounded-2xl overflow-hidden border bg-black shadow-inner">
        {!imgSrc ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            className="w-full h-full object-cover"
          />
        ) : (
          <img src={imgSrc} className="w-full h-full object-cover" alt="Captured" />
        )}
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
          {!imgSrc ? (
            <Button 
              onClick={capture} 
              size="icon" 
              className="h-12 w-12 rounded-full shadow-xl bg-white text-primary hover:bg-zinc-100 border-0"
            >
              <Camera className="h-6 w-6" />
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleRetake} 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border-0"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
              <Button 
                onClick={handleConfirm} 
                size="icon" 
                className="h-10 w-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg border-0"
              >
                <Check className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Button variant="ghost" onClick={onCancel} className="w-full text-zinc-500 font-bold uppercase text-[10px]">
        <X className="mr-2 h-3 w-3" />
        Cancel Capture
      </Button>
    </div>
  );
}
