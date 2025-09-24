import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Constants
const SUPPORTED_IMAGE_FORMATS = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "tiff"];
const PDF_FORMAT = "pdf";
const API_URL = import.meta.env.VITE_API_URL;

// Custom hook for authentication
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      setAuthError(null);
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      
      if (response.data.user) {
        setUser(response.data.user);
        return response.data.user;
      } else {
        throw new Error("No user data received");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthError("Session expired. Please log in again.");
      navigate("/user");
      return null;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return { user, loading, authError, checkAuth };
};

// Custom hook for documents management
const useDocuments = (adminId) => {
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = useCallback(async () => {
    if (!adminId) {
      setError("Admin ID not available");
      return;
    }

    setDocumentsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${API_URL}/get-all-documents/${adminId}`,
        { 
          withCredentials: true,
          timeout: 10000
        }
      );
      
      const docs = Array.isArray(response.data) ? response.data : [];
      setDocuments(docs);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          "Failed to fetch documents";
      setError(errorMessage);
      console.error("Error fetching documents:", err);
    } finally {
      setDocumentsLoading(false);
    }
  }, [adminId]);

  const refreshDocuments = useCallback(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return { 
    documents, 
    documentsLoading, 
    error, 
    fetchDocuments: refreshDocuments 
  };
};

// Loading component
const LoadingSpinner = ({ size = "medium" }) => {
  const sizes = {
    small: "h-6 w-6",
    medium: "h-12 w-12",
    large: "h-16 w-16"
  };

  return (
    <div 
      className="flex justify-center items-center min-h-64"
      role="status"
      aria-label="Loading documents"
    >
      <div 
        className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizes[size]}`}
      ></div>
    </div>
  );
};

// Error component
const ErrorMessage = ({ message, onRetry, type = "error" }) => {
  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    info: "bg-blue-50 border-blue-200 text-blue-700"
  };

  return (
    <div className={`border rounded-lg p-4 text-center ${styles[type]}`}>
      <p className="mb-3 font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors font-medium"
        >
          Retry
        </button>
      )}
    </div>
  );
};

// Document Card component
const DocumentCard = ({ document }) => {
  const { original_name, file_type, file_url, file_size, created_at, mime_type } = document;
  
  const getFileType = () => {
    if (file_type) return file_type;
    if (mime_type) {
      if (mime_type.startsWith('image/')) return 'image';
      if (mime_type === 'application/pdf') return 'pdf';
    }
    return 'unknown';
  };

  const fileType = getFileType();
  const isImage = fileType === 'image';
  const isPdf = fileType === 'pdf';

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFilePreview = () => {
    if (isImage) {
      return (
        <img
          src={file_url}
          alt={original_name}
          className="w-full h-48 object-cover rounded-md mb-2"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }

    if (isPdf) {
      return (
        <div className="w-full h-48 bg-gradient-to-br from-red-50 to-red-100 rounded-md mb-2 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl text-red-500 mb-2">📄</div>
            <span className="text-sm text-red-700 font-medium">PDF Document</span>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-48 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl text-gray-400 mb-2">📎</div>
          <span className="text-sm text-gray-600 font-medium">Document</span>
        </div>
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-white p-4 group">
      <p 
        className="font-medium text-gray-900 mb-2 truncate text-sm" 
        title={original_name}
      >
        {original_name}
      </p>
      
      <div className="relative">
        {getFilePreview()}
        {isImage && (
          <div className="hidden w-full h-48 bg-gray-100 rounded-md mb-2 items-center justify-center absolute top-0 left-0">
            <div className="text-center">
              <div className="text-4xl text-gray-400 mb-2">🖼️</div>
              <span className="text-sm text-gray-600">Image not available</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded capitalize">
          {fileType}
        </span>
        <span className="text-xs text-gray-500">
          {formatFileSize(file_size)}
        </span>
      </div>
      
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {formatDate(created_at)}
        </span>
        <a
          href={file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors flex items-center gap-1"
        >
          {isPdf ? "View" : "Open"}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { user, loading, authError, checkAuth } = useAuth();
  const [adminId, setAdminId] = useState(null);
  const { documents, documentsLoading, error, fetchDocuments } = useDocuments(adminId);

  useEffect(() => {
    const initializeAuth = async () => {
      const userData = await checkAuth();
      if (userData) {
        setAdminId(userData.id);
      }
    };

    initializeAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (adminId) {
      fetchDocuments();
    }
  }, [adminId, fetchDocuments]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message={authError} type="error" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Document Dashboard</h1>
          {user && (
            <p className="text-lg text-gray-600 mt-2">
              Welcome back, <span className="font-semibold text-blue-600">{user.name}</span>
            </p>
          )}
        </div>

        {/* Documents Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Documents</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {documents.length} document{documents.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={fetchDocuments}
                disabled={documentsLoading}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Refresh documents"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <ErrorMessage 
              message={error} 
              onRetry={fetchDocuments}
              type="error"
            />
          )}

          {/* Loading State */}
          {documentsLoading ? (
            <LoadingSpinner />
          ) : (
            /* Documents Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {documents.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl text-gray-300 mb-4">📁</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
                  <p className="text-gray-500">Your uploaded documents will appear here</p>
                </div>
              ) : (
                documents.map((document) => (
                  <DocumentCard key={document.id} document={document} />
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;