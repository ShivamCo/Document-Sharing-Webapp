import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const DeleteButton = ({ adminId, fileId, onDeleteSuccess, onDeleteError }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!adminId || !fileId) {
      toast.error("Admin ID and File ID are required");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this file? This action cannot be undone."
      )
    ) {
      return;
    }

    // 👇 Get token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authorized. Please log in again.");
      return;
    }

    setIsDeleting(true);
    const toastId = toast.loading("Deleting file...");

    try {
      const response = await axios.delete(
        `${API_URL}/delete/${adminId}/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 👈 Send JWT here
          },
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

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="delete-button"
      style={{
        padding: "8px 16px",
        backgroundColor: isDeleting ? "#6c757d" : "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: isDeleting ? "not-allowed" : "pointer",
        opacity: isDeleting ? 0.6 : 1,
        transition: "all 0.3s ease",
        minWidth: "120px",
      }}
    >
      {isDeleting ? (
        <>
          <span style={{ marginRight: "8px" }}>⏳</span>
          Deleting...
        </>
      ) : (
        "Delete File"
      )}
    </button>
  );
};

export default DeleteButton;
