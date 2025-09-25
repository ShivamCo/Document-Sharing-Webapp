import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import useAuth from "../hooks/useAuth";
import useDocuments from "../hooks/useDocuments";
import Header from "../components/dashboard/Header";
import WelcomeSection from "../components/dashboard/WelcomeSection";
import DocumentGrid from "../components/dashboard/DocumentGrid";
import LoadingSpinner from "../components/dashboard/LoadingSpinner";
import ErrorMessage from "../components/dashboard/ErrorMessage";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const { user, loading, authError, checkAuth, logout } = useAuth();
  const [adminId, setAdminId] = useState(null);
  const { documents, documentsLoading, error, fetchDocuments } = useDocuments(adminId);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const userData = await checkAuth();
      if (userData) {
        setAdminId(userData.id);
        toast.success(`Welcome back, ${userData.name}! 🎉`, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    };

    initializeAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (adminId) {
      fetchDocuments();
    }
  }, [adminId, fetchDocuments]);

  const handleRefresh = async () => {
    setRefreshing(true);
    const toastId = toast.loading("Refreshing documents... 🔄", {
      position: "bottom-center",
    });

    try {
      await fetchDocuments();
      
      toast.update(toastId, {
        render: "Documents refreshed successfully! ✅",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        hideProgressBar: false,
      });
    } catch (err) {
      toast.update(toastId, {
        render: "Failed to refresh documents ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    const toastId = toast.loading("Signing out... 👋", {
      position: "bottom-center",
    });

    try {
      await logout();
      toast.update(toastId, {
        render: "Signed out successfully! ✅",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: "Error signing out ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <LoadingSpinner size="large" text="Loading your dashboard..." />
      </div>
    );
  }

  if (authError) {
    toast.error(`Authentication Error: ${authError} 🔒`, {
      position: "bottom-center",
      autoClose: 5000,
    });
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <ErrorMessage message={authError} type="error" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100">
      {/* Toast Container */}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ marginTop: '80px' }}
        toastStyle={{
          background: 'white',
          color: '#374151',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
        }}
      />

      <Header user={user} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection user={user} documentCount={documents.length} />
        
        {/* Documents Section */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Documents</h2>
              <p className="text-gray-600 mt-1">Manage and access all your uploaded files</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-full font-medium">
                {documents.length} document{documents.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={handleRefresh}
                disabled={documentsLoading || refreshing}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                title="Refresh documents"
              >
                {refreshing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          <DocumentGrid 
            documents={documents} 
            loading={documentsLoading} 
            error={error} 
            onRetry={handleRefresh} 
          />
        </section>

        {/* Quick Stats */}
        {documents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{documents.length}</div>
              <div className="text-sm text-green-700">Total Documents</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {documents.filter(doc => doc.size < 1024 * 1024).length}
              </div>
              <div className="text-sm text-blue-700">Small Files (&lt;1MB)</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(documents.map(doc => doc.type)).size}
              </div>
              <div className="text-sm text-purple-700">File Types</div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2024 DocManager. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {documents.length > 0 
              ? `You have ${documents.length} document${documents.length !== 1 ? 's' : ''} stored securely` 
              : 'Start uploading documents to see them here!'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;