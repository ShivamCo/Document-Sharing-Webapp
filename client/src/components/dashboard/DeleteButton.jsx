import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { FaTrash, FaExclamationTriangle, FaSpinner, FaTimes } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const DeleteButton = ({ adminId, fileId, onDeleteSuccess, onDeleteError }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteClick = () => {
    if (!adminId || !fileId) {
      toast.error("Admin ID and File ID are required");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmModal(false);
    setIsDeleting(true);
    const toastId = toast.loading("Deleting file...");

    try {
      const response = await axios.delete(
        `${API_URL}/delete/${adminId}/${fileId}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.update(toastId, {
          render: "File deleted successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          closeOnClick: true,
        });

        if (onDeleteSuccess) onDeleteSuccess(response.data);

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Error deleting file:", error);

      toast.update(toastId, {
        render:
          error.response?.data?.message ||
          "Failed to delete file. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeOnClick: true,
      });

      if (onDeleteError) onDeleteError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancelDelete();
    }
  };

  return (
    <>
      {/* Bin Icon Button */}
      <button
        onClick={handleDeleteClick}
        disabled={isDeleting}
        className={`
          p-2 rounded-full transition-all duration-300 ease-in-out
          backdrop-blur-sm border border-red-300/30
          ${isDeleting 
            ? "bg-red-400/20 cursor-not-allowed opacity-60" 
            : "bg-red-500/10 hover:bg-red-500/20 cursor-pointer hover:scale-105"}
        `}
        title="Delete file"
      >
        {isDeleting ? (
          <FaSpinner className="w-4 h-4 text-red-600 animate-spin" />
        ) : (
          <FaTrash className="w-4 h-4 text-red-600" />
        )}
      </button>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white/95 backdrop-blur-lg p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-200 scale-100 border border-white/20">
            {/* Close Button */}
            <button
              onClick={handleCancelDelete}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100/50"
            >
              <FaTimes size={16} />
            </button>

            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-red-200/50">
                <FaExclamationTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
              Confirm Delete
            </h3>
            
            {/* Message */}
            <p className="text-gray-600 mb-6 text-center leading-relaxed">
              Are you sure you want to delete this file? This action cannot be undone and the data will be permanently lost.
            </p>

            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCancelDelete}
                className="px-6 py-2.5 bg-gray-500/10 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-gray-500/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2 flex items-center gap-2 border border-gray-300/30"
              >
                <FaTimes />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 bg-red-600/90 backdrop-blur-sm text-white rounded-lg hover:bg-red-700/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 flex items-center gap-2 border border-red-500/30"
              >
                <FaTrash />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton;