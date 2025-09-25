const DocumentCard = ({ document }) => {
  const { original_name, file_type, file_url, file_size, created_at, mime_type } = document;
  
  const getFileType = () => {
    if (file_type) return file_type;
    if (mime_type) {
      if (mime_type.startsWith('image/')) return 'image';
      if (mime_type === 'application/pdf') return 'pdf';
      if (mime_type.includes('word')) return 'word';
      if (mime_type.includes('excel')) return 'excel';
      if (mime_type.includes('zip')) return 'archive';
    }
    return 'file';
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

  const getFileIcon = () => {
    const icons = {
      image: '🖼️',
      pdf: '📄',
      word: '📝',
      excel: '📊',
      archive: '📦',
      file: '📎'
    };
    return icons[fileType] || icons.file;
  };

  const getFilePreview = () => {
    if (isImage) {
      return (
        <div className="relative w-full h-48 overflow-hidden rounded-xl mb-3">
          <img
            src={file_url}
            alt={original_name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center">
            <div className="text-center">
              <div className="text-4xl text-blue-500 mb-2">{getFileIcon()}</div>
              <span className="text-sm text-blue-700 font-medium">Image</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-3 flex items-center justify-center group-hover:from-blue-50 group-hover:to-blue-100 transition-all duration-300">
        <div className="text-center">
          <div className="text-6xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
            {getFileIcon()}
          </div>
          <span className="text-sm font-medium capitalize">{fileType}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
      <div className="relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 border border-gray-100 group-hover:border-blue-200">
        {getFilePreview()}
        
        <p 
          className="font-semibold text-gray-900 mb-3 truncate text-base leading-tight" 
          title={original_name}
        >
          {original_name}
        </p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full capitalize">
            {fileType}
          </span>
          <span className="text-xs text-gray-500 font-medium">
            {formatFileSize(file_size)}
          </span>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-medium">
            {formatDate(created_at)}
          </span>
          <a
            href={file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
          >
            {isPdf ? "View" : "Open"}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;