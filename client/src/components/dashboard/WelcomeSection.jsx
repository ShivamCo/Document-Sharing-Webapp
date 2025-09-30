import QrCodeGenrator from "./QrCodeGenrator";
import { useState } from "react";

const WelcomeSection = ({ user, documentCount, adminId }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const handleQrCodeGenerated = (url) => {
    setQrCodeUrl(url);
  };

  const downloadQrCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = `qr-code-${adminId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <section className="mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Left Content */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                Document Dashboard
              </h1>
              <p className="text-blue-100 text-base md:text-lg mb-4">
                Welcome back, <span className="font-semibold text-white">{user?.name}</span>
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[120px]">
                  <span className="text-sm opacity-90 block">Total Documents</span>
                  <div className="text-xl font-bold">{documentCount}</div>
                </div>
                
                {/* Optional: Add more stats cards here */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[120px]">
                  <span className="text-sm opacity-90 block">Admin ID</span>
                  <div className="text-lg font-mono font-bold truncate max-w-[100px]">
                    {adminId}
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-white/20">
              <div className="text-center mb-3">
                <h3 className="font-semibold text-white mb-1">Share QR Code</h3>
                <p className="text-blue-100 text-xs md:text-sm">Scan to Upload Documents</p>
                <p className="text-yellow-400 bg-black  border-2 rounded-2xl  text-2xl md:text-lg">Share Pin : {user?.pin}</p>
              </div>
              
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-white p-2 rounded-lg shadow-lg">
                  <QrCodeGenrator 
                    adminId={adminId} 
                    onQrCodeGenerated={handleQrCodeGenerated}
                    size={120}
                  />
                </div>
                
                {qrCodeUrl && (
                  <button
                    onClick={downloadQrCode}
                    className="flex items-center justify-center space-x-2 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Download QR</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;