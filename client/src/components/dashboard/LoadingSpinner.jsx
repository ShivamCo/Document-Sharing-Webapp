const LoadingSpinner = ({ size = "medium", text = "Loading..." }) => {
  const sizes = {
    small: "h-6 w-6",
    medium: "h-12 w-12",
    large: "h-16 w-16"
  };

  return (
    <div 
      className="flex flex-col justify-center items-center min-h-64 space-y-4"
      role="status"
      aria-label="Loading"
    >
      <div 
        className={`animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 ${sizes[size]}`}
      ></div>
      {text && <p className="text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;