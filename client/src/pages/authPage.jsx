import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js"; 
import "react-toastify/dist/ReactToastify.css";

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, loading, checkAuth } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    pin: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    
    const verifyUser = async () => {
      const loggedInUser = await checkAuth();
      if (loggedInUser) {
        navigate("/dashboard");
      }
    };
    
     verifyUser();
  }, [checkAuth, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const toastId = toast.loading("Processing...", { position: "top-center" });

    try {
      if (isLogin) {
        await axios.post(
          `${API_URL}/login`,
          { email: formData.email, password: formData.password },
          { withCredentials: true }
        );

        toast.update(toastId, {
          render: "Login successful 🎉",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          onClose: () => navigate("/dashboard"),
        });
      } else {
        await axios.post(
          `${API_URL}/signup`,
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            pin: formData.pin,
          },
          { withCredentials: true }
        );

        toast.update(toastId, {
          render: "Account created ✅",
          type: "success",
          isLoading: false,
          autoClose: 2000,
          onClose: () => setIsLogin(true),
        });
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        (isLogin ? "Login failed ❌" : "Signup failed ❌");

      toast.update(toastId, {
        render: msg,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 w-full max-w-md overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-blue-100">
            {isLogin ? "Sign in to your account" : "Join us today"}
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-white">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    required={!isLogin}
                  />
                  <div className="absolute right-3 top-3 text-gray-400">
                    👤
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="hello@example.com"
                  required
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  ✉️
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="pin" className="block text-sm font-medium text-white">
                  Generate a PIN and share it with the user to allow document upload.
                </label>
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    id="pin"
                    name="pin"
                    value={formData.pin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                    placeholder="••••"
                    maxLength={4}
                    pattern="[0-9]{4}"
                    required={!isLogin}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPin ? "🙈" : "👁️"}
                  </button>
                </div>
                <p className="text-xs text-gray-400">4-digit numeric PIN</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-4 px-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 focus:scale-95 ${
                submitting
                  ? "bg-gray-600 cursor-not-allowed scale-100"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </span>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: "", email: "", password: "", pin: "" });
              }}
              className="text-blue-300 hover:text-white font-medium transition-colors group"
            >
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <span className="text-blue-400 group-hover:underline">Sign up</span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span className="text-blue-400 group-hover:underline">Sign in</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4 text-center">
          <p className="text-gray-400 text-sm">
            {isLogin ? "Secure access to your dashboard" : "Your data is safe with us"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;