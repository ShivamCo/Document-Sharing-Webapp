import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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

export default useDocuments;