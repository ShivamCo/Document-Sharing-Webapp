import { useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const UploadPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();

  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    uploadPin: "",
    adminId: id,
    email: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  
  useEffect(() => {
    if (id) {
      setFormData((prev) => ({ ...prev, adminId: id }));
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 20 * 1024 * 1024; 
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    const validFiles = [];
    for (let file of files) {
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 20MB ❌`);
        continue;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported type ❌`);
        continue;
      }
      validFiles.push(file);
    }

    setSelectedFiles(validFiles);
    if (validFiles.length > 0) {
      toast.success(`${validFiles.length} file(s) selected ✅`);
    }
  };

  const removeFile = (idx) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== idx));
    if (selectedFiles.length === 1 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.info("File removed 🗑️");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0)
      return toast.error("Please select files 📄");
    if (!formData.uploadPin) return toast.error("Please enter upload PIN 🔒");
    if (!formData.adminId) return toast.error("Please enter Admin ID 👤");
    if (!formData.email) return toast.error("Please enter Email 📧");

    setUploading(true);
    const toastId = toast.loading("Uploading files... ⬆️");

    try {
      const uploadData = new FormData();
      uploadData.append("uploadPin", formData.uploadPin);
      uploadData.append("adminId", formData.adminId);
      uploadData.append("email", formData.email);

      selectedFiles.forEach((file) => {
        uploadData.append("files", file); 
      });

      await axios.post(`${API_URL}/upload/${id}`, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            toast.update(toastId, { render: `Uploading... ${progress}% 📊` });
          }
        },
      });

      toast.update(toastId, {
        render: "Files uploaded successfully! 🎉",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setFormData({ uploadPin: "", adminId: id || "", email: "" });
      setSelectedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      const errorMsg = error.response?.data?.error || "Upload failed ❌";
      toast.update(toastId, {
        render: errorMsg,
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes("pdf")) return "📕";
    if (type.includes("image")) return "🖼️";
    return "📎";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <ToastContainer />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Upload Documents
          </h1>
          <p className="text-lg text-gray-600">
            Secure file upload with PIN and Email verification. Max 20MB per
            file.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          {uploading && (
            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
          )}

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Admin ID */}
             { id ?<></> : <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Admin ID *
                </label>

                <input
                  type="text"
                  name="adminId"
                  value={formData.adminId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter admin ID"
                  required
                  disabled={uploading}
                />
              </div>}

              {/* Email */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  required
                  disabled={uploading}
                />
              </div>

              {/* PIN */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Upload PIN *
                </label>
                <input
                  type="password"
                  name="uploadPin"
                  value={formData.uploadPin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                    transition-colors text-center text-xl font-mono tracking-widest"
                  placeholder="••••"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  required
                  disabled={uploading}
                />
              </div>

              {/* File Input */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Select Documents *
                </label>
                <div
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 ${
                    selectedFiles.length > 0
                      ? "border-green-400 bg-green-50/30"
                      : "border-gray-300"
                  }`}
                  onClick={() => !uploading && fileInputRef.current?.click()}
                >
                  <div className="max-w-md mx-auto">
                    <div className="text-4xl mb-3">📤</div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {selectedFiles.length > 0
                        ? `${selectedFiles.length} File(s) Selected`
                        : "Click to Select Files"}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">
                      {selectedFiles.length > 0
                        ? `${selectedFiles.map((f) => f.name).join(", ")}`
                        : "Choose PDF or image files"}
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md disabled:opacity-50"
                      disabled={uploading}
                    >
                      Choose Files
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
                    multiple 
                    disabled={uploading}
                  />
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {selectedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">
                            {getFileIcon(file.type)}
                          </span>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)} • {file.type}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          disabled={uploading}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Remove file"
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <button
                type="submit"
                disabled={
                  uploading ||
                  selectedFiles.length === 0 ||
                  !formData.uploadPin ||
                  !formData.adminId ||
                  !formData.email
                }
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shadow-lg text-lg"
              >
                {uploading ? "Uploading..." : "Upload Documents"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
