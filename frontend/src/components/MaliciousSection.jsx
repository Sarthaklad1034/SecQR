import React, { useState } from 'react';
import axios from 'axios';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/Alert';
import { useLocation, useNavigate } from 'react-router-dom';

const MaliciousSection = () => {
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
    const confirmed = window.confirm(
      'Warning: This URL has been flagged as potentially malicious. Are you sure you want to proceed?'
    );
    if (confirmed) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:p-6 md:p-8">
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-4 sm:mb-6 -ml-1">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-sm sm:text-base text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Back to Scanner
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Warning Banner */}
          <div className="bg-red-600 py-3 px-4 sm:p-4">
            <div className="flex items-center justify-center text-white">
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
              <h1 className="text-xl sm:text-2xl font-bold">Malicious URL Detected</h1>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-6">
            <Alert 
              type="danger"
              title="Warning"
              description="This URL has been identified as potentially dangerous. Exercise extreme caution."
              className="mb-4 sm:mb-6 text-sm sm:text-base"
            />

            {/* URL Display */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">Detected URL:</h2>
              <div className="bg-gray-50 p-2 sm:p-3 rounded-md break-all border border-red-200 text-xs sm:text-sm">
                {url || "No URL detected"}
              </div>
            </div>

            {/* Image Preview */}
            {imageSrc && (
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">Captured QR Code:</h2>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={imageSrc}
                    alt="Captured QR Code"
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
                  />
                </div>
              </div>
            )}

            {/* Status Messages */}
            {reportStatus && (
              <Alert 
                type={reportStatus.error ? "danger" : "success"}
                description={reportStatus.message}
                className="mb-4 sm:mb-6 text-xs sm:text-sm"
              />
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6">
              <button
                onClick={reportUrl}
                disabled={isReporting}
                className="flex-1 bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isReporting ? 'Reporting...' : 'Report URL'}
              </button>
              <button
                onClick={handleOpenUrl}
                className="flex-1 mt-2 sm:mt-0 bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Open URL (Not Recommended)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaliciousSection;