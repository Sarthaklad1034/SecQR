import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/Alert';
import { useLocation, useNavigate } from 'react-router-dom';

const SafeSection = () => {
  const [isReporting, setIsReporting] = useState(false);
  const [reportStatus, setReportStatus] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract data from location state
  const { url, imageSrc } = location.state || {};

  const reportUrl = async () => {
    if (!url) {
      setReportStatus({ error: true, message: 'No URL provided' });
      return;
    }

    setIsReporting(true);
    try {
      const response = await axios.post(`${BASE_URL}/report-url`, { url });
      setReportStatus({ error: false, message: response.data.message });
    } catch (error) {
      setReportStatus({ 
        error: true, 
        message: 'Error reporting URL. Please try again.'
      });
    } finally {
      setIsReporting(false);
    }
  };

  const handleOpenUrl = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Scanner
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Status Banner */}
          <div className="bg-green-600 p-4">
            <div className="flex items-center justify-center text-white">
              <CheckCircle2 className="w-8 h-8 mr-3" />
              <h1 className="text-2xl font-bold">Safe URL Detected</h1>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <Alert 
              type="success"
              title="URL Analysis Complete"
              description="This URL has passed our security checks. However, always exercise caution when visiting new websites."
              className="mb-6"
            />

            {/* URL Display */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-600 mb-2">Detected URL:</h2>
              <div className="bg-gray-50 p-3 rounded-md break-all border border-green-200">
                {url || "No URL detected"}
              </div>
            </div>

            {/* Image Preview */}
            {imageSrc && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-600 mb-2">Captured QR Code:</h2>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={imageSrc}
                    alt="Captured QR Code"
                    className="w-full max-w-md mx-auto"
                  />
                </div>
              </div>
            )}

            {/* Status Messages */}
            {reportStatus && (
              <Alert 
                type={reportStatus.error ? "danger" : "success"}
                description={reportStatus.message}
                className="mb-6"
              />
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={reportUrl}
                disabled={isReporting}
                className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50"
              >
                {isReporting ? 'Reporting...' : 'Report as Suspicious'}
              </button>
              <button
                onClick={handleOpenUrl}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Open URL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeSection;