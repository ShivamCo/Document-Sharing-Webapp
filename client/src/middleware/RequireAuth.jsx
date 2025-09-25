
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const RequireAuth = () => {
  const { user, loading, authError, checkAuth } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const verify = async () => {
      await checkAuth();
      setChecked(true); 
    };
    verify();
  }, [checkAuth]);

  if (loading || !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (authError || !user) {
    return <Navigate to="/user" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
