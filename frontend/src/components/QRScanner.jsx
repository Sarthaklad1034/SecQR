// import React, { useState, useRef, useEffect } from 'react';
// import { Camera } from 'lucide-react';
// import { Card, CardContent } from './ui/Card';
// import { Alert, AlertDescription } from './ui/Alert';

// const QRScanner = ({ onScan, isProcessing, scanStatus }) => {
//   const [isCameraActive, setIsCameraActive] = useState(false);
//   const [error, setError] = useState(null);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const videoRef = useRef(null);
//   const streamRef = useRef(null);

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: { 
//           facingMode: 'environment',
//           width: { ideal: 1280 },
//           height: { ideal: 720 }
//         }
//       });
      
//       streamRef.current = stream;
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
        
//         videoRef.current.onloadedmetadata = async () => {
//           try {
//             await videoRef.current.play();
//             setIsCameraActive(true);
//             setCapturedImage(null);
//             setError(null);
//           } catch (playError) {
//             setError('Failed to start video playback');
//           }
//         };
//       }
//     } catch (err) {
//       setError('Unable to access camera. Please ensure you have granted camera permissions.');
//     }
//   };

//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => {
//         track.stop();
//       });
//       streamRef.current = null;
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//     setIsCameraActive(false);
//   };

//   const captureFrame = () => {
//     if (videoRef.current) {
//       const canvas = document.createElement('canvas');
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;
//       const ctx = canvas.getContext('2d');
//       ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
//       // Stop the camera after capturing
//       stopCamera();
      
//       // Store the captured image
//       const imageData = canvas.toDataURL('image/png');
//       setCapturedImage(imageData);
//       return imageData;
//     }
//     return null;
//   };

//   const handleCapture = () => {
//     const frame = captureFrame();
//     if (frame) {
//       onScan(frame);
//     }
//   };

//   const handleRetry = () => {
//     setCapturedImage(null);
//     startCamera();
//   };

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (streamRef.current) {
//         stopCamera();
//       }
//     };
//   }, []);

//   return (
//     <div className="w-full mx-auto">
//       <Card className="bg-white shadow-md sm:shadow-lg">
//         <CardContent className="p-3 sm:p-6">
//           {error && (
//             <Alert 
//               type="danger"
//               description={error}
//               className="mb-3 sm:mb-4 text-xs sm:text-sm"
//             />
//           )}
          
//           <div className="relative w-full aspect-video bg-gray-100 rounded-md sm:rounded-lg overflow-hidden">
//             {!capturedImage ? (
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 className={`absolute inset-0 w-full h-full object-cover ${
//                   isCameraActive ? 'opacity-100' : 'opacity-0'
//                 }`}
//               />
//             ) : (
//               <img 
//                 src={capturedImage}
//                 alt="Captured QR Code"
//                 className="absolute inset-0 w-full h-full object-cover"
//               />
//             )}
            
//             {!isCameraActive && !capturedImage && (
//               <button
//                 onClick={startCamera}
//                 className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-4 hover:bg-gray-200 transition-colors"
//               >
//                 <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
//                 <span className="text-xs sm:text-sm md:text-base text-gray-500 font-medium px-2 text-center">
//                   Click to activate camera
//                 </span>
//               </button>
//             )}
//           </div>

//           <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
//             {!capturedImage ? (
//               <button
//                 onClick={handleCapture}
//                 disabled={!isCameraActive || isProcessing}
//                 className={`px-4 py-2 text-sm sm:text-base rounded-md transition-colors ${
//                   isCameraActive && !isProcessing
//                     ? 'bg-blue-600 text-white hover:bg-blue-700'
//                     : 'bg-blue-200 text-gray-500 cursor-not-allowed'
//                 }`}
//               >
//                 {isProcessing ? 'Processing...' : 'Capture QR Code'}
//               </button>
//             ) : (
//               <button
//                 onClick={handleRetry}
//                 disabled={isProcessing}
//                 className="px-4 py-2 text-sm sm:text-base rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
//               >
//                 Retry Capture
//               </button>
//             )}
            
//             {isCameraActive && (
//               <button
//                 onClick={stopCamera}
//                 className="mt-2 sm:mt-0 px-4 py-2 text-sm sm:text-base rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
//               >
//                 Stop Camera
//               </button>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default QRScanner;

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Alert, AlertDescription } from './ui/Alert';

const QRScanner = ({ onScan, isProcessing, scanStatus }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current.play();
            setIsCameraActive(true);
            setCapturedImage(null);
            setError(null);
          } catch (playError) {
            setError('Failed to start video playback');
          }
        };
      }
    } catch (err) {
      setError('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Stop the camera after capturing
      stopCamera();
      
      // Store the captured image
      const imageData = canvas.toDataURL('image/png');
      setCapturedImage(imageData);
      return imageData;
    }
    return null;
  };

  const handleCapture = () => {
    const frame = captureFrame();
    if (frame) {
      onScan(frame);
    }
  };

  const handleRetry = () => {
    setCapturedImage(null);
    setError(null);
    // Safely check if the ref exists before trying to reset its value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Only allow image files
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Maximum file size check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Please select an image under 5MB.');
      return;
    }

    // Stop camera if active
    if (isCameraActive) {
      stopCamera();
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imageData = e.target.result;
        setCapturedImage(imageData);
        onScan(imageData);
      } catch (err) {
        setError('Error processing the image');
      }
    };
    reader.onerror = () => {
      setError('Error reading file');
    };
    reader.readAsDataURL(file);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        stopCamera();
      }
    };
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto">
      <Card className="bg-white shadow-md">
        <CardContent className="p-4">
          {error && (
            <Alert 
              variant="destructive"
              className="mb-4"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="relative w-full aspect-video bg-gray-50 rounded-lg overflow-hidden">
            {!capturedImage ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 w-full h-full object-cover ${
                  isCameraActive ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : (
              <img 
                src={capturedImage}
                alt="Captured QR Code"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            
            {!isCameraActive && !capturedImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-row space-x-8 sm:space-x-12">
                  <button
                    onClick={startCamera}
                    className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 font-medium">
                      Use Camera
                    </span>
                  </button>
                  
                  <button
                    onClick={handleUploadClick}
                    className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 font-medium">
                      Upload Image
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mt-4 flex justify-center gap-4">
            {!capturedImage ? (
              <>
                {isCameraActive && (
                  <>
                    <button
                      onClick={handleCapture}
                      disabled={!isCameraActive || isProcessing}
                      className={`px-4 py-2 rounded-md ${
                        isCameraActive && !isProcessing
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      } transition-colors`}
                    >
                      {isProcessing ? 'Processing...' : 'Capture QR Code'}
                    </button>
                    
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={handleRetry}
                disabled={isProcessing}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Try Again
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;