import {
  FaRegFile,
  FaRegFilePdf,
  FaRegFileImage,
  FaRegFileWord,
  FaRegFileExcel,
  FaRegFileArchive,
  FaDownload,
  FaEye,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import DeleteButton from "./DeleteButton";

const DocumentCard = ({ document, adminId }) => {
  const {
    original_name,
    file_type,
    file_url,
    file_size,
    created_at,
    mime_type,
    email,
  } = document;

  const getFileType = () => {
    const type = mime_type || file_type;

    if (!type) return "file";

    if (type.startsWith("image/")) return "image";
    if (type === "application/pdf") return "pdf";
    if (type.includes("word")) return "word";
    if (type.includes("excel") || type.includes("spreadsheet")) return "excel";
    if (type.includes("zip") || type.includes("rar")) return "archive";

    return "file";
  };

  const fileType = getFileType();
  const isImage = fileType === "image";
  const isPdf = fileType === "pdf";

  const getFileIcon = () => {
    const iconProps = {
      className:
        "text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300",
    };

    switch (fileType) {
      case "image":
        return <FaRegFileImage {...iconProps} />;
      case "pdf":
        return <FaRegFilePdf {...iconProps} />;
      case "word":
        return <FaRegFileWord {...iconProps} />;
      case "excel":
        return <FaRegFileExcel {...iconProps} />;
      case "archive":
        return <FaRegFileArchive {...iconProps} />;
      default:
        return <FaRegFile {...iconProps} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFilePreview = () => {
    if (isImage) {
      return (
        <div className="relative w-full h-48 overflow-hidden rounded-xl mb-3">
          <img
            src={file_url}
            alt={original_name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div className="hidden absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center">
            <div className="text-center">
              {getFileIcon()}
              <span className="text-sm text-blue-700 font-medium">Image</span>
            </div>
          </div>
        </div>
      );
    }

    if (isPdf) {
     
      return (
        <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-3 flex items-center justify-center transition-all duration-300">
          <div className="text-center">
            {getFileIcon()}
            <span className="text-sm text-gray-600 font-medium">PDF</span>
          </div>
        </div>
      );
    }

    
    return (
      <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-3 flex items-center justify-center transition-all duration-300">
        <div className="text-center">
          {getFileIcon()}
        </div>
      </div>
    );
  };

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
      <div className="relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 border border-gray-100 group-hover:border-blue-200">
        {getFilePreview()}

        {/* File Name */}
        <p
          className="font-semibold text-gray-900 mb-2 truncate text-base leading-tight"
          title={original_name}
        >
          {original_name}
        </p>

        {/* Uploader Email */}
        {email && (
          <p
            className="text-xs text-gray-500 mb-3 truncate"
            title={`Uploaded by: ${email}`}
          >
            <span className="font-medium">Uploader:</span> {email}
          </p>
        )}

        {/* File Size only */}
        <div className="flex justify-end items-center mb-3">
          <span className="text-xs text-gray-500 font-medium">
            {formatFileSize(file_size)}
          </span>
        </div>

        
        <div className="mb-3">
          <span className="text-xs text-gray-400 font-medium">
            Uploaded: {formatDate(created_at)}
          </span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <DeleteButton
            adminId={adminId}
            fileId={document.file_id}
            icon={<MdDelete className="w-4 h-4" />}
          />
          <a
            href={file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
          >
            {isPdf ? "View" : "Download"}
            {isPdf ? (
              <FaEye className="w-4 h-4" />
            ) : (
              <FaDownload className="w-4 h-4" />
            )}
          </a>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
