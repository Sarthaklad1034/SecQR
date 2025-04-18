// import React, { useState } from 'react';
// import QRScanner from './QRScanner';
// import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
// import { Alert, AlertDescription } from './ui/Alert';
// import axios from 'axios';

// const HomeScreen = ({ onNavigate }) => {
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [error, setError] = useState(null);
//   const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, processing
//   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

//   const handleError = (message) => {
//     setError(message);
//     setScanStatus('idle');
//     setIsProcessing(false);
//   };

//   const checkMaliciousUrl = async (url) => {
//     try {
//       const response = await axios.post(
//         `${API_URL}/checkmalicious-url`,
//         { url },
//         { headers: { 'Content-Type': 'application/json' }}
//       );
//       return response.data.exists;
//     } catch (err) {
//       // Replace console.error with silent error handling for production
//       return false;
//     }
//   };

//   const processQRCode = async (imageData) => {
//     setIsProcessing(true);
//     setScanStatus('processing');
//     setError(null);

//     try {
//       // Scan QR code
//       const scanResponse = await axios.post(
//         `${API_URL}/scan`, 
//         { image: imageData },
//         { headers: { 'Content-Type': 'application/json' }}
//       );

//       const { url, status } = scanResponse.data;
      
//       if (!url) {
//         handleError('No QR code detected. Please try again.');
//         return;
//       }

//       // Check if URL is in malicious database
//       const isMalicious = await checkMaliciousUrl(url);
      
//       if (isMalicious || status === 'malicious') {
//         onNavigate('malicious', imageData, url);
//       } else {
//         onNavigate('safe', imageData, url);
//       }
//     } catch (err) {
//       handleError('Error processing QR code. Please try again.');
//       // Remove detailed error logging for production
//     } finally {
//       setIsProcessing(false);
//       setScanStatus('idle');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8 flex flex-col justify-start">
//       <div className="w-full max-w-3xl mx-auto">
//         {/* Header - Responsive text sizes */}
//         <div className="text-center mb-8 sm:mb-12">
//           <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-600 mb-2">
//             SecQR
//           </h1>
//           <p className="text-sm sm:text-base text-gray-600">
//             Secure QR Code Scanning with AI
//           </p>
//         </div>

//         {/* Main Content */}
//         <Card className="bg-white shadow-xl">
//           <CardHeader className="py-4 sm:py-6">
//             <CardTitle className="text-lg sm:text-xl text-center">
//               Scan QR Code
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="px-3 py-4 sm:px-6 sm:py-6">
//             {error && (
//               <Alert variant="destructive" className="mb-4 text-sm sm:text-base">
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             )}

//             <QRScanner 
//               onScan={processQRCode}
//               isProcessing={isProcessing}
//               scanStatus={scanStatus}
//             />

//             {isProcessing && (
//               <div className="mt-4 text-center text-sm sm:text-base text-gray-600">
//                 Processing QR code...
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Footer */}
//         <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 px-4">
//           Point your camera at a QR code to scan and analyze it securely
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomeScreen;

import React, { useState } from 'react';
import QRScanner from './QRScanner';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Alert, AlertDescription } from './ui/Alert';
import axios from 'axios';

const HomeScreen = ({ onNavigate }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, processing
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleError = (message) => {
    setError(message);
    setScanStatus('idle');
    setIsProcessing(false);
  };

  const checkMaliciousUrl = async (url) => {
    try {
      const response = await axios.post(
        `${API_URL}/checkmalicious-url`,
        { url },
        { headers: { 'Content-Type': 'application/json' }}
      );
      return response.data.exists;
    } catch (err) {
      console.log('Error checking malicious URL:', err);
      return false;
    }
  };

  const processQRCode = async (imageData) => {
    setIsProcessing(true);
    setScanStatus('processing');
    setError(null);

    try {
      // Create a proper base64 string for backend
      // The backend expects base64 without the data:image/xxx;base64, prefix
      let base64Image = imageData;
      
      // Check if we need to extract the base64 part from data URL format
      if (base64Image.startsWith('data:')) {
        // Find the comma that separates metadata from actual base64 data
        const commaIndex = base64Image.indexOf(',');
        if (commaIndex !== -1) {
          // Extract the part after the comma which is the actual base64 data
          base64Image = base64Image.substring(commaIndex + 1);
        }
      }

      // Scan QR code
      const scanResponse = await axios.post(
        `${API_URL}/scan`, 
        { image: base64Image },
        { 
          headers: { 'Content-Type': 'application/json' },
          // Increase timeout for larger images
          timeout: 30000
        }
      );

      const { status, url, message } = scanResponse.data;
      
      if (message === 'No QR code detected' || !url) {
        handleError('No QR code detected. Please try again with a clearer image.');
        return;
      }

      // Check if URL is in malicious database
      const isMalicious = await checkMaliciousUrl(url);
      
      if (isMalicious || status === 'malicious') {
        onNavigate('malicious', imageData, url);
      } else {
        onNavigate('safe', imageData, url);
      }
    } catch (err) {
      console.log('Error processing QR code:', err);
      
      // More specific error message based on the error
      if (err.response && err.response.status === 500) {
        handleError('Server error processing the image. The image might be too large or in an unsupported format.');
      } else if (err.code === 'ECONNABORTED') {
        handleError('Request timed out. The image might be too large to process.');
      } else {
        handleError('Error processing QR code. Please try again with a different image.');
      }
    } finally {
      setIsProcessing(false);
      setScanStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8 flex flex-col justify-start">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header - Responsive text sizes */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-indigo-600 mb-2">
            SecQR
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Secure QR Code Scanning with AI
          </p>
        </div>

        {/* Main Content */}
        <Card className="bg-white shadow-xl">
          <CardHeader className="py-4 sm:py-6">
            <CardTitle className="text-lg sm:text-xl text-center">
              Scan or Upload QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 py-4 sm:px-6 sm:py-6">
            {error && (
              <Alert variant="destructive" className="mb-4 text-sm sm:text-base">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <QRScanner 
              onScan={processQRCode}
              isProcessing={isProcessing}
              scanStatus={scanStatus}
            />

            {isProcessing && (
              <div className="mt-4 text-center text-sm sm:text-base text-gray-600">
                Processing QR code...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 px-4">
          Point your camera at a QR code or upload an image containing a QR code to analyze it securely
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;