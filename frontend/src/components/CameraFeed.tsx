import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";

interface CameraFeedProps {
  isActive: boolean;
  onError?: (error: string) => void;
}

export const CameraFeed = ({ isActive, onError }: CameraFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      console.log("🎥 Requesting camera access...");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false
      });

      console.log("✅ Camera access granted");
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log("📹 Video metadata loaded");
          videoRef.current?.play().then(() => {
            console.log("▶️ Video playing");
            setIsLoading(false);
          }).catch(err => {
            console.error("❌ Play error:", err);
            setHasError(true);
            setIsLoading(false);
            onError?.("Failed to play video");
          });
        };
      }
    } catch (error: any) {
      console.error("❌ Camera error:", error);
      setHasError(true);
      setIsLoading(false);
      
      let errorMessage = "Failed to access camera";
      if (error.name === 'NotAllowedError') {
        errorMessage = "Camera permission denied";
      } else if (error.name === 'NotFoundError') {
        errorMessage = "No camera found";
      } else if (error.name === 'NotReadableError') {
        errorMessage = "Camera is in use";
      }
      
      onError?.(errorMessage);
    }
  };

  const stopCamera = () => {
    console.log("⏹️ Stopping camera");
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log("🛑 Track stopped:", track.label);
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  if (!isActive) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
        <div className="text-center">
          <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Camera feed stopped</p>
          <p className="text-sm text-muted-foreground/70">Click start to begin monitoring</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="text-center text-white">
            <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
            <p>Loading camera...</p>
          </div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 z-20">
          <div className="text-center text-white">
            <Camera className="w-16 h-16 mx-auto mb-4" />
            <p>Camera error</p>
            <p className="text-sm">Check console for details</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        playsInline
        muted
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Live indicator */}
      <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 z-10">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        Live
      </div>
    </div>
  );
};
