import DocumentCard from "./DocumentCard";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const DocumentGrid = ({ documents, loading, error, onRetry, adminId }) => {
  if (loading) {
    return <LoadingSpinner text="Loading documents..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={onRetry}
        type="error"
      />
    );
  }

  if (documents.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <div className="text-8xl text-gray-300 mb-6">📁</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No documents yet</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Start uploading documents to see them appear here. Your files will be securely stored and easily accessible.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {documents.map((document) => (
        <DocumentCard key={document.id} adminId={adminId} document={document} />
      ))}
    </div>
  );
};

export default DocumentGrid;