const ErrorMessage = ({ message, onRetry, type = "error" }) => {
  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    info: "bg-blue-50 border-blue-200 text-blue-700"
  };

  const icons = {
    error: "❌",
    warning: "⚠️",
    info: "ℹ️"
  };

  return (
    <div className={`border-2 rounded-xl p-6 text-center ${styles[type]}`}>
      <div className="text-4xl mb-3">{icons[type]}</div>
      <p className="mb-4 font-medium text-lg">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;